let fs = require("fs");
let path = require("path");
let http = require("http");
let url = require("url");
let mime = require("mime");

//Server default options
let defaultOptions = {
    "folder": "./", //process.cwd(),
    "port": 5000, 
    "cors": false, 
    "index": "index.html"
    //"errorTemplate": path.resolve(__dirname, "./assets/error.html")
};

//Display an error page
let renderError = function (res, errorCode, errorMessage) {
    //Write the response header with the response code
    res.writeHead(errorCode, {
        "Content-Type": "text/html"
    });
    //Send the response message
    return res.end(errorMessage);
};

//Create the server
module.exports = function (options, cb) {
    //Parse the options
    options = Object.assign({}, defaultOptions, options);
    options.folder = path.resolve(process.cwd(), options.folder);
    //options.errorTemplate = path.resolve(process.cwd(), options.errorTemplate);
    //Initialize the server
    let server = http.createServer(function (req, res) {
        let timeStart = Date.now();
        //Check the cors option
        if (options.cors === true) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        }
        //Parse the request path
        let pathname = url.parse(req.url).pathname;
        pathname = path.normalize(pathname); //Fix path traversal
        let localPath = path.join(options.folder, pathname);
        if (path.extname(localPath) === "") {
            //Add the index file to the local path
            localPath = path.join(localPath, "./" + path.basename(options.index));
        }
        //Reponse finish event
        res.on("finish", function () {
            console.log("" + res.statusCode + "  " + pathname + "  " + (Date.now() - timeStart) + " ms");
        });
        //Check if file exists 
        return fs.stat(localPath, function (error, stat) {
            if (error) {
                if (error.code === "ENOENT") {
                    return renderError(res, 404, "File not found");
                }
                //Internal server error
                return renderError(res, 500, "Internal server error");
            }
            //Check if path is not a file
            if (stat.isFile() === false) {
                return renderError(res, 404, "File not found"); 
            }
            //Write the header with the content type
            res.writeHead(200, {
                "Content-Type": mime.getType(localPath)
            });
            //Initialize the reader stream
            //let reader = fs.createReadStream(local_path, { encoding: "utf8" });
            //Remove encoding -> fixed bug reading images (jpg, png, etc...)
            let reader = fs.createReadStream(localPath);
            reader.on("data", function (data) {
                res.write(data);
            });
            reader.on("end", function () {
                res.end("");
            });
            //Error reading the file: unknown error...
            reader.on("error", function (error) {
                return renderError(res, 500, "Something went wrong...");
            });
        });
    });
    //Start server
    server.listen(options.port, function () {
        //Check for custom callback method provided
        if (typeof cb === "function") {
            return cb();
        }
        //Show the console log success
        console.log("");
        console.log("Static server listening on: " + "http://localhost:" + options.port + "");
        console.log("Reading files from: " + options.folder + "");
        console.log("");
    });
};

