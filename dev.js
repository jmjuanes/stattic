//Import stattic
var stattic = require('./stattic.js');

//Set the path
stattic.set('static', './');

//Set the port
stattic.set('port', 5000);

//Set the index file
stattic.set('index', 'index.html');

//Run the server
stattic.run();
