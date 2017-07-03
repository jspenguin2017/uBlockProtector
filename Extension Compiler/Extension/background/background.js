"use strict";

//=====Initialization=====
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

//=====Utilities=====
/**
 * Get the URL of a tab.
 * @function
 * @param {integer} id - The ID of the tab.
 * @return {string} The URL of the tab, or an empty string if it is not known.
 */
const getTabURL = (() => {
    //Only used in debug mode
    if (!a.debugMode) {
        return () => {
            console.error("getTabURL() is only available in debug mode.");
            return "";
        };
    }
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

//=====Debug=====
if (a.debugMode) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/209
    chrome.webRequest.onHeadersReceived.addListener(
        (details) => {
            details.responseHeaders.push({
                name: "Access-Control-Allow-Origin",
                value: "https://vidlox.tv",
            });
            //Debug log
            console.log(details);
            return { responseHeaders: details.responseHeaders };
        },
        {
            urls: [
                "https://*.vidlox.tv/*",
            ],
            types: [
                //"main_frame",
                "xmlhttprequest",
            ],
        },
        [
            "blocking",
            "responseHeaders",
        ],
    );
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/338
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            details.requestHeaders.push({
                name: "X-Forwarded-For",
                value: "107.77.200.10",
            });
            details.requestHeaders.push({
                name: "Client-IP",
                value: "107.77.200.10",
            });
            //Debug log
            console.log(details);
            return { requestHeaders: details.requestHeaders };
        },
        {
            urls: [
                "https://*.go.com/*",
                "http://*.go.com/*",
            ],
        },
        [
            "blocking",
            "requestHeaders",
        ],
    );
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/343
    //Seems to be validated on the server side, this does not work
    {
        //Generate cookie value
        const mkVal = () => {
            const timestamp = Math.floor(Date.now() / 1000) + 1000;
            return `10_${timestamp}`;
        };
        //The cookie matcher
        const reMatcher = /countdownToAd=[^;]+/;
        //Listen and modify headers
        chrome.webRequest.onBeforeSendHeaders.addListener(
            (details) => {
                for (let i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name === "Cookie") {
                        if (details.requestHeaders[i].value.includes("countdownToAd=")) {
                            details.requestHeaders[i].value =
                                details.requestHeaders[i].value.replace(reMatcher, `countdownToAd=${mkVal()}`);
                        } else {
                            details.requestHeaders[i].value += `; countdownToAd=${mkVal()}`;
                        }
                    }
                }
                //Debug log
                console.log(details);
                return { requestHeaders: details.requestHeaders };
            },
            {
                urls: [
                    "https://*.gamereactor.eu/*",
                    "http://*.gamereactor.eu/*",
                ],
                types: [
                    "main_frame",
                ],
            },
            [
                "blocking",
                "requestHeaders",
            ],
        );
    }
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/344
    {
        const genPayload = (csid, caid, cbfn) => {
            //TODO: Optimize this
            let payload = `{
                version: "1",
                networkId: "-1",
                parameters: [
                    {
                        name: "autoloadExtensions",
                        category: "profile",
                        value: "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
                    },
                ],
                rendererManifest: {
                    adRenderers: {
                        version: "1",
                        adRenderer: [],
                    },
                },
                visitor: {
                    "httpHeaders": [],
                    "state": [],
                },
                errors: {
                    errors: [],
                },
                eventCallbacks: {
                    eventCallbacks: [],
                },
                ads: {
                    ads: [],
                },
                siteSection: {
                    customId: "@csid",
                    videoPlayer: {
                        videoAsset: {
                            eventCallbacks: [
                                {
                                    url: "http://mmod.v.fwmrm.net/ad/l/1?s=c005&n=48804%3B48804%3B379619%3B381963&t=1499098972532165010&f=&cn=videoView&et=i&uxnw=48804&uxss=v92041862&uxct=2",
                                    name: "videoView",
                                    type: "IMPRESSION",
                                    use: "OVERRIDE",
                                    showBrowser: false,
                                    trackingUrls: [],
                                }
                            ],
                            customId: "@caid",
                            networkId: "-1",
                            adSlots: [],
                        },
                        adSlots: [],
                    },
                    adSlots: [],
                },
            }`;
            return "data:text/javascript;base64," + btoa(cbfn + "(" + payload.replace("@csid", csid).replace("@caid", caid) + ");");
        };
        //Matchers
        const reOrigin = /^(https?:\/\/\w+\.ncaa\.com\/|$)/; //Aggressively redirect if the URL of the tab is not known
        const reCsid = /csid=([^&]+)/;
        const reCaid = /caid=([^&]+)/;
        const reCbfn = /cbfn=([^&]+)/;
        //Main ads request nooping
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => {
                //Debug log
                console.log(details);
                if (reOrigin.test(getTabURL(details.tabId))) {
                    const csid = reCsid.exec(details.url);
                    const caid = reCaid.exec(details.url);
                    const cbfn = reCbfn.exec(details.url);
                    if (csid && caid && cbfn) {
                        return { redirectUrl: genPayload(csid[1], caid[1], decodeURIComponent(cbfn[1])) };
                    }
                } else {
                    //Debug log
                    console.log(getTabURL(details.tabId));
                    //return { cancel: true };
                }
            },
            {
                urls: [
                    "https://*.fwmrm.net/*",
                    "http://*.fwmrm.net/*",
                ],
                types: [
                    "script",
                ],
            },
            [
                "blocking",
            ],
        );
        //Player extension nooping
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => {
                //TODO: Optimize this
                let temp = "data:text/javascript;base64,";
                temp += btoa(String(function MoatFreeWheelJSPEM() {
                    "use strict";
                    this.init = (context) => {
                        //I think the callback here is broken
                        console.log(context);
                    };
                    this.dispose = () => { };
                }));
                return { redirectUrl: temp };
            },
            {
                urls: [
                    "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
                ],
                types: [
                    "script",
                ],
            },
            [
                "blocking",
            ],
        );
    }
}
