//Import dependencies
var fs = require('fs');
var path = require('path');
var http = require('http');

//Import stattic functions
var parseUrl = require('stattic-parseurl');
var pStat = require('stattic-pstat');
var getMime = require('stattic-mime');

//Create the server object
var server = {};

//Set the static folder
server._static = '';

//Set the server port
server._port = 5000;

//Set the cors
server._cors = true;

//Set the index file
server._index = 'index.html';

//Set the server error 404 message
server._error = '<h1>Not found...</h1>';

//Initialize the http client
server._http = null;

//Set the default vars
server.set = function(key, value)
{
  //Check for static files folder
  if(key === 'static'){ server._static = value; }

  //Check for port
  else if(key === 'port'){ server._port = parseInt(value); }

  //Check for Cross Origin
  else if(key === 'cors'){ server._cors = value; }

  //Check for index file
  else if(key === 'index'){ server._index = value; }

  //Default
  else { console.warn('Stattic Error: Unknown key "' + key + '" used in set method.'); }
};

//Create the server
server.run = function()
{
  //Check the statics folder
  if(server._static === '')
  {
    //Show error
    console.error('Stattic Error: no statics folder selected.');

    //Exit
    return;
  }

  //Fix the stattic files folder
  server._static = path.resolve(process.cwd(), server._static);

  //Initialize the server
  server._http = http.createServer(server._Server);

  //Start server
  server._http.listen(server._port, function(){

    //Show the console log success
    console.log('');
    console.log('Welcome to Stattic');
    console.log('Visit us: http://statticjs.github.io');
    console.log('');
    console.log('Static server listening on: http://localhost:' + server._port);
    console.log('Static files listening from: ' + server._static);
    console.log('');

  });

};

//Serve the static files
server._Server = function(req, res)
{
  //Set the CORS
  if(server._cors === true)
  {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  }

  //Initialize the http code
  var httpc = 200;

  //Get the real path to the file
  var url = path.join(server._static, req.url);

  //Parse the url
  url = parseUrl(url);

  //Check the root file
  if(url.file === '')
  {
    //Update the url object
    url = parseUrl(url.path + server._index);
  }

  //Time for make the request
  var time = Date.now();

  //Check if file exists
  if(pStat.isFile(url.path) === true)
  {
    //Get the mime
    var mime = getMime(url.ext);

    //Write header
  	res.writeHead(200, {"Content-Type": mime});

    //Get the file content
    var cont = fs.readFileSync(url.path);

    //Show the file content
    res.end(cont);
  }
  else
  {
    //Write header for the error page
    res.writeHead(404, {"Content-Type": "text/html"});

    //Show the error message
    res.end(server._error);

    //Replace the http code
    httpc = 404;
  }

  //Count the end time
  time = Date.now() - time;

  //Show in console que request
  console.log(httpc + ' ' + req.url + '  ' + time + ' ms');
};

//Exports to node
module.exports = server;
