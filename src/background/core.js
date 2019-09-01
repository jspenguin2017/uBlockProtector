// ----------------------------------------------------------------------------------------------------------------- //

// Nano Defender - An anti-adblock defuser
// Copyright (C) 2016-2019  Nano Defender contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------------------------------------------------------------------------------------- //

// Core library for background rules

// ----------------------------------------------------------------------------------------------------------------- //

"use strict";

// ----------------------------------------------------------------------------------------------------------------- //

a.init = () => {

    // ------------------------------------------------------------------------------------------------------------- //

    // Internal messaging

    chrome.runtime.onMessage.addListener((msg, sender, res) => {
        if (msg instanceof Object === false || sender instanceof Object === false || typeof res !== "function")
            return;

        if (typeof msg.cmd !== "string" || sender.tab instanceof Object === false)
            return;

        const tab = sender.tab.id;
        const frame = sender.frameId || 0;

        if (typeof tab !== "number" || typeof frame !== "number")
            return;

        switch (msg.cmd) {
            // Inject UserCSS to caller frame
            //
            // data - CSS code to inject
            case "inject css":
                if (typeof msg.data === "string")
                    a.userCSS(tab, frame, msg.data);
                break;

            // Send a highly privileged XMLHttpRequest, it ignores Cross Origin Resource Sharing policies as well as
            // adblocker filtering
            // Requests must be explicitly whitelisted in a.sanitizeXhr()
            //
            // details - Details object, see a.xhr()
            //
            // Returns the response text, or null if the request failed
            case "xhr":
                if (msg.details instanceof Object) {
                    const sanitizedDetails = a.sanitizeXhr(sender, msg.details);
                    if (!sanitizedDetails)
                        return;

                    const onError = () => {
                        res(null);
                    };

                    if (a.xhr(sanitizedDetails, res, onError)) {
                        // Must return true since I need to respond to content script asynchronously
                        return true;
                    } else {
                        onError();
                    }
                }
                break;

            // Forcefully close the caller tab
            case "remove tab":
                if (tab !== chrome.tabs.TAB_ID_NONE)
                    chrome.tabs.remove(tab, a.noopErr);
                break;

            //@pragma-if-debug

            case "log":
                if (a.debugMode)
                    console.log(msg.data);
                break;

            //@pragma-end-if

            default:
                break;
        }
    });

    // ------------------------------------------------------------------------------------------------------------- //

    // External messaging

    const reporter = chrome.runtime.getURL("/reporter/index.html");

    chrome.runtime.onMessageExternal.addListener((msg, sender, res) => {
        if (msg instanceof Object === false || sender instanceof Object === false || typeof res !== "function")
            return;

        if (typeof msg.data !== "string" || sender.id !== a.NanoAdblockerExtensionID)
            return;

        switch (msg.data) {
            case "Ping":
                res({ data: "ok" });
                break;

            case "Open Quick Issue Reporter":
                if (typeof msg.tab === "number") {
                    chrome.tabs.create({ url: reporter + "?" + msg.tab.toString() });
                    res({ data: "ok" });
                }
                break;

            default:
                break;
        }
    });

    setTimeout(() => {
        chrome.runtime.sendMessage(
            a.NanoAdblockerExtensionID,
            {
                data: "Nano Defender Enabled",
            },
            a.noopErr,
        );
    }, 15 * 1000);

    // ------------------------------------------------------------------------------------------------------------- //

    // Taken from https://bit.ly/2OJzDAI (GitHub gorhill/uBlock)

    const root = chrome.runtime.getURL("/");

    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!details.url.endsWith(a.rSecret))
                return { redirectUrl: root };
        },
        {
            urls: [
                a.rRoot + "*",
            ],
        },
        [
            "blocking",
        ],
    );

    // ------------------------------------------------------------------------------------------------------------- //

    //@pragma-if-debug

    if (a.debugMode) {
        chrome.browserAction.setBadgeText({ text: "DBG" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#406BD1" });
    } else {
        chrome.browserAction.setBadgeText({ text: "DEV" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#00871D" });
    }

    //@pragma-end-if

    // ------------------------------------------------------------------------------------------------------------- //

    const hasNews = false;

    const newsPage = "https://jspenguin2017.github.io/uBlockProtector/#announcements";
    const newsReadFlag = "news-read";

    // This handler becomes inactive when there is a popup page set
    chrome.browserAction.onClicked.addListener(() => {
        chrome.browserAction.setBadgeText({ text: "" });

        // IMPORTANT: This must match the manifest
        chrome.browserAction.setPopup({ popup: "popup/index.html" });

        localStorage.setItem(newsReadFlag, "true");

        chrome.tabs.create({ url: newsPage });
    });

    if (hasNews) {
        if (!chrome.extension.inIncognitoContext && !localStorage.getItem(newsReadFlag)) {
            chrome.browserAction.setBadgeText({ text: "NEW" });
            chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000" });

            chrome.browserAction.setPopup({ popup: "" });
        }
    } else {
        localStorage.removeItem(newsReadFlag);
    }

    // ------------------------------------------------------------------------------------------------------------- //

};

// ----------------------------------------------------------------------------------------------------------------- //

a.noopErr = () => {
    void chrome.runtime.lastError;
};

// ----------------------------------------------------------------------------------------------------------------- //

a.cryptoRandom = () => {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);

    let out = "";
    for (const entry of array)
        out += entry.toString(16);

    return out;
};

// ----------------------------------------------------------------------------------------------------------------- //

// Redirect helpers

a.rSecret = a.cryptoRandom();

a.rRoot = chrome.runtime.getURL("/resources/");

a.rLink = (name) => {
    return a.rRoot + name + "?s=" + a.rSecret;
};

// ----------------------------------------------------------------------------------------------------------------- //

// Redirect resources

// 1 second blank video, taken from https://bit.ly/2JcYAyq (GitHub uBlockOrigin/uAssets).
a.blankMP4 = a.rLink("blank.mp4");

// ----------------------------------------------------------------------------------------------------------------- //

// tab   - Id of the tab
// frame - Id of the frame
//
// Returns the Url of the tab, or an empty string if it is not known
a.getTabURL = (() => {
    // tabs[tabId][frameId] = url
    const tabs = {};

    //@pragma-if-debug

    if (a.debugMode)
        window.getTabURLInternal = tabs;

    //@pragma-end-if

    chrome.tabs.query({}, (existingTabs) => {
        for (const existingTab of existingTabs) {
            const id = existingTab.id;
            if (id === chrome.tabs.TAB_ID_NONE)
                continue;

            if (!tabs[id])
                tabs[id] = {};

            // Keep existing Url because that is probably more up to date
            tabs[id][0] = tabs[id][0] || existingTab.url;

            chrome.webNavigation.getAllFrames({ tabId: id }, (frames) => {
                if (chrome.runtime.lastError)
                    return;

                if (!tabs[id])
                    return;

                for (const frame of frames) {
                    const frameId = frame.frameId;

                    // Keep existing Url like before
                    tabs[id][frameId] = tabs[id][frameId] || frame.url;
                }
            });
        }
    });

    chrome.webNavigation.onCommitted.addListener((details) => {
        const { tabId, frameId, url } = details;

        // Clear store when the tab has navigated
        if (!tabs[tabId] || frameId === 0)
            tabs[tabId] = {};

        tabs[tabId][frameId] = url;
    });

    chrome.tabs.onRemoved.addListener((id) => {
        delete tabs[id];
    });

    return (tab, frame) => {
        if (tabs[tab])
            return tabs[tab][frame] || "";
        else
            return "";
    };
})();

// Check if the domain of an URL ends with one of the domains in the list
// A list entry "example.com" will match domains that matches /(^|.*\.)example\.com$/
//
// url     - URL to check
// domList - List of domains to compare
// isMatch - Whether the domains list is a match list
//
// Returns true if the domain of the URL is in the list, false otherwise
a.domCmp = (() => {
    const domainExtractor = /^https?:\/\/([^/:?#]+)/;

    return (url, domList, isMatch) => {
        let dom = domainExtractor.exec(url);
        if (!dom)
            return false;

        dom = dom[1];

        for (const entry of domList) {
            if (
                dom.endsWith(entry) &&
                (
                    dom.length === entry.length ||
                    dom.charAt(dom.length - entry.length - 1) === "."
                )
            ) {
                return true === isMatch;
            }
        }

        return false === isMatch;
    };
})();

// ----------------------------------------------------------------------------------------------------------------- //

// urls    - Urls to loopback
// types   - Types of request to loopback
// data    - Data to loopback to, must be already encoded and ready to serve
// domList - Domains list, omit to match all domains
// isMatch - Whether the domains list is a match list, defaults to true
a.staticServer = (urls, types, data, domList, isMatch = true) => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const url = a.getTabURL(details.tabId, details.frameId);

            if (!domList || a.domCmp(url, domList, isMatch)) {

                //@pragma-if-debug

                if (a.debugMode)
                    console.log("Redirected " + details.url + " to " + data);

                //@pragma-end-if

                return { redirectUrl: data };
            }
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

// urls    - Urls to loopback
// types   - Types of request to loopback
// server  - Server function, it will be passed as the event listener, view Chromium API documentations for more
//           information: https://developer.chrome.com/extensions/webRequest
// domList - Domains list, omit to match all domains
// isMatch - Whether the domains list is a match list, defaults to true
a.dynamicServer = (urls, types, server, domList, isMatch = true) => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const url = a.getTabURL(details.tabId, details.frameId);

            if (!domList || a.domCmp(url, domList, isMatch)) {
                const response = server(details);

                //@pragma-if-debug

                if (a.debugMode && response) {
                    if (response.cancel)
                        console.log("Cancelled " + details.url);
                    else if (response.redirectUrl)
                        console.log("Redirected " + details.url + " to " + response.redirectUrl);
                }

                //@pragma-end-if

                return response;
            }
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

// ----------------------------------------------------------------------------------------------------------------- //

// tab   - Target tab
// frame - Target frame
// code  - CSS code to inject
a.userCSS = (tab, frame, code) => {
    if (tab === chrome.tabs.TAB_ID_NONE)
        return;

    chrome.tabs.insertCSS(tab, {
        code: code,
        cssOrigin: "user",
        frameId: frame,
    }, a.noopErr);
};

a.sanitizeXhr = (sener, details) => {
    // Nothing is allowed for now
    return null;
};

// details - Details about this request
//     method   - Method of the request, can be 'GET' or 'POST'
//     url      - Url of the request
//     headers  - Headers of the request, optional
//     payload  - Payload of the request, optional
// onload  - Load handler
//     response - Response text
// onerror - Error handler
//
// Returns true if the request is sent, false if details are not valid and the request was not sent
a.xhr = (details, onload, onerror) => {
    if (typeof details.method !== "string" || typeof details.url !== "string")
        return false;

    if (details.method !== "GET" && details.method !== "POST")
        return false;

    console.log("[Nano] Cross Origin Request ::", details.url);

    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState !== XMLHttpRequest.DONE)
            return;

        if (req.status === 200)
            onload(req.responseText);
        else
            onerror();
    };

    req.open(details.method, details.url);

    if (details.headers instanceof Object) {
        for (const key in details.headers) {
            const header = details.headers[key];

            if (details.headers.hasOwnProperty(key) && typeof header === "string")
                req.setRequestHeader(key, header);
        }
    }

    if (typeof details.payload === "string")
        req.send(payload);
    else
        req.send(null);

    return true;
};

// ----------------------------------------------------------------------------------------------------------------- //

a.generic = () => {
    a.staticServer(
        [
            "http://*.medianetworkinternational.com/js/advertisement.js*",
        ],
        [
            "script",
        ],
        a.rLink("jquery.js"),
    );

    // Not working correctly
    /*
    a.staticServer(
        [
            "https://imasdk.googleapis.com/js/sdkloader/ima3.js*",
            "http://imasdk.googleapis.com/js/sdkloader/ima3.js*",
        ],
        [
            "script",
        ],
        a.rLink("ima3.js"),
        // List whitelisted domains in the array
        //[
        //],
        //false,
    );
    */

    a.staticServer(
        [
            "https://*.moatads.com/*/MoatFreeWheelJSPEM.js*",
        ],
        [
            "script",
        ],
        a.rLink("fw.js"),
    );
};

// ----------------------------------------------------------------------------------------------------------------- //

//@pragma-if-debug

// Attempt to make the server think the request is from a different IP, rarely works
// Only available in debug mode
//
// urls - Urls to activate on
// ip   - Camouflage Ip, keep in mind that the server still have access to your real Ip
// log  - Whether details should be logged to console for every matched request, defaults to false
a.proxy = (urls, ip, log) => {
    if (!a.debugMode)
        return void console.error("a.proxy() is only available in debug mode.");

    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            details.requestHeaders.push({
                name: "X-Forwarded-For",
                value: ip,
            });

            details.requestHeaders.push({
                name: "Client-IP",
                value: ip,
            });

            if (log)
                console.log(details);

            return { requestHeaders: details.requestHeaders };
        },
        {
            urls: urls,
        },
        [
            "blocking",
            "requestHeaders",
        ],
    );
};

//@pragma-end-if

// ----------------------------------------------------------------------------------------------------------------- //
