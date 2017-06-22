"use strict";

/**
 * Load modules.
 * @const {Module}
 */
const { readFileSync, writeFileSync } = require("fs");
const { EOL } = require("os");

//Load sources into memory, comments needs to be removed for part 1 of rules
let output = [];

//Process metadata, remove empty lines
let lines = readFileSync("./List/Metadata.txt", "utf8").split("\n");
for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    line && output.push(line);
}
//Process rules part 1, remove empty lines and comments
lines = readFileSync("./List/Rules Part 1.txt", "utf8").split("\n");
for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line && line.charAt(0) !== '!') {
        output.push(line);
    }
}
//Process rules part 2, remove empty lines
lines = readFileSync("./List/Rules Part 2.txt", "utf8").split("\n");
for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    line && output.push(line);
}
//Add an empty line at the end of the output
output.push("");

//Write output
writeFileSync("../uBlockProtectorList.txt", output.join(EOL));
console.log("Done.");
