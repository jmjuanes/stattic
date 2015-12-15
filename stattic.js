//Import dependencies
var fs = require('fs');
var path = require('path');
var http = require('http');

//Function for check if file exists
function fileExists(filePath)
{
  //Try open the file
  try
  {
    //Check if is a file and return
    return fs.statSync(filePath).isFile();
  }
  catch(err)
  {
    //Return file doesnt exists
    return false;
  }
}

//Create the server object
var server = {};

//Set the static folder
server._static = '';

//Set the server port
server._port = 5000;

//Set the server error 404 message
server._error = '<h1>Not found...</h1>';

//Initialize the http client
server._http = null;

//Get the mime types
server._mime = require('./utils/mime.json');

//Set the default vars
server.set = function(key, value)
{
  //Check for static files folder
  if(key === 'static'){ server._static = value; }

  //Check for port
  else if(key === 'port'){ server._port = parseInt(value); }

  //Default
  else { console.warn('Unknown key "' + key + '" used in set method.'); }
};

//Create the server
server.run = function()
{
  //Check the statics folder
  if(server._static === '')
  {
    //Show error
    console.error('Error on Statty: no statics folder selected.');

    //Exit
    return;
  }

  //Initialize the server
  server._http = http.createServer(server._Server);

  //Create the console log success
  var su = 'Static files listening on: http://localhost:' + server._port;

  //Start server
  server._http.listen(server._port, function(){ console.log(su); console.log(''); });
};

//Serve the static files
server._Server = function(req, res)
{
  //Get the real path to the file
  var url = path.join(server._static, req.url);

  //Get the file extension and remove the first '.'
  var ext = path.extname(req.url).replace('.', '');

  //Time for make the request
  var time = Date.now();

  //Check if file exists
  if(fileExists(url) === true)
  {
    //Get the mime type
    if(typeof server._mime[ext] === 'undefined')
    {
      //Set the default mime value
      var mime = 'text/plain';
    }
    else
    {
      //Get the mime type for the file
      var mime = server._mime[ext];
    }

    //Write header
  	res.writeHead(200, {"Content-Type": mime});

    //Get the file content
    var cont = fs.readFileSync(url, 'utf-8');

    //Show the file content
    res.end(cont);

    //Save the http code
    var httpc = 200;
  }
  else
  {
    //Write header for the error page
    res.writeHead(404, {"Content-Type": "text/html"});

    //Show the error message
    res.end(server._error);

    //Save the http code
    var httpc = 404;
  }

  //Count the end time
  time = Date.now() - time;

  //Show in console que request
  console.log(httpc + ' ' + req.url + '  ' + time + ' ms');
};

//Exports to node
module.exports = server;
