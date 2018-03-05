let fs = require("fs");
let path = require("path");
let http = require("http");
let url = require("url");
let mime = require("mime");
let utily = require("utily");

//Server options
let options = {folder: process.cwd(), port: 5000, cors: false, index: "index.html"};

//Get the default error file path
options.error = path.resolve(__dirname, "./assets/error.html");

//Change a default option value
module.exports.set = function (key, value) {
    if (typeof options[key] === "undefined") {
        throw new Error("Unknown key '" + key + "'");
    }
    if (typeof options[key] !== typeof value) {
        throw new Error("Invalid key type '" + key + "'");
    }
    options[key] = value;
};

//Get a value
module.exports.get = function (key) {
    return options[key];
};

//Create the server
module.exports.listen = function (port, cb) {
    //Parse the arguments
    cb = (typeof port === "function") ? port : cb;
    port = (typeof port === "number") ? parseInt(port) : options.port;

    //Get the static files folder path
    options.folder = path.resolve(process.cwd(), options.folder);

    //Get the error file path
    options.error = path.resolve(process.cwd(), options.error);

    //Initialize the server
    let server = http.createServer(function (req, res) {
        let timeStart = Date.now();

        //Check the cors option
        if (options.cors === true) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        }
        let pathname = url.parse(req.url).pathname;
        let localPath = path.join(options.folder, pathname);
        if (path.extname(localPath) === "") {
            //Add the index file to the local path
            localPath = path.join(localPath, "./" + path.basename(options.index));
        }

        //Reponse finish event
        res.on("finish", function () {
            console.log("" + res.statusCode + "  " + pathname + "  " + (Date.now() - timeStart) + " ms");
        });

        //Check if the file exists in this directory
        return utily.fs.isFile(localPath, function (error, exists) {
            if (error) {
                return errorPage(res, 500, "Error processing your request.");
            }
            if (exists === false) {
                return errorPage(res, 404, "File not found.");
            }

            //Write the header with the content type
            res.writeHead(200, {"Content-Type": mime.getType(localPath)});

            //Initialize the reader stream
            //let reader = fs.createReadStream(local_path, { encoding: "utf8" });
            //Remove encoding -> fixed bug reading images (jpg, png, etc...)
            let reader = fs.createReadStream(localPath);
            reader.on("data", function (data) {
                //Write the data to the response
                res.write(data);
            });
            reader.on("end", function () {
                res.end("");
            });
            reader.on("error", function (error) {
                return errorPage(res, 500, "Something went wrong...");
            })
        });
    });

    //Start server
    server.listen(port, function () {
        if (typeof cb === "function") {
            cb.call(null);
        }
        else {
            //Show the console log success
            console.log("");
            console.log("Static server listening on: " + "http://localhost:" + options.port + "");
            console.log("Reading files from: " + options.folder + "");
            console.log("");
        }
    });
};

//Display an error page
let errorPage = function (res, errorCode, errorMessage) {
    res.writeHead(errorCode, {"Content-Type": "text/html"});
    //Read the local error file
    return fs.readFile(options.error, "utf8", function (error, data) {
        //Check the error
        if (error) {
            return res.end("<" + "h1>Error</h1><p>" + errorMessage + "</p>");
        }
        data = utily.string.format(data, {code: errorCode, message: errorMessage});
        return res.end(data);
    });
};
