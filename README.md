# stattic

[![npm](https://img.shields.io/npm/v/stattic.svg?style=flat-square)](https://www.npmjs.com/package/stattic)
[![npm](https://img.shields.io/npm/dt/stattic.svg?style=flat-square)](https://www.npmjs.com/package/stattic)

Ridiculous simple script for serving static files using `http` module.


## Install

Install it using NPM:

```sh
npm install stattic
```

## Usage

Example of a very simple server that shows all the static files on the `public` folder:

```javascript
//Import libs
var stattic = require('stattic');

//Set the folder with the static files
stattic.set('static', './public');

//Set the port
stattic.set('port', 5000);

//Run the server
stattic.run();
```

#### stattic.set(key, value)

Use this method for set the settings of your server. The following table lists the available `key` settings:

| key | Description | Type |
|-----|-------------|------|
| static | Sets the path of your static files folder. | String |
| port | Sets the port of your server. Default is 5000. | Integer |


#### stattic.run()

Starts the server.
