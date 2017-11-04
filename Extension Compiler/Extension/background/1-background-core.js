//The background core library for background rules
"use strict";

//=====Control=====
/**
 * Initialization.
 * @function
 */
a.init = () => {
    chrome.runtime.onMessage.addListener((...args) => {
        if (args.length === 3) {
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
                            void chrome.runtime.lastError;
                        });
                    }
                    break;

                /**
                 * Send a highly privileged XMLHttpRequest, it goes though Cross Origin Resource
                 * Sharing policies as well as uBlock Origin filtering.
                 * @param {Object} details - The details object, see a.request() of content-core
                 ** for more information.
                 * @return {string|null} The response text, or null if the request failed.
                 */
                case "xhr":
                    if (typeof args[0].details === "object") {
                        const method = String(args[0].details.method);
                        if (method === "GET" || method === "POST") {
                            console.log(`Sending cross origin request to ${args[0].details.url}`);
                            let req = new XMLHttpRequest();

                            req.onreadystatechange = () => {
                                if (req.readyState === 4) {
                                    try {
                                        if (req.status === 200) {
                                            args[2](req.responseText);
                                        } else {
                                            args[2](null);
                                        }
                                    } catch (err) { }
                                }
                            };

                            req.open(method, String(args[0].details.url));

                            if (typeof args[0].details.headers === "object") {
                                for (let key in args[0].details.headers) {
                                    req.setRequestHeader(key, String(args[0].details.headers[key]));
                                }
                            }

                            let payload = null;
                            if (args[0].details.payload) {
                                payload = String(args[0].details.payload);
                            }
                            req.send(payload);

                            //Must return true since I need to respond to content script asynchronously
                            return true;
                        }
                    }
                    break;

                /**
                 * Forcefully close the sender tab.
                 */
                case "remove tab":
                    if (args[1].tab && args[1].tab.id !== chrome.tabs.TAB_ID_NONE) {
                        chrome.tabs.remove(args[1].tab.id, () => {
                            void chrome.runtime.lastError;
                        });
                    }
                    break;

                //@pragma-if-debug
                /**
                 * Log data to console. Only available in debug mode.
                 * @param {string} data - The data to log.
                 */
                case "log":
                    if (a.debugMode) {
                        console.log(args[0].data);
                    }
                    break;
                //@pragma-end-if

                default:
                    break;
            }
        }
    });

    chrome.browserAction.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage();
    });

    //@pragma-if-debug
    if (a.debugMode) {
        chrome.browserAction.setBadgeText({
            text: "DBG",
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#6996FF",
        });
    } else if (chrome.runtime.id !== "ggolfgbegefeeoocgjbmkembbncoadlb") {
        //Unpacked extension
        chrome.browserAction.setBadgeText({
            text: "DEV",
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#25BA42",
        });
    }
    //@pragma-end-if
};

//=====Resources=====
/**
 * Base 64 encoded blank MP4.
 * @const {string}
 */
a.blankMP4 =
    "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u9" +
    "4MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvc" +
    "HRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0" +
    "xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlY" +
    "WRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW5" +
    "0PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1he" +
    "D02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQ" +
    "L8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAI" +
    "QBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4A" +
    "AAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjg" +
    "CEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8D" +
    "JIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjg" +
    "AAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACO" +
    "AAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6Anw" +
    "MkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAA" +
    "AAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAA" +
    "AABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHI" +
    "AAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr" +
    "3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+E" +
    "AFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAA" +
    "AAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAA" +
    "ACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAAB" +
    "HAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAA" +
    "AAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAA" +
    "AAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAA" +
    "BAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFg" +
    "ICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgA" +
    "AAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAA" +
    "AABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAA" +
    "AGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAA" +
    "AkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAA" +
    "JAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZ" +
    "wAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJ" +
    "hcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw";

//=====Utilities=====
/**
 * Get the URL of a frame of a tab.
 * @function
 * @param {integer} tab - The ID of the tab.
 * @param {integer} frame - The ID of the frame.
 * @return {string} The URL of the tab, or an empty string if it is not known.
 */
