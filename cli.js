//Import dependencies
var stattic = require('./index.js');
var nutty = require('nutty');
var path = require('path');

//Import package configuration
var pkg = require('./package.json');

//Register the nutty application
nutty.set('name', 'stattic');
nutty.set('description', '');
nutty.set('version', pkg.version);

//Main
nutty.use(function(args)
{
  //Initialize the folder path
  var folder = process.cwd();

  //Check the folder value
  if(typeof args.options.folder === 'string' && args.options.folder !== '')
  {
    //Add the folder value
    folder = path.resolve(process.cwd(), args.options.folder);
  }

  //Save the folder value
  stattic.set('folder', folder);

  //Check the cors
  if(typeof args.options.cors === 'boolean'){ stattic.set('cors', true); }

  //Set the port
  if(typeof args.options.port === 'string' && args.options.port !== '')
  {
    //Save the port value
    stattic.set('port', parseInt(args.options.port));
  }

  //Run the web server
  stattic.listen();
});

//Run nutty
nutty.run();
