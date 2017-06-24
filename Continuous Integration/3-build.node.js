//Build and publish the new version
//Expects the current working directory to be the Git Root
//Exit code:
//0: success, 1: caught error, 2: uncaught error
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
    console.error("Could not load archiver module.");
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
 * Disable debug mode.
 * Will fail the build if the task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 */
const disableDebugMode = () => {
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
 * Obtain OAuth2 token, credentials are read from secure environment variables.
 * Will fail the build if the task could not be completed.
 * Obtain client ID and secret: https://developers.google.com/identity/protocols/OAuth2
 * Obtain OAuth key: https://developer.chrome.com/webstore/using_webstore_api
 * @function
 * @return {Promise} The promise of the task.
 ** @param {string} token - The access token.
 */
const OAuth2 = () => {
    const serialize = (obj) => {
        let str = "";
        for (let key in obj) {
            if (str !== "") {
                str += "&";
            }
            str += `${key}=${encodeURIComponent(obj[key])}`;
        }
        return str;
    };
    return new Promise((resolve) => {
        //Prepare payload
        let payload;
        try {
            payload = serialize({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: process.env.OAUTH_KEY,
                grant_type: "authorization_code",
                scope: "https://www.googleapis.com/auth/chromewebstore",
                redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
            });
        } catch (err) {
            console.error("Could not obtain OAuth2 token: Secure environment variables are invalid.");
            process.exit(1);
        }
        //Send request
        https.request(Object.assign(url.parse("https://accounts.google.com/o/oauth2/token"), {
            method: "POST"
        }), (res) => {
            let data = "";
            res.on("data", (s) => { data += s; });
            res.on("error", () => {
                console.error("Could not obtain OAuth2 token: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data).access_token);
                } catch (err) {
                    console.error("Could not obtain OAuth2 token: Could not parse response.");
                    process.exit(1);
                }
            });
        }).on("error", () => {
            console.error("Could not obtain OAuth2 token: Could not connect to remote server.");
            process.exit(1);
        }).write(payload).end();
    })
};
const upload = () => {

};
const publish = () => {

}

/**
 * Find current version that is published in the store.
 * Will fail the build if the task could not be completed.
 * The "proper" API for this seems to only work for unpublished draft: https://developer.chrome.com/webstore/webstore_api/items/get
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v1 - The version.
 */
const getPublishedVersion = () => {
    return new Promise((resolve) => {
        https.request(url.parse("https://chrome.google.com/webstore/detail/ublock-protector-extensio/ggolfgbegefeeoocgjbmkembbncoadlb"), (res) => {
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
        }).on("error", (err) => {
            console.error("Could not obtain published version number: Could not connect to remote server.");
            process.exit(1);
        }).end();
    });
};
/**
 * Find local version that is ready to be published to the store.
 * Will fail the build if the task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v2 - The version.
 */
const getLocalVersion = () => {
    return new Promise((resolve) => {
        fs.readFile("./Extension Compiler/Extension/manifest.json", { encoding: "utf8" }, (err, data) => {
            if (err) {
                console.error("Could not obtain local version number: Could not open file.");
                process.exit(1);
            } else {
                try {
                    resolve(new Version(JSON.parse(data).version));
                } catch (err) {
                    console.error("Could not obtain local version number: Could not parse manifest.");
                    process.exit(1);
                }
            }
        });
    });
};

//Check if I have credentials, pull requests do not have access to credentials, I do not want to push to store for pull
//requests anyway, do not fail the build as that can cause confusions
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.OAUTH_KEY) {
    console.log("Secure environment variables are missing, skipping build.");
    exit();
}
//Check version
Promise.all([
    getPublishedVersion(),
    getLocalVersion(),
]).then((versions) => {
    if (verSame(...versions)) {
        //Nothing to do
        console.log("Store version up to date, nothing to build.");
        exit();
    } else if (verNeedUpdate(...versions)) {
        disableDebugMode().then(() => {
            return zip();
        }).then((data) => {
            //
        });
    } else {
        //Version is broken
        console.error("Version error: Unexpected versions, maybe last version is not yet approved.");
        process.exit(1);
    }
});
