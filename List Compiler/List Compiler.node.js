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

    let accepting = true;
    let inPragmaBlock = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
            continue;
        }

        if (line.startsWith("!@pragma-if-true")) {
            if (inPragmaBlock) {
                throw new Error("A @pragma-if-true directive is enclosed in another @pragma-if-* block");
            }

            accepting = true;
            inPragmaBlock = true;
            continue;
        }
        if (line.startsWith("!@pragma-if-false")) {
            if (inPragmaBlock) {
                throw new Error("A @pragma-if-false directive is enclosed in another @pragma-if-* block");
            }

            accepting = false;
            inPragmaBlock = true;
            continue;
        }
        if (line.startsWith("!@pragma-else")) {
            if (!inPragmaBlock) {
                throw new Error("A @pragma-else directive does not have a matching @pragma-if-* directive");
            }

            accepting = !accepting;
            continue;
        }
        if (line.startsWith("!@pragma-end-if")) {
            if (!inPragmaBlock) {
                throw new Error("A @pragma-end-if directive does not have a matching @pragma-if-* directive");
            }

            accepting = true;
            inPragmaBlock = false;
            continue;
        }
        if (line.startsWith("!@pragma-")) {
            console.warn(`Unrecognized directive ${line.substring(1)}`);
        }

        if (removeComments && line.charAt(0) === '!') {
            continue;
        }

        if (accepting) {
            output.push(line);
        }
    }

    if (inPragmaBlock) {
        throw new Error("A @pragma-if-* directive does not have a matching @pragma-end-if directive");
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
