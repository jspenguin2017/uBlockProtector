"use strict";

/**
 * Load modules.
 * @const {Module}
 */
const { parse } = require("url");
const { request } = require("https");
const { createWriteStream } = require("fs");
/**
 * The download link of uBO-Extra.
 * @const {string}
 */
const source = "https://raw.githubusercontent.com/gorhill/uBO-Extra/master/contentscript.js";
/**
 * The output file path, expects the current working directory is "Git Root/Extension Compiler".
 * @const {string}
 */
const output = "./Extension/content/ubo-extra.js";

//Download and overwrite the file
request(parse(source), (res) => {
    res.pipe(createWriteStream(output));
    res.on("end", () => {
        console.log("done");
    });
}).on("error", (err) => {
    console.log("Error:");
    console.log(err);
}).end();

//Prevent event loop from closing
setInterval(() => { }, 10000);
