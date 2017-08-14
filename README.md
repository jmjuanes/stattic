# stattic

[![npm](https://img.shields.io/npm/v/stattic.svg?style=flat-square)](https://www.npmjs.com/package/stattic)
[![npm](https://img.shields.io/npm/dt/stattic.svg?style=flat-square)](https://www.npmjs.com/package/stattic)
[![Dependency Status](https://david-dm.org/statticjs/stattic.svg?style=flat-square)](https://david-dm.org/statticjs/stattic)
[![npm](https://img.shields.io/npm/l/stattic.svg?style=flat-square)](https://github.com/jmjuanes/stattic)

Ridiculous simple script for serving static files using `http` module.


## Installation

Install it using NPM:

```sh
npm install stattic --save
```

## Usage

Example of a very simple server that shows all the static files on the `public` folder:

```javascript
//Import libs
var stattic = require('stattic');

//Set the folder with the static files
stattic.set('folder', './public');

//Set the port
stattic.set('port', 5000);

//Run the server
stattic.listen();
```

## API

#### stattic.set(key, value)

Use this method for set the settings of your server. The following table lists the available `key` settings:

| key | Description | Type | Default value |
|-----|-------------|------|---------------|
| folder | Sets the path of your static files folder. | String | [`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd) |
| port | Sets the port of your server. | Integer | `5000` |
| cors | Enable cross-origin resource sharing (CORS). | Boolean | `true` |
| index | Sets the index file name. | String | `index.html` |

#### stattic.get(key)

Return the value associated with the key `key`.

#### stattic.listen()

Starts the server.

## CLI usage

You can install the CLI by running the following command: 

```
npm install -g stattic
```



## Contribute

Pull requests are always welcome :)