a.getTabURL = (() => {
    let tabs = {};

    //@pragma-if-debug
    if (a.debugMode) {
        window.getTabURLInternal = tabs;
    }
    //@pragma-end-if

    chrome.tabs.query({}, (existingTabs) => {
        for (let i = 0; i < existingTabs.length; i++) {
            const id = existingTabs[i].id;
            if (id !== chrome.tabs.TAB_ID_NONE) {
                if (!tabs[id]) {
                    tabs[id] = {};
                }
                tabs[id][0] = tabs[id][0] || existingTabs[i].url;

                chrome.webNavigation.getAllFrames({ tabId: id }, (frames) => {
                    if (!chrome.runtime.lastError && tabs[id]) {
                        for (let ii = 0; ii < frames.length; ii++) {
                            tabs[id][frames[ii].frameId] = tabs[id][frames[ii].frameId] || frames[ii].url;
                        }
                    }
                });
            }
        }
    });

    chrome.webNavigation.onCommitted.addListener((details) => {
        if (!tabs[details.tabId]) {
            tabs[details.tabId] = {};
        }
        tabs[details.tabId][details.frameId] = details.url;
    });
    chrome.tabs.onRemoved.addListener((id) => {
        delete tabs[id];
    });

    return (tab, frame) => {
        if (tabs[tab]) {
            return tabs[tab][frame] || "";
        } else {
            return "";
        }
    };
})();
/**
 * Check if the domain of an URL ends with one of the domains in the list.
 * A list entry "example.com" will match domains that matches /(^|.*\.)example\.com$/.
 * @function
 * @param {string} url - The URL to check.
 * @param {Array.<string>} domList - The list of domains to compare.
 * @param {boolean} isMatch - Whether the domains list is a match list.
 * @return {boolean} True if the domain of the URL is in the list, false otherwise.
 */
a.domCmp = (() => {
    const domainExtractor = /^https?:\/\/([^/]+)/;
    return (url, domList, isMatch) => {
        let dom = domainExtractor.exec(url);
        if (!dom) {
            return false;
        }
        dom = dom[1];

        for (let i = 0; i < domList.length; i++) {
            if (dom.endsWith(domList[i]) &&
                (dom.length === domList[i].length || dom.charAt(dom.length - domList[i].length - 1) === '.')) {
                return true === isMatch;
            }
        }
        return false === isMatch;
    };
})();
/**
 * Register a static loopback server.
 * @function
 * @param {Array.<string>} urls - The urls to loopback.
 * @param {Array.<string>} types - The types of request to loopback.
 * @param {string} data - The data to loopback to, must be already encoded and ready to serve.
 * @param {Array.<string>} [domList=undefined] - The domains list, omit to match all domains.
 * @param {boolean} [isMatch=true] - Whether the domains list is a match list.
 */
