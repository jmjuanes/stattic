#!/usr/bin/env node

let stattic = require("./index.js");
let getArgs = require("get-args");
let path = require("path");

process.nextTick(function(){
    let args = getArgs();
    let folder = process.cwd();

    //Check the folder value
    if (typeof args.options.folder === "string" && args.options.folder !== "") {
        folder = path.resolve(process.cwd(), args.options.folder);
    }
    stattic.set("folder", folder);

    //Set the cors
    if (typeof args.options.cors === "boolean") {
        stattic.set("cors", true);
    }

    //Set the port
    if (typeof args.options.port === "string" && args.options.port !== "") {
        stattic.set("port", parseInt(args.options.port));
    }

    //Run the web server
    stattic.listen();
});
