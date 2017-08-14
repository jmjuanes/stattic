//Import stattic
var stattic = require('./index.js');

//Set the path
stattic.set('folder', './public/');

//Set the port
stattic.set('port', 5000);

//Set the index file
stattic.set('index', 'index.html');

//Run the server
stattic.listen();
