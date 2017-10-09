//Download and update uBO-Extra file from upstream
//The current working directory should be "/Extension Compiler"
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
const output = "./Extension/content/5-ubo-extra.js";
/**
 * The write stream of the output.
 * @const {Stream}
 */
const writeStream = createWriteStream(output);

//Write top wrapper
writeStream.write(`(() => { if (a.uBOExtraExcluded) { return; }\n\n`);
//Download and overwrite the file
request(parse(source), (res) => {
    res.pipe(writeStream, { end: false });
    res.on("end", () => {
        //Write bottom wrapper
        writeStream.end(`\n})();\n`);
        console.log("Done.");
    });
    res.on("error", (err) => {
        console.log("Error:");
        console.log(err);
    })
}).on("error", (err) => {
    console.log("Error:");
    console.log(err);
}).end();
