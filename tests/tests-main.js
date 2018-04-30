/**
 * Tests entry point.
 */
"use strict";


/**
 * Load modules.
 * @const {Module}
 */
const assert = require("assert");
const checkSyntax = require("./check-syntax.js");


process.on("unhandledRejection", (e) => {
    throw e;
});

assert(/[\\/]uBlockProtector$/.test(process.cwd()));

(async () => {
    await checkSyntax.validateDirectory("./src");
})();
