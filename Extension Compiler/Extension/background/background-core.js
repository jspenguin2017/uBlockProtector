//The Core library for background rules
"use strict";

/**
 * Initialization.
 * @function
 */
a.init = () => {
    //Message listener
    chrome.runtime.onMessage.addListener((...args) => {
        if (args.length === 3) {
            //Each message must have "cmd" field for the command
            switch (args[0]["cmd"]) {
                /**
                 * Inject CSS to the caller tab.
                 * @param {string} data - The CSS code to inject.
                 */
                case "inject css":
                    if (args[1].tab && args[1].tab.id !== chrome.tabs.TAB_ID_NONE) {
                        chrome.tabs.insertCSS(args[1].tab.id, {
                            code: args[0]["data"],
                            frameId: args[1].frameId || 0,
                        }, () => {
                            if (chrome.runtime.lastError) {
                                //Ignore, assume the tab is closed
                            }
                        });
                    } //Ignore if not called from a proper tab
                    break;
                /**
                 * Do a cross origin XMLHttpRequest.
                 * @param {Object} details - The details object, see a.request() of content-core
                 ** for more information.
                 * @return {string|null} The response text, or null if the request failed.
                 */
                case "xhr":
                    if (typeof args[0].details === "object") {
                        console.warn(`Sending cross origin request to ${args[0].details.url}`);
                        let req = new XMLHttpRequest();
                        //Event handler
                        req.onreadystatechange = () => {
                            if (req.readyState === 4) {
                                try {
                                    args[2](req.responseText);
                                } catch (err) { }
                            }
                        };
                        //Create request
                        req.open(String(args[0].details.method), String(args[0].details.url));
                        //Set headers
                        if (typeof args[0].details.headers === "object") {
                            for (let key in args[0].details.headers) {
                                req.setRequestHeader(key, String(args[0].details.headers[key]));
                            }
                        }
                        //Send request
                        let payload = null;
                        if (args[0].details.payload) {
                            payload = String(args[0].details.payload);
                        }
                        req.send(payload);
                        return true; //The callback is done after this handler returns
                    } //Ignore if details is not valid
                /**
                 * Forcefully close the sender tab.
                 */
                case "remove tab":
                    if (args[1].tab && args[1].tab.id !== chrome.tabs.TAB_ID_NONE) {
                        chrome.tabs.remove(args[1].tab.id, () => {
                            if (chrome.runtime.lastError) {
                                //Ignore, assume the tab is already closed
                            }
                        });
                    } //Ignore if not called from a proper tab
                    break;
                default:
                    //Invalid command, ignore
                    break;
            }
        } //No command, ignore
    });
    //Extension icon click handler, open options page
    chrome.browserAction.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage();
    });
    //Set badge
    if (a.debugMode) {
        //Debug mode
        chrome.browserAction.setBadgeText({
            text: "DBG",
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#6996FF",
        });
    } else if (chrome.runtime.id !== "ggolfgbegefeeoocgjbmkembbncoadlb") {
        //Unpacked extension but not in debug mode
        chrome.browserAction.setBadgeText({
            text: "DEV",
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#25BA42",
        });
    } //No badge otherwise
};

/**
 * Get the URL of a tab.
 * @function
 * @param {integer} id - The ID of the tab.
 * @return {string} The URL of the tab, or an empty string if it is not known.
 */
a.getTabURL = (() => {
    //The tabs database
    let tabs = {};
    //Bind event handlers
    chrome.tabs.onCreated.addListener((tab) => {
        if (tab.id !== chrome.tabs.TAB_ID_NONE && tab.url) {
            tabs[tab.id] = tab.url;
        }
    });
    chrome.tabs.onUpdated.addListener((id, data, ignored) => {
        if (data.url) {
            tabs[id] = data.url;
        }
    });
    chrome.tabs.onRemoved.addListener((id, ignored) => {
        delete tabs[id];
    });
    chrome.tabs.onReplaced.addListener((added, removed) => {
        //I am not sure if this is needed
        tabs[added] = tabs[removed];
        delete tabs[removed];
    });
    //Return closure function
    return (id) => tabs[id] || "";
})();

/**
 * Register a static loopback server.
 * @function
 * @param {Array.<string>} urls - The urls to loopback.
 * @param {Array.<string>} types - The types of request to loopback.
 * @param {string} data - The data to loopback to, must be already encoded and ready to serve.
 */
a.staticServer = (urls, types, data) => {
    chrome.webRequest.onBeforeRequest.addListener(
        () => {
            return { redirectUrl: data };
        },
        {
            urls: urls,
            types: types,
        },
        [
            "blocking",
        ],
    );
};
/**
 * Register a dynamic loopback server.
 * @function
 * @param {Array.<string>} urls - The urls to loopback.
 * @param {Array.<string>} types - The types of request to loopback.
 * @param {Function} server - The server.
 ** @param {Object} details - The details of this request.
 */
a.dynamicServer = (urls, types, server) => {
    chrome.webRequest.onBeforeRequest.addListener(
        server,
        {
            urls: urls,
            types: types,
        },
        [
            "blocking",
        ],
    );
};

/**
 * Apply generic rules.
 * @function
 */
a.generic = () => {
    //---MoatFreeWheelJSPEM.js---
    //Payload generator
    /*
    console.log("data:text/javascript;base64," + btoa("(" + String(() => {
        "use strict";
        window.console.error("Uncaught Error: FreeWheel SDK is not allowed on this device!");
        window.MoatFreeWheelJSPEM = class {
            init() { }
            dispose() { }
        };
    }) + ")();"));
    */
    a.staticServer(
        [
            "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
            "https://*.moatads.com/*/MoatFreeWheelJSPEM.js",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiV" +
        "W5jYXVnaHQgRXJyb3I6IEZyZWVXaGVlbCBTREsgaXMgbm90IGFsbG93ZWQgb24gdGhpcyBkZXZpY2UhIik7DQogICAgICAgIHdpbmRvdy5Nb2F0Rn" +
        "JlZVdoZWVsSlNQRU0gPSBjbGFzcyB7DQogICAgICAgICAgICBpbml0KCkgeyB9DQogICAgICAgICAgICBkaXNwb3NlKCkgeyB9DQogICAgICAgIH0" +
        "7DQogICAgfSkoKTs=",
    );
};
