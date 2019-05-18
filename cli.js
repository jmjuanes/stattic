#!/usr/bin/env node

//Import dependencies
let stattic = require("./index.js");
let getArgs = require("get-args");
let path = require("path");

process.nextTick(function(){
    let args = getArgs();
    let options = {};
    //Check the folder option
    if (typeof args.options.folder === "string" && args.options.folder !== "") {
        options.folder = path.resolve(process.cwd(), args.options.folder);
    }
    //Check the cors option
    if (typeof args.options.cors === "boolean") {
        options.cors = true;
    }
    //Check the port options
    if (typeof args.options.port === "string" && args.options.port !== "") {
        options.port = parseInt(args.options.port);
    }
    //Run the web server with the provided options
    stattic(options);
});

