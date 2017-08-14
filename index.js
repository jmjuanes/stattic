//Import dependencies
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var mime = require('mime');
var utily = require('utily');
var logty = require('logty');

//Server options
var options = { folder: process.cwd(), port: 5000, cors: true, index: 'index.html' };

//Get the default error file path
options.error = path.resolve(__dirname, './assets/error.html');

//Set the default vars
module.exports.set = function(key, value)
{
  //Check the key
  if(typeof options[key] === 'undefined'){ throw new Error('Unknown key "' + key + '"'); }

  //Check the key type
  if(typeof options[key] !== typeof value){ throw new Error('Invalid key type "' + key + '"'); }

  //Save the option value
  options[key] = value;
};

//Get a value
module.exports.get = function(key)
{
  //Return the value
  return options[key];
};

//Create the server
module.exports.listen = function(port, cb)
{
  //Check the callback function
  cb = (typeof port === 'function') ? port : cb;

  //Check the port value
  port = (typeof port === 'number') ? parseInt(port) : options.port;

  //Fix the static files folder path
  options.folder = path.resolve(process.cwd(), options.folder);

  //Fix the error file path
  options.error = path.resolve(process.cwd(), options.error);

  //Initialize the server
  var server = http.createServer(function(req, res)
  {
    //Time for make the request
    var time_start  = Date.now();

    //Check the cors option
    if(options.cors === true)
    {
      //Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      //Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      //Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    }

    //Parse the request url and get only the pathname
    var pathname = url.parse(req.url).pathname;

    //Resolve to the local folder
    var local_path = path.join(options.folder, pathname);

    //Check the extension
    if(path.extname(local_path) === '')
    {
      //Add the index file to the local path
      local_path = path.join(local_path, './' + path.basename(options.index));
    }

    //Reponse finish event
    res.on('finish', function()
    {
      //Get the total time in ms
      var response_time = (Date.now() - time_start);

      //Get the response code
      var response_code = res.statusCode;

      //Display the log message
      console.log('' + response_code + ' ' + pathname + '  ' + response_time + ' ms');
    });

    //Check if the file exists in this directory
    return utily.fs.isFile(local_path, function(error, exists)
    {
      //Check the error
      if(error){ return error_page(res, 500, 'Error'); }

      //Check if file does not exists
      if(exists === false){ return error_page(res, 404, 'Not found'); }

      //Write the header with the content type
      res.writeHead(200, { 'Content-Type': mime.lookup(local_path) });

      //Initialize the reader stream
      var reader = fs.createReadStream(local_path, { encoding: 'utf8' });

      //Reader data
      reader.on('data', function(data)
      {
        //Write the data to the response
        res.write(data);
      });

      //No more data -> End event
      reader.on('end', function()
      {
        //End the write
        res.end('');
      });

      //Error reading file
      reader.on('error', function(error)
      {
        //Render the error page
        return error_page(res, 500, 'Something went wrong...');
      })
    });
  });

  //Start server
  server.listen(port, function()
  {
    //Show the console log success
    console.log('');
    console.log('Welcome to Stattic');
    console.log('');
    console.log('Static server listening on: http://localhost:' + options.port);
    console.log('Static files listening from: ' + options.folder);
    console.log('');

    //Check if the callback method is a function
    if(typeof cb === 'function')
    {
      //Call the callback function
      cb.call(null);
    }
  });
};

//Display an error page
var error_page = function(res, error_code, error_message)
{
  //Write the header with the content type
  res.writeHead(error_code, { 'Content-Type': 'text/html' });

  //Read the error file path
  return fs.readFile(options.error, function(error, data)
  {
    //Check the error
    if(error){ return res.end('<h1>Error</h1><p>' + error_message + '</p>'); }

    //Replace the html file
    data = utily.string.format(data, { code: error_code, message: error_message });

    //Return the error page
    return res.end(data);
  });
};
