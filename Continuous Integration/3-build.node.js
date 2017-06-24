/**
 * Build and publish the new version, this script will swallow all errors and only display hard coded
 * error message for security.
 * Expects the current working directory to be the Git Root.
 * Exit code: 0 success, 1 caught error, 2 uncaught error.
 * Commit message must start with "@build-script-run" for this script to run.
 * If commit message starts with "@build-script-run @build-script-force-run", then version check is skipped.
 */
"use strict";

//Register unexpected error handler, swallow all uncaught errors as they may contain credentials
process.on("uncaughtException", () => {
    console.error("Unknown error: This could be caused by a bug in the build script.");
    process.exit(2);
});

//Start
console.log("=====3-build.node.js starts=====");

/**
 * Load modules.
 * @const {Module}
 */
const https = require("https");
const url = require("url");
const fs = require("fs");
let archiver;
try {
    archiver = require("archiver");
} catch (err) {
    console.error("Could not load archiver module: Module not installed.");
    process.exit(1);
}

/**
 * Print end message and exit with exit code 0.
 * @function
 */
const exit = () => {
    console.log("=====3-build.node.js ends=====");
    process.exit(0);
};

/**
 * Version object.
 * @class
 */
const Version = class {
    /**
     * Constructor.
     * @constructor
     * @param {string} v - The version string, must be like "1.4".
     */
    constructor(v) {
        const i = v.indexOf(".");
        this.major = parseInt(v.substring(0, i));
        this.minor = parseInt(v.substring(i + 1));
    }
};
/**
 * See if two versions are identital.
 * @function
 * @param {Version} v1 - The first version.
 * @param {Version} v2 - The second version.
 */
const verSame = (v1, v2) => v1.major === v2.major && v1.minor === v2.minor;
/**
 * See if two versions are consecutive.
 * @function
 * @param {Version} v1 - The first version.
 * @param {Version} v2 - The second version.
 */
const verNeedUpdate = (v1, v2) => {
    if (v1.major === v2.major) {
        return v1.minor + 1 === v2.minor;
    } else {
        //Change in major version is hard to handle, as it happens once a blue moon this should be good enough
        return v1.major + 1 === v2.major && v2.minor === 0;
    }
};

/**
 * Serialize an object to parameters, throws error if the object is invalid.
 * @param {Object} obj - The object to serialize
 */
const serialize = (obj) => {
    let str = "";
    for (let key in obj) {
        if (str !== "") {
            str += "&";
        }
        if (typeof obj[key] === "string") {
            str += `${key}=${encodeURIComponent(obj[key])}`;
        } else {
            throw "Invalid parameter";
        }
    }
    return str;
};

/**
 * Disable debug mode.
 * Will fail the build if the task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 */
