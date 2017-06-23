//Build and publish the new version
"use strict";

console.log("=====3-build.node.js starts=====");

//Test secure variable
if (process.env.SECRET === "test") {
    console.log("secure environment variable is working properly.");
} else {
    process.exit(1);
}

console.log("=====3-build.node.js ends=====");
