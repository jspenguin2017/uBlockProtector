//Check the functionality of content rules
"use strict";

console.log("=====2-test-3-content-rules.node.js starts=====");

/**
 * Load module.
 * @const {Module}
 */
const { readFileSync } = require("fs");

//Prepare environment
let a = {};
a.init = () => { };
a.generic = () => { };
a.generic.Adfly = () => { };
a.generic.NoAdBlock = () => { };
a.domCmp = (domList, noErr) => {
    if (typeof domList !== "object") {
        console.error("a.domCmp() does not accept this as domList:");
        console.error(domList);
        process.exit(1);
    }
    if (noErr !== true && noErr !== undefined) {
        console.error("a.domCmp() does not accept this as noErr:");
        console.error(noErr);
        process.exit(1);
    }
    return false;
}
a.domInc = (domList, noErr) => {
    if (typeof domList !== "object") {
        console.error("a.domInc() does not accept this as domList:");
        console.error(domList);
        process.exit(1);
    }
    if (noErr !== true && noErr !== undefined) {
        console.error("a.domInc() does not accept this as noErr:");
        console.error(noErr);
        process.exit(1);
    }
    return false;
}

//Test
eval(readFileSync("./Extension Compiler/Extension/content/3-content-rules-1-common.js", "utf8"));
eval(readFileSync("./Extension Compiler/Extension/content/3-content-rules-2-specific.js", "utf8"));
eval(readFileSync("./Extension Compiler/Extension/content/3-content-rules-3-sticky.js", "utf8"));
console.log("a.domCmp() and a.domInc() are validly called.");

console.log("=====2-test-3-content-rules.node.js ends=====");