const disableDebugMode = () => {
    console.log("Disabling debug mode...");
    return new Promise((resolve) => {
        const file = "./Extension Compiler/Extension/common.js";
        fs.readFile(file, { encoding: "utf8" }, (err, data) => {
            if (err) {
                console.error("Could not set debug switch: Could not read file.");
                process.exit(1);
            } else {
                fs.writeFile(file, data.replace(
                    "a.debugMode = true; \/\/@pragma-debug-switch",
                    "a.debugMode = false; \/\/@pragma-debug-switch"
                ), (err) => {
                    if (err) {
                        console.error("Could not set debug switch: Could not write to file.");
                        process.exit(1);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};
/**
 * Create zip archive ready for upload.
 * Will fail the build if the task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Buffer} data - The zip data.
 */
const zip = () => {
    console.log("Creating zip archive...");
    return new Promise((resolve) => {
        let data = [];
        let archive = archiver.create("zip", {});
        archive.on("warning", () => {
            console.error("Could not create archive: Something went wrong.");
            process.exit(1);
        });
        archive.on("error", () => {
            console.error("Could not create archive: Something went wrong.");
            process.exit(1);
        });
        archive.on("data", (c) => { data.push(c); });
        archive.on("end", () => {
            resolve(Buffer.concat(data));
        });
        archive.directory("./Extension Compiler/Extension", false);
        archive.finalize();
    });
};

/**
 * Obtain OAuth2 access token, credentials are read from secure environment variables.
 * Will fail the build if the task could not be completed.
 * Obtain client ID and secret: https://developers.google.com/identity/protocols/OAuth2
 * Obtain OAuth2 code and redeem refresh token: https://developer.chrome.com/webstore/using_webstore_api
 * @function
 * @return {Promise} The promise of the task.
 ** @param {string} token - The access token.
 */
const OAuth2 = () => {
    console.log("Obtaining access token...");
    return new Promise((resolve) => {
        //Prepare payload
        let payload;
        try {
            payload = serialize({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
                grant_type: "refresh_token",
            });
        } catch (err) {
            console.error("Could not obtain access token: Secure environment variables are invalid.");
            process.exit(1);
        }
        //Send request
        let request = https.request(Object.assign(url.parse("https://accounts.google.com/o/oauth2/token"), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": payload.length,
            },
        }), (res) => {
            let data = "";
            res.on("data", (s) => { data += s; });
            res.on("error", () => {
                console.error("Could not obtain access token: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error || typeof response.access_token !== "string") {
                        console.error("Could not obtain access token: Remote server returned an error.");
                        process.exit(1);
                    } else {
                        resolve(response.access_token);
                    }
                } catch (err) {
                    console.error("Could not obtain access token: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not obtain access token: Could not connect to remote server.");
            process.exit(1);
        });
        request.write(payload);
        request.end();
    });
};
/**
 * Upload a new build to the store.
 * Will fail the build if the task could not be completed.
 * @function
 * @param {string} token - The access token.
 * @param {Buffer} data - The new build package.
 * @return {Promise} The promise of the task.
 */
const upload = (token, data) => {
    console.log("Uploading new build...");
    return new Promise((resolve) => {
        let request = https.request(Object.assign(url.parse("https://www.googleapis.com/upload/chromewebstore/v1.1/items/ggolfgbegefeeoocgjbmkembbncoadlb"), {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-goog-api-version": "2",
            },
        }), (res) => {
            let data = "";
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not upload new build: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.uploadState === "SUCCESS") {
                        resolve();
                    } else if (response.uploadState === "IN_PROGRESS") {
                        console.log("Remote server is processing the uploaded package, continuing in 1 minute.");
                        setTimeout(resolve, 60 * 1000); //Wait a minute
                    } else {
                        console.error("Could not upload new build: Remote server returned an error.");
                        process.exit(1);
                    }
                } catch (err) {
                    console.error("Could not upload new build: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not upload new build: Could not connect to remote server.");
            process.exit(1);
        });
        request.write(data);
        request.end();
    });
};
/**
 * Publish the new build.
 * Will fail the build if the task could not be completed.
 * @function
 * @param {string} token - The access token.
 * @return {Promise} The promise of the task.
 */
const publish = (token) => {
    console.log("Publishing new build...");
    return new Promise((resolve) => {
        let request = https.request(Object.assign(url.parse("https://www.googleapis.com/chromewebstore/v1.1/items/ggolfgbegefeeoocgjbmkembbncoadlb/publish"), {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-goog-api-version": "2",
                "Content-Length": "0",
            },
        }), (res) => {
            let data = "";
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not upload new build: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        console.error("Could not publish new build: Remote server returned an error.");
                        process.exit(1);
                    } else if (response.status.includes("ITEM_PENDING_REVIEW") || response.status.includes("OK")) {
                        console.log("New build published, it will show up in the store after it is reviewed.");
                        resolve();
                    } else {
                        console.error("Could not publish new build: Remote server returned an error.");
                        process.exit(1);
                    }
                } catch (err) {
                    console.error("Could not publish new build: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not publish new build: Could not connect to remote server.");
            process.exit(1);
        });
        request.end();
    });
};

/**
 * Find published version number.
 * Will fail the build if the task could not be completed.
 * The "proper" API for this seems to only work for unpublished draft: https://developer.chrome.com/webstore/webstore_api/items/get
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v1 - The version.
 */
const getPublishedVersion = () => {
    console.log("Obtaining published version number...");
    return new Promise((resolve) => {
        let request = https.request(url.parse("https://chrome.google.com/webstore/detail/ublock-protector-extensio/ggolfgbegefeeoocgjbmkembbncoadlb"), (res) => {
            let data = "";
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not obtain published version number: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                let match;
                try {
                    match = (/<meta itemprop="version" content="(\d+\.\d+)" \/>/).exec(data);
                } catch (err) { } //Error handled below
                if (match) {
                    resolve(new Version(match[1]));
                } else {
                    console.error("Could not obtain published version number: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", (err) => {
            console.error("Could not obtain published version number: Could not connect to remote server.");
            process.exit(1);
        });
        request.end();
    });
};
/**
 * Find local version number.
 * Will fail the build if the task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v2 - The version.
 */
const getLocalVersion = () => {
    console.log("Obtaining local version number...");
    return new Promise((resolve) => {
        fs.readFile("./Extension Compiler/Extension/manifest.json", { encoding: "utf8" }, (err, data) => {
            if (err) {
                console.error("Could not obtain local version number: Could not open file.");
                process.exit(1);
            } else {
                try {
                    const ver = JSON.parse(data).version;
                    if ((/^\d+\.\d+$/).test(ver)) {
                        resolve(new Version(ver));
                    } else {
                        console.error("Could not obtain local version number: Version string is invalid.");
                        process.exit(1);
                    }
                } catch (err) {
                    console.error("Could not obtain local version number: Could not parse manifest.");
                    process.exit(1);
                }
            }
        });
    });
};

/**
 * Build and publish.
 * @function
 */
const build = () => {
    //Upload and publish
    let data, token;
    disableDebugMode().then(() => {
        return zip();
    }).then((d) => {
        data = d;
        return OAuth2();
    }).then((t) => {
        token = t;
        return upload(token, data);
    }).then(() => {
        return publish(token);
    }).then(exit);
};

//Check if I have credentials, pull requests do not have access to credentials, I do not want to push to store for pull
//requests anyway, do not fail the build as that can cause confusions
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REFRESH_TOKEN) {
    console.log("Secure environment variables are missing, skipping build.");
    exit();
}
if (process.env.TRAVIS_COMMIT_MESSAGE.startsWith("@build-script-run")) {
    console.log("Build instruction not found, skipping build.");
    exit();
}
//Check version
Promise.all([
    getPublishedVersion(),
    getLocalVersion(),
]).then((versions) => {
    if (process.env.TRAVIS_COMMIT_MESSAGE.startsWith("@build-script-run @build-script-force-run")) {
        console.warn("Force build instruction received.");
        build();
    } else {
        if (verSame(...versions)) {
            //Nothing to do
            console.log("Store version up to date, nothing to build.");
            exit();
        } else if (verNeedUpdate(...versions)) {
            build();
        } else {
            //Version is broken
            console.error("Version error: Unexpected versions, maybe last version is not yet approved.");
            process.exit(1);
        }
    }
});