a.staticServer = (urls, types, data, domList, isMatch = true) => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!domList || a.domCmp(a.getTabURL(details.tabId, details.frameId), domList, isMatch)) {
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
/**
 * Register a dynamic loopback server.
 * @function
 * @param {Array.<string>} urls - The urls to loopback.
 * @param {Array.<string>} types - The types of request to loopback.
 * @param {Function} server - The server, this function will be passed as the event listener, view Chromium API
 ** documentations for more information: https://developer.chrome.com/extensions/webRequest
 * @param {Array.<string>} [domList=undefined] - The domains list, omit to match all domains.
 * @param {boolean} [isMatch=true] - Whether the domains list is a match list.
 */
a.dynamicServer = (urls, types, server, domList, isMatch = true) => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!domList || a.domCmp(a.getTabURL(details.tabId, details.frameId), domList, isMatch)) {
                return server(details);
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

//=====Generic=====
/**
 * Apply generic rules.
 * @function
 */
a.generic = () => {
    //---jQuery plugin---
    /*
    a.mkPayload("jQuery plugin", () => {
        "use strict";
        try {
            window.console.error("Uncaught Error: jQuery uBlock Origin detector plugin is not allowed on this device!");
        } catch (err) { }
        try {
            window.$.adblock = false;
        } catch (err) { }
        try {
            window.jQuery.adblock = false;
        } catch (err) { }
    });
    */
    a.staticServer(
        [
            "https://ads.korri.fr/index.js",
            "http://*.medianetworkinternational.com/js/advertisement.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7dHJ5IHt3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IGpRdWVyeSB1QmxvY2sgT3JpZ2luIGRldGVjdG" +
        "9yIHBsdWdpbiBpcyBub3QgYWxsb3dlZCBvbiB0aGlzIGRldmljZSEiKTt9IGNhdGNoIChlcnIpIHsgfXRyeSB7d2luZG93LiQuYWRibG9jayA9IGZhbHNlO30gY2F0Y2ggKGVycikgeyB9dHJ5IHt3" +
        "aW5kb3cualF1ZXJ5LmFkYmxvY2sgPSBmYWxzZTt9IGNhdGNoIChlcnIpIHsgfX0pKCk7",
    );
    //---Interactive Media Ads Software Development Kit---
    //https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
    /*
    a.mkPayload("IMA SDK", () => {
        "use strict";
        try {
            window.console.error("Uncaught Error: IMA SDK is not allowed on this device!");
        } catch (err) { }
        let warnCount = 0;
        //I think I can get away with not implementing interfaces
        window.google = window.google || {};
        window.google.ima = {
            AdDisplayContainer: class {
                //constructor(container, video, click) { }
                initialize() { }
                destroy() { }
            },
            AdError: class {
                constructor(message, code, type) {
                    this._message = message;
                    this._code = code;
                    this._type = type;
                }
                getErrorCode() {
                    return this._code;
                }
                getInnerError() {
                    return null;
                }
                getMessage() {
                    return this._message;
                }
                getType() {
                    return this._type;
                }
                getVastErrorCode() {
                    return window.google.ima.AdError.ErrorCode.UNKNOWN_ERROR;
                }
                toString() {
                    return `AdError ${this._code}: ${this._message}.`;
                }
            },
            AdErrorEvent: class extends ErrorEvent {
                constructor(error, context) {
                    super(error);
                    this._errObj = error;
                    this._context = context;
                }
                getError() {
                    return this._errObj;
                }
                getUserRequestContext() {
                    return this._context;
                }
            },
            AdEvent: class extends Event {
                constructor(type, ad, adData) {
                    super(type);
                    this._ad = ad;
                    this._adData = adData;
                }
                getAd() {
                    return this._ad;
                }
                getAdData() {
                    return this._adData;
                }
            },
            AdsLoader: class {
                //Event logic
                constructor() {
                    //Error event callbacks
                    this._onError = [];
                    this._onErrorScope = [];
                    //The error event object
                    this._error = new window.google.ima.AdErrorEvent(
                        new window.google.ima.AdError(
                            "No ads available",
                            window.google.ima.AdError.ErrorCode.VAST_NO_ADS_AFTER_WRAPPER,
                            window.google.ima.AdError.Type.AD_LOAD,
                        ),
                        {},
                    );
                }
                addEventListener(event, handler, capture, scope) {
                    //I think I can get away with returning error for all ads requests
                    //The whitelisted SDK would also always error out
                    if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                        this._onError.push(handler);
                        this._onErrorScope.push(scope);
                    } else if (warnCount < 10) {
                        warnCount++;
                        try {
                            window.console.warn(`IMA event ${event} is ignored by uBlock Protector.`);
                        } catch (err) { }
                    }
                }
                removeEventListener(event, handler) {
                    //capture and scope are not checked
                    if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                        for (let i = 0; i < this._onError.length; i++) {
                            //This should be good enough
                            if (this._onError[i] === handler) {
                                this._onError.splice(i, 1);
                                this._onErrorScope.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    //Ignore otherwise
                }
                _dispatchError() {
                    for (let i = 0; i < this._onError.length; i++) {
                        if (this._onErrorScope[i]) {
                            this._onError[i].call(this._onErrorScope[i], this._error);
                        } else {
                            this._onError[i](this._error);
                        }
                    }
                }
                //Other logic
                contentComplete() { }
                destroy() { }
                getSettings() {
                    return window.google.ima.settings;
                }
                requestAds() {
                    window.setTimeout(this._dispatchError.bind(this), 10);
                }
            },
            AdsManagerLoadedEvent: class extends Event {
                constructor() {
                    //I think I can get away with it as long as I do not dispatch the event
                    throw new window.Error("Neutralized AdsManager is not implemented.");
                }
            },
            AdsRenderingSettings: class {
                //I think I can get away with not defining anything
                //constructor() { }
            },
            AdsRequest: class {
                //I think I can get away with not defining anything
                //constructor() { }
                setAdWillAutoPlay() { }
            },
            CompanionAdSelectionSettings: class {
                //I think I can get away with not defining anything
                //constructor() { }
            },
            ImaSdkSettings: class {
                //I think I can get away with not defining anything
                //constructor() { }
                getCompanionBackfill() {
                    return window.google.ima.ImaSdkSettings.CompanionBackfillMode.ALWAYS;
                }
                getDisableCustomPlaybackForIOS10Plus() {
                    return false;
                }
                getDisableFlashAds() {
                    return true;
                }
                getLocale() {
                    return "en-CA";
                }
                getNumRedirects() {
                    return 1;
                }
                getPlayerType() {
                    return "Unknown";
                }
                getPlayerVersion() {
                    return "1.0.0";
                }
                getPpid() {
                    return "2GjCgoECAP0IbU";
                }
                //Hopefully this will not blow up
                setAutoPlayAdBreaks() { }
                setCompanionBackfill() { }
                setDisableCustomPlaybackForIOS10Plus() { }
                setDisableFlashAds() { }
                setLocale() { }
                setNumRedirects() { }
                setPlayerType() { }
                setPlayerVersion() { }
                setPpid() { }
                setVpaidAllowed() { }
                setVpaidMode() { }
            },
            UiElements: {
                COUNTDOWN: "countdown",
            },
            ViewMode: {
                FULLSCREEN: "fullscreen",
                NORMAL: "normal",
            },
            VERSION: "3.173.4",
        };
        //Nested properties
        window.google.ima.AdError.ErrorCode = {
            VIDEO_PLAY_ERROR: 400,
            FAILED_TO_REQUEST_ADS: 1005,
            REQUIRED_LISTENERS_NOT_ADDED: 900,
            VAST_LOAD_TIMEOUT: 301,
            VAST_NO_ADS_AFTER_WRAPPER: 303,
            VAST_MEDIA_LOAD_TIMEOUT: 402,
            VAST_TOO_MANY_REDIRECTS: 302,
            VAST_ASSET_MISMATCH: 403,
            VAST_LINEAR_ASSET_MISMATCH: 403,
            VAST_NONLINEAR_ASSET_MISMATCH: 503,
            VAST_ASSET_NOT_FOUND: 1007,
            VAST_UNSUPPORTED_VERSION: 102,
            VAST_SCHEMA_VALIDATION_ERROR: 101,
            VAST_TRAFFICKING_ERROR: 200,
            VAST_UNEXPECTED_LINEARITY: 201,
            VAST_UNEXPECTED_DURATION_ERROR: 202,
            VAST_WRAPPER_ERROR: 300,
            NONLINEAR_DIMENSIONS_ERROR: 501,
            COMPANION_REQUIRED_ERROR: 602,
            VAST_EMPTY_RESPONSE: 1009,
            UNSUPPORTED_LOCALE: 1011,
            INVALID_ADX_EXTENSION: 1105,
            INVALID_ARGUMENTS: 1101,
            UNKNOWN_AD_RESPONSE: 1010,
            UNKNOWN_ERROR: 900,
            OVERLAY_AD_PLAYING_FAILED: 500,
            VIDEO_ELEMENT_USED: -1,
            VIDEO_ELEMENT_REQUIRED: -1,
            VAST_MEDIA_ERROR: -1,
            ADSLOT_NOT_VISIBLE: -1,
            OVERLAY_AD_LOADING_FAILED: -1,
            VAST_MALFORMED_RESPONSE: -1,
            COMPANION_AD_LOADING_FAILED: -1,
        };
        window.google.ima.AdError.Type = {
            AD_LOAD: "adLoadError",
            AD_PLAY: "adPlayError",
        };
        window.google.ima.AdErrorEvent.Type = {
            AD_ERROR: "adError",
        };
        window.google.ima.AdEvent.Type = {
            CONTENT_RESUME_REQUESTED: "contentResumeRequested",
            CONTENT_PAUSE_REQUESTED: "contentPauseRequested",
            CLICK: "click",
            DURATION_CHANGE: "durationChange",
            EXPANDED_CHANGED: "expandedChanged",
            STARTED: "start",
            IMPRESSION: "impression",
            PAUSED: "pause",
            RESUMED: "resume",
            FIRST_QUARTILE: "firstquartile",
            MIDPOINT: "midpoint",
            THIRD_QUARTILE: "thirdquartile",
            COMPLETE: "complete",
            USER_CLOSE: "userClose",
            LINEAR_CHANGED: "linearChanged",
            LOADED: "loaded",
            AD_CAN_PLAY: "adCanPlay",
            AD_METADATA: "adMetadata",
            AD_BREAK_READY: "adBreakReady",
            INTERACTION: "interaction",
            ALL_ADS_COMPLETED: "allAdsCompleted",
            SKIPPED: "skip",
            SKIPPABLE_STATE_CHANGED: "skippableStateChanged",
            LOG: "log",
            VIEWABLE_IMPRESSION: "viewable_impression",
            VOLUME_CHANGED: "volumeChange",
            VOLUME_MUTED: "mute",
        };
        window.google.ima.AdsManagerLoadedEvent.Type = {
            ADS_MANAGER_LOADED: "adsManagerLoaded",
        };
        window.google.ima.CompanionAdSelectionSettings.CreativeType = {
            ALL: "All",
            FLASH: "Flash",
            IMAGE: "Image",
        };
        window.google.ima.CompanionAdSelectionSettings.ResourceType = {
            ALL: "All",
            HTML: "Html",
            IFRAME: "IFrame",
            STATIC: "Static",
        };
        window.google.ima.CompanionAdSelectionSettings.SizeCriteria = {
            IGNORE: "IgnoreSize",
            SELECT_EXACT_MATCH: "SelectExactMatch",
            SELECT_NEAR_MATCH: "SelectNearMatch",
        };
        window.google.ima.ImaSdkSettings.CompanionBackfillMode = {
            ALWAYS: "always",
            ON_MASTER_AD: "on_master_ad",
        };
        window.google.ima.ImaSdkSettings.VpaidMode = {
            DISABLED: 0,
            ENABLED: 1,
            INSECURE: 2,
        };
        //Initialization
        window.google.ima.settings = new window.google.ima.ImaSdkSettings();
    });
    */
    a.staticServer(
        [
            "https://imasdk.googleapis.com/js/sdkloader/ima3.js*",
            "http://imasdk.googleapis.com/js/sdkloader/ima3.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7dHJ5IHt3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IElNQSBTREsgaXMgbm90IGFsbG93ZWQgb24gdG" +
        "hpcyBkZXZpY2UhIik7fSBjYXRjaCAoZXJyKSB7IH1sZXQgd2FybkNvdW50ID0gMDt3aW5kb3cuZ29vZ2xlID0gd2luZG93Lmdvb2dsZSB8fCB7fTt3aW5kb3cuZ29vZ2xlLmltYSA9IHtBZERpc3Bs" +
        "YXlDb250YWluZXI6IGNsYXNzIHtpbml0aWFsaXplKCkgeyB9ZGVzdHJveSgpIHsgfX0sQWRFcnJvcjogY2xhc3Mge2NvbnN0cnVjdG9yKG1lc3NhZ2UsIGNvZGUsIHR5cGUpIHt0aGlzLl9tZXNzYW" +
        "dlID0gbWVzc2FnZTt0aGlzLl9jb2RlID0gY29kZTt0aGlzLl90eXBlID0gdHlwZTt9Z2V0RXJyb3JDb2RlKCkge3JldHVybiB0aGlzLl9jb2RlO31nZXRJbm5lckVycm9yKCkge3JldHVybiBudWxs" +
        "O31nZXRNZXNzYWdlKCkge3JldHVybiB0aGlzLl9tZXNzYWdlO31nZXRUeXBlKCkge3JldHVybiB0aGlzLl90eXBlO31nZXRWYXN0RXJyb3JDb2RlKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS" +
        "5BZEVycm9yLkVycm9yQ29kZS5VTktOT1dOX0VSUk9SO310b1N0cmluZygpIHtyZXR1cm4gYEFkRXJyb3IgJHt0aGlzLl9jb2RlfTogJHt0aGlzLl9tZXNzYWdlfS5gO319LEFkRXJyb3JFdmVudDog" +
        "Y2xhc3MgZXh0ZW5kcyBFcnJvckV2ZW50IHtjb25zdHJ1Y3RvcihlcnJvciwgY29udGV4dCkge3N1cGVyKGVycm9yKTt0aGlzLl9lcnJPYmogPSBlcnJvcjt0aGlzLl9jb250ZXh0ID0gY29udGV4dD" +
        "t9Z2V0RXJyb3IoKSB7cmV0dXJuIHRoaXMuX2Vyck9iajt9Z2V0VXNlclJlcXVlc3RDb250ZXh0KCkge3JldHVybiB0aGlzLl9jb250ZXh0O319LEFkRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXZlbnQg" +
        "e2NvbnN0cnVjdG9yKHR5cGUsIGFkLCBhZERhdGEpIHtzdXBlcih0eXBlKTt0aGlzLl9hZCA9IGFkO3RoaXMuX2FkRGF0YSA9IGFkRGF0YTt9Z2V0QWQoKSB7cmV0dXJuIHRoaXMuX2FkO31nZXRBZE" +
        "RhdGEoKSB7cmV0dXJuIHRoaXMuX2FkRGF0YTt9fSxBZHNMb2FkZXI6IGNsYXNzIHtjb25zdHJ1Y3RvcigpIHt0aGlzLl9vbkVycm9yID0gW107dGhpcy5fb25FcnJvclNjb3BlID0gW107dGhpcy5f" +
        "ZXJyb3IgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50KG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yKCJObyBhZHMgYXZhaWxhYmxlIix3aW5kb3cuZ29vZ2xlLmltYS5BZE" +
        "Vycm9yLkVycm9yQ29kZS5WQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSLHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZS5BRF9MT0FELCkse30sKTt9YWRkRXZlbnRMaXN0ZW5lcihldmVudCwg" +
        "aGFuZGxlciwgY2FwdHVyZSwgc2NvcGUpIHtpZiAoZXZlbnQgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7dGhpcy5fb25FcnJvci5wdXNoKGhhbmRsZX" +
        "IpO3RoaXMuX29uRXJyb3JTY29wZS5wdXNoKHNjb3BlKTt9IGVsc2UgaWYgKHdhcm5Db3VudCA8IDEwKSB7d2FybkNvdW50Kys7dHJ5IHt3aW5kb3cuY29uc29sZS53YXJuKGBJTUEgZXZlbnQgJHtl" +
        "dmVudH0gaXMgaWdub3JlZCBieSB1QmxvY2sgUHJvdGVjdG9yLmApO30gY2F0Y2ggKGVycikgeyB9fX1yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKSB7aWYgKGV2ZW50ID09PSB3aW" +
        "5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZS5BRF9FUlJPUikge2ZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fb25FcnJvci5sZW5ndGg7IGkrKykge2lmICh0aGlzLl9vbkVycm9yW2ld" +
        "ID09PSBoYW5kbGVyKSB7dGhpcy5fb25FcnJvci5zcGxpY2UoaSwgMSk7dGhpcy5fb25FcnJvclNjb3BlLnNwbGljZShpLCAxKTtpLS07fX19fV9kaXNwYXRjaEVycm9yKCkge2ZvciAobGV0IGkgPS" +
        "AwOyBpIDwgdGhpcy5fb25FcnJvci5sZW5ndGg7IGkrKykge2lmICh0aGlzLl9vbkVycm9yU2NvcGVbaV0pIHt0aGlzLl9vbkVycm9yW2ldLmNhbGwodGhpcy5fb25FcnJvclNjb3BlW2ldLCB0aGlz" +
        "Ll9lcnJvcik7fSBlbHNlIHt0aGlzLl9vbkVycm9yW2ldKHRoaXMuX2Vycm9yKTt9fX1jb250ZW50Q29tcGxldGUoKSB7IH1kZXN0cm95KCkgeyB9Z2V0U2V0dGluZ3MoKSB7cmV0dXJuIHdpbmRvdy" +
        "5nb29nbGUuaW1hLnNldHRpbmdzO31yZXF1ZXN0QWRzKCkge3dpbmRvdy5zZXRUaW1lb3V0KHRoaXMuX2Rpc3BhdGNoRXJyb3IuYmluZCh0aGlzKSwgMTApO319LEFkc01hbmFnZXJMb2FkZWRFdmVu" +
        "dDogY2xhc3MgZXh0ZW5kcyBFdmVudCB7Y29uc3RydWN0b3IoKSB7dGhyb3cgbmV3IHdpbmRvdy5FcnJvcigiTmV1dHJhbGl6ZWQgQWRzTWFuYWdlciBpcyBub3QgaW1wbGVtZW50ZWQuIik7fX0sQW" +
        "RzUmVuZGVyaW5nU2V0dGluZ3M6IGNsYXNzIHt9LEFkc1JlcXVlc3Q6IGNsYXNzIHtzZXRBZFdpbGxBdXRvUGxheSgpIHsgfX0sQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5nczogY2xhc3Mge30s" +
        "SW1hU2RrU2V0dGluZ3M6IGNsYXNzIHtnZXRDb21wYW5pb25CYWNrZmlsbCgpIHtyZXR1cm4gd2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuQ29tcGFuaW9uQmFja2ZpbGxNb2RlLkFMV0" +
        "FZUzt9Z2V0RGlzYWJsZUN1c3RvbVBsYXliYWNrRm9ySU9TMTBQbHVzKCkge3JldHVybiBmYWxzZTt9Z2V0RGlzYWJsZUZsYXNoQWRzKCkge3JldHVybiB0cnVlO31nZXRMb2NhbGUoKSB7cmV0dXJu" +
        "ICJlbi1DQSI7fWdldE51bVJlZGlyZWN0cygpIHtyZXR1cm4gMTt9Z2V0UGxheWVyVHlwZSgpIHtyZXR1cm4gIlVua25vd24iO31nZXRQbGF5ZXJWZXJzaW9uKCkge3JldHVybiAiMS4wLjAiO31nZX" +
        "RQcGlkKCkge3JldHVybiAiMkdqQ2dvRUNBUDBJYlUiO31zZXRBdXRvUGxheUFkQnJlYWtzKCkgeyB9c2V0Q29tcGFuaW9uQmFja2ZpbGwoKSB7IH1zZXREaXNhYmxlQ3VzdG9tUGxheWJhY2tGb3JJ" +
        "T1MxMFBsdXMoKSB7IH1zZXREaXNhYmxlRmxhc2hBZHMoKSB7IH1zZXRMb2NhbGUoKSB7IH1zZXROdW1SZWRpcmVjdHMoKSB7IH1zZXRQbGF5ZXJUeXBlKCkgeyB9c2V0UGxheWVyVmVyc2lvbigpIH" +
        "sgfXNldFBwaWQoKSB7IH1zZXRWcGFpZEFsbG93ZWQoKSB7IH1zZXRWcGFpZE1vZGUoKSB7IH19LFVpRWxlbWVudHM6IHtDT1VOVERPV046ICJjb3VudGRvd24iLH0sVmlld01vZGU6IHtGVUxMU0NS" +
        "RUVOOiAiZnVsbHNjcmVlbiIsTk9STUFMOiAibm9ybWFsIix9LFZFUlNJT046ICIzLjE3My40Iix9O3dpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuRXJyb3JDb2RlID0ge1ZJREVPX1BMQVlfRVJST1" +
        "I6IDQwMCxGQUlMRURfVE9fUkVRVUVTVF9BRFM6IDEwMDUsUkVRVUlSRURfTElTVEVORVJTX05PVF9BRERFRDogOTAwLFZBU1RfTE9BRF9USU1FT1VUOiAzMDEsVkFTVF9OT19BRFNfQUZURVJfV1JB" +
        "UFBFUjogMzAzLFZBU1RfTUVESUFfTE9BRF9USU1FT1VUOiA0MDIsVkFTVF9UT09fTUFOWV9SRURJUkVDVFM6IDMwMixWQVNUX0FTU0VUX01JU01BVENIOiA0MDMsVkFTVF9MSU5FQVJfQVNTRVRfTU" +
        "lTTUFUQ0g6IDQwMyxWQVNUX05PTkxJTkVBUl9BU1NFVF9NSVNNQVRDSDogNTAzLFZBU1RfQVNTRVRfTk9UX0ZPVU5EOiAxMDA3LFZBU1RfVU5TVVBQT1JURURfVkVSU0lPTjogMTAyLFZBU1RfU0NI" +
        "RU1BX1ZBTElEQVRJT05fRVJST1I6IDEwMSxWQVNUX1RSQUZGSUNLSU5HX0VSUk9SOiAyMDAsVkFTVF9VTkVYUEVDVEVEX0xJTkVBUklUWTogMjAxLFZBU1RfVU5FWFBFQ1RFRF9EVVJBVElPTl9FUl" +
        "JPUjogMjAyLFZBU1RfV1JBUFBFUl9FUlJPUjogMzAwLE5PTkxJTkVBUl9ESU1FTlNJT05TX0VSUk9SOiA1MDEsQ09NUEFOSU9OX1JFUVVJUkVEX0VSUk9SOiA2MDIsVkFTVF9FTVBUWV9SRVNQT05T" +
        "RTogMTAwOSxVTlNVUFBPUlRFRF9MT0NBTEU6IDEwMTEsSU5WQUxJRF9BRFhfRVhURU5TSU9OOiAxMTA1LElOVkFMSURfQVJHVU1FTlRTOiAxMTAxLFVOS05PV05fQURfUkVTUE9OU0U6IDEwMTAsVU" +
        "5LTk9XTl9FUlJPUjogOTAwLE9WRVJMQVlfQURfUExBWUlOR19GQUlMRUQ6IDUwMCxWSURFT19FTEVNRU5UX1VTRUQ6IC0xLFZJREVPX0VMRU1FTlRfUkVRVUlSRUQ6IC0xLFZBU1RfTUVESUFfRVJS" +
        "T1I6IC0xLEFEU0xPVF9OT1RfVklTSUJMRTogLTEsT1ZFUkxBWV9BRF9MT0FESU5HX0ZBSUxFRDogLTEsVkFTVF9NQUxGT1JNRURfUkVTUE9OU0U6IC0xLENPTVBBTklPTl9BRF9MT0FESU5HX0ZBSU" +
        "xFRDogLTEsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLlR5cGUgPSB7QURfTE9BRDogImFkTG9hZEVycm9yIixBRF9QTEFZOiAiYWRQbGF5RXJyb3IiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRF" +
        "cnJvckV2ZW50LlR5cGUgPSB7QURfRVJST1I6ICJhZEVycm9yIix9O3dpbmRvdy5nb29nbGUuaW1hLkFkRXZlbnQuVHlwZSA9IHtDT05URU5UX1JFU1VNRV9SRVFVRVNURUQ6ICJjb250ZW50UmVzdW" +
        "1lUmVxdWVzdGVkIixDT05URU5UX1BBVVNFX1JFUVVFU1RFRDogImNvbnRlbnRQYXVzZVJlcXVlc3RlZCIsQ0xJQ0s6ICJjbGljayIsRFVSQVRJT05fQ0hBTkdFOiAiZHVyYXRpb25DaGFuZ2UiLEVY" +
        "UEFOREVEX0NIQU5HRUQ6ICJleHBhbmRlZENoYW5nZWQiLFNUQVJURUQ6ICJzdGFydCIsSU1QUkVTU0lPTjogImltcHJlc3Npb24iLFBBVVNFRDogInBhdXNlIixSRVNVTUVEOiAicmVzdW1lIixGSV" +
        "JTVF9RVUFSVElMRTogImZpcnN0cXVhcnRpbGUiLE1JRFBPSU5UOiAibWlkcG9pbnQiLFRISVJEX1FVQVJUSUxFOiAidGhpcmRxdWFydGlsZSIsQ09NUExFVEU6ICJjb21wbGV0ZSIsVVNFUl9DTE9T" +
        "RTogInVzZXJDbG9zZSIsTElORUFSX0NIQU5HRUQ6ICJsaW5lYXJDaGFuZ2VkIixMT0FERUQ6ICJsb2FkZWQiLEFEX0NBTl9QTEFZOiAiYWRDYW5QbGF5IixBRF9NRVRBREFUQTogImFkTWV0YWRhdG" +
        "EiLEFEX0JSRUFLX1JFQURZOiAiYWRCcmVha1JlYWR5IixJTlRFUkFDVElPTjogImludGVyYWN0aW9uIixBTExfQURTX0NPTVBMRVRFRDogImFsbEFkc0NvbXBsZXRlZCIsU0tJUFBFRDogInNraXAi" +
        "LFNLSVBQQUJMRV9TVEFURV9DSEFOR0VEOiAic2tpcHBhYmxlU3RhdGVDaGFuZ2VkIixMT0c6ICJsb2ciLFZJRVdBQkxFX0lNUFJFU1NJT046ICJ2aWV3YWJsZV9pbXByZXNzaW9uIixWT0xVTUVfQ0" +
        "hBTkdFRDogInZvbHVtZUNoYW5nZSIsVk9MVU1FX01VVEVEOiAibXV0ZSIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZHNNYW5hZ2VyTG9hZGVkRXZlbnQuVHlwZSA9IHtBRFNfTUFOQUdFUl9MT0FERUQ6" +
        "ICJhZHNNYW5hZ2VyTG9hZGVkIix9O3dpbmRvdy5nb29nbGUuaW1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuQ3JlYXRpdmVUeXBlID0ge0FMTDogIkFsbCIsRkxBU0g6ICJGbGFzaCIsSU" +
        "1BR0U6ICJJbWFnZSIsfTt3aW5kb3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLlJlc291cmNlVHlwZSA9IHtBTEw6ICJBbGwiLEhUTUw6ICJIdG1sIixJRlJBTUU6ICJJ" +
        "RnJhbWUiLFNUQVRJQzogIlN0YXRpYyIsfTt3aW5kb3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLlNpemVDcml0ZXJpYSA9IHtJR05PUkU6ICJJZ25vcmVTaXplIixTRU" +
        "xFQ1RfRVhBQ1RfTUFUQ0g6ICJTZWxlY3RFeGFjdE1hdGNoIixTRUxFQ1RfTkVBUl9NQVRDSDogIlNlbGVjdE5lYXJNYXRjaCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5Db21w" +
        "YW5pb25CYWNrZmlsbE1vZGUgPSB7QUxXQVlTOiAiYWx3YXlzIixPTl9NQVNURVJfQUQ6ICJvbl9tYXN0ZXJfYWQiLH07d2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuVnBhaWRNb2RlID" +
        "0ge0RJU0FCTEVEOiAwLEVOQUJMRUQ6IDEsSU5TRUNVUkU6IDIsfTt3aW5kb3cuZ29vZ2xlLmltYS5zZXR0aW5ncyA9IG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncygpO30pKCk7",
        /*
        [
        ],
        false,
        */
    );
    //---MoatFreeWheelJSPEM.js---
    /*
    a.mkPayload("MoatFreeWheelJSPEM.js", () => {
        "use strict";
        try {
            window.console.error("Uncaught Error: FreeWheel SDK is not allowed on this device!");
        } catch (err) { }
        window.MoatFreeWheelJSPEM = class {
            init() { }
            dispose() { }
        };
    });
    */
    a.staticServer(
        [
            "https://jspenguin.com/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
            "https://*.moatads.com/*/MoatFreeWheelJSPEM.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7dHJ5IHt3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IEZyZWVXaGVlbCBTREsgaXMgbm90IGFsbG93ZW" +
        "Qgb24gdGhpcyBkZXZpY2UhIik7fSBjYXRjaCAoZXJyKSB7IH13aW5kb3cuTW9hdEZyZWVXaGVlbEpTUEVNID0gY2xhc3Mge2luaXQoKSB7IH1kaXNwb3NlKCkgeyB9fTt9KSgpOw==",
    );
};

//@pragma-if-debug
//=====Debug Utilities=====
/**
 * Attempt to make the server think the request is from a different IP. Rarely works.
 * Only available in debug mode.
 * @function
 * @param {string} urls - The URLs to activate on.
 * @param {string} ip - The camouflage IP. Keep in mind that the server still have access to your real IP.
 * @param {boolean} [log=false] - Whether details should be logged to console for every matched request.
 */
a.proxy = (urls, ip, log) => {
    if (!a.debugMode) {
        console.error("a.proxy() is only available in debug mode!");
        return;
    }

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
            if (log) {
                console.log(details);
            }
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
/**
 * Make data URL payload and pretty print it into the console.
 * Only available in debug mode.
 * @function
 * @param {string} title - The name of the payload.
 * @param {Function} payload - The payload.
 * @param {string} [type="text/javascript"] - The MIME type of the payload.
 * @return {string} The URL encoded payload.
 */
a.mkPayload = (title, payload, type = "text/javascript") => {
    if (!a.debugMode) {
        console.error("a.mkPayload() is only available in debug mode!");
        return;
    }

    let lines = (`(${payload})();`).split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        if (lines[i].startsWith("//")) {
            lines.splice(i, 1);
            i--;
        }
    }

    payload = `data:${type};base64,` + btoa(lines.join(""));
    const originalPayload = payload;
    let output = "";
    while (payload) {
        output += `"${payload.substring(0, 150)}" +\n`;
        payload = payload.substring(150);
    }
    console.log(title);
    console.log(output);
    return originalPayload;
};
//@pragma-end-if
