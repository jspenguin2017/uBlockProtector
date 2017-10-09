//Build filter list
"use strict";


/**
 * Load modules.
 * @const {Module}
 */
const { readFileSync, writeFileSync } = require("fs");
const { EOL } = require("os");

/**
 * The output buffer.
 * @var {Array.<string>}
 */
let output = [];

/**
 * Load and process a file.
 * @param {string} path - The path to the file.
 * @param {boolean} removeComments - Whether comments should be removed.
 */
const loadFile = (path, removeComments = true) => {
    const lines = readFileSync(path, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
            continue;
        }
        if (removeComments && line.charAt(0) === '!') {
            continue;
        }
        output.push(line);
    }
};


//Process files
loadFile("./List/1-header.txt", false);
loadFile("./List/2-integration.txt");
loadFile("./List/3-rules.txt");
loadFile("./List/4-generichide.txt");
loadFile("./List/5-white list.txt");
loadFile("./List/6-other.txt", false);

//Add an empty line at the end of the output
output.push("");

//Write output
writeFileSync("../uBlockProtectorList.txt", output.join(EOL));
console.log("Done.");
