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

    let inPragmaBlock = false;
    let accepting = true;
    let keepNextComment = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
            continue;
        }

        if (line === "!@pragma-if-true") {
            if (inPragmaBlock) {
                throw new Error("A @pragma-if-true directive is enclosed in another @pragma-if-* block");
            }

            inPragmaBlock = true;
            accepting = true;
            continue;
        }
        if (line === "!@pragma-if-false") {
            if (inPragmaBlock) {
                throw new Error("A @pragma-if-false directive is enclosed in another @pragma-if-* block");
            }

            inPragmaBlock = true;
            accepting = false;
            continue;
        }
        if (line === "!@pragma-else") {
            if (!inPragmaBlock) {
                throw new Error("A @pragma-else directive does not have a matching @pragma-if-* directive");
            }

            accepting = !accepting;
            continue;
        }
        if (line === "!@pragma-end-if") {
            if (!inPragmaBlock) {
                throw new Error("A @pragma-end-if directive does not have a matching @pragma-if-* directive");
            }

            inPragmaBlock = false;
            accepting = true;
            continue;
        }

        if (line === "!@pragma-keep-next-comment") {
            if (keepNextComment) {
                throw new Error("Last @pragma-keep-next-comment directive was not consumed");
            }

            if (accepting) {
                keepNextComment = true;
            }

            continue;
        }

        if (line.startsWith("!@pragma-")) {
            console.warn(`Unrecognized directive ${line.substring(1)}`);
        }

        if (removeComments && line.charAt(0) === '!') {
            if (keepNextComment) {
                keepNextComment = false;
            } else {
                continue;
            }
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
