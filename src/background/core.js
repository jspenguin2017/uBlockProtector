/**
 * Core library for background rules.
 */
"use strict";


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
                        // TODO - Clean this up when minimum required version of Chrome is 66 or higher
                        try {
                            chrome.tabs.insertCSS(args[1].tab.id, {
                                code: args[0]["data"],
                                frameId: args[1].frameId || 0,
                                cssOrigin: "user",
                            }, () => {
                                void chrome.runtime.lastError;
                            });
                        } catch (err) {
                            chrome.tabs.insertCSS(args[1].tab.id, {
                                code: args[0]["data"],
                                frameId: args[1].frameId || 0,
                            }, () => {
                                void chrome.runtime.lastError;
                            });
                        }
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
                            console.log(`[Nano] Cross Origin Request :: ${args[0].details.url}`);
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
                                    if (args[0].details.headers.hasOwnProperty(key)) {
                                        req.setRequestHeader(key, String(args[0].details.headers[key]));
                                    }
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

    setTimeout(() => {
        chrome.runtime.sendMessage(
            a.NanoAdblockerExtensionID,
            {
                data: "Nano Defender Enabled",
            },
            () => {
                void chrome.runtime.lastError;
            },
        );
    }, 15000);

    //@pragma-if-debug
    if (a.debugMode) {
        chrome.browserAction.setBadgeText({
            text: "DBG",
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#406BD1",
        });
    } else {
        chrome.browserAction.setBadgeText({
            text: "DEV",
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#00871D",
        });
    }
    //@pragma-end-if
};


/**
 * Base 64 encoded blank MP4.
 * @const {string}
 */
a.blankMP4 =
    "data:video/mp4;base64,AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0" +
    "IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOi" +
    "BjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFf" +
    "bWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3" +
    "RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWlu" +
    "PTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbW" +
    "F4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXX" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAh" +
    "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";


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
        if (!tabs[details.tabId] || details.frameId === 0) {
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


/**
 * Apply generic rules.
 * @function
 */
a.generic = () => {
    // jQuery plugin
    /*
    a.mkPayload("jQuery plugin", () => {
        "use strict";
        try {
            window.console.error("[Nano] Generic Solution Triggered :: jQuery Plugin");
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
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7dHJ5IHt3aW5kb3cuY29uc29sZS5lcnJvcigiW05hbm9dIEdlbmVyaWMgU29sdXRpb24gVHJpZ2dlcmVkIDo6IGpRdWVyeS" +
        "BQbHVnaW4iKTt9IGNhdGNoIChlcnIpIHsgfXRyeSB7d2luZG93LiQuYWRibG9jayA9IGZhbHNlO30gY2F0Y2ggKGVycikgeyB9dHJ5IHt3aW5kb3cualF1ZXJ5LmFkYmxvY2sgPSBmYWxzZTt9IGNh" +
        "dGNoIChlcnIpIHsgfX0pKCk7",
    );
    // Interactive Media Ads Software Development Kit
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
    /*
    a.mkPayload("IMA SDK", () => {
        "use strict";
        try {
            window.console.error("[Nano] Surrogate Injected :: IMA SDK");
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
                            window.console.warn(`[Nano] IMA Event Ignored :: ${event}`);
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
                    throw new window.Error("[Nano] Not Implemented :: Neutralized AdsManager");
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
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7dHJ5IHt3aW5kb3cuY29uc29sZS5lcnJvcigiW05hbm9dIFN1cnJvZ2F0ZSBJbmplY3RlZCA6OiBJTUEgU0RLIik7fSBjYX" +
        "RjaCAoZXJyKSB7IH1sZXQgd2FybkNvdW50ID0gMDt3aW5kb3cuZ29vZ2xlID0gd2luZG93Lmdvb2dsZSB8fCB7fTt3aW5kb3cuZ29vZ2xlLmltYSA9IHtBZERpc3BsYXlDb250YWluZXI6IGNsYXNz" +
        "IHtpbml0aWFsaXplKCkgeyB9ZGVzdHJveSgpIHsgfX0sQWRFcnJvcjogY2xhc3Mge2NvbnN0cnVjdG9yKG1lc3NhZ2UsIGNvZGUsIHR5cGUpIHt0aGlzLl9tZXNzYWdlID0gbWVzc2FnZTt0aGlzLl" +
        "9jb2RlID0gY29kZTt0aGlzLl90eXBlID0gdHlwZTt9Z2V0RXJyb3JDb2RlKCkge3JldHVybiB0aGlzLl9jb2RlO31nZXRJbm5lckVycm9yKCkge3JldHVybiBudWxsO31nZXRNZXNzYWdlKCkge3Jl" +
        "dHVybiB0aGlzLl9tZXNzYWdlO31nZXRUeXBlKCkge3JldHVybiB0aGlzLl90eXBlO31nZXRWYXN0RXJyb3JDb2RlKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS" +
        "5VTktOT1dOX0VSUk9SO310b1N0cmluZygpIHtyZXR1cm4gYEFkRXJyb3IgJHt0aGlzLl9jb2RlfTogJHt0aGlzLl9tZXNzYWdlfS5gO319LEFkRXJyb3JFdmVudDogY2xhc3MgZXh0ZW5kcyBFcnJv" +
        "ckV2ZW50IHtjb25zdHJ1Y3RvcihlcnJvciwgY29udGV4dCkge3N1cGVyKGVycm9yKTt0aGlzLl9lcnJPYmogPSBlcnJvcjt0aGlzLl9jb250ZXh0ID0gY29udGV4dDt9Z2V0RXJyb3IoKSB7cmV0dX" +
        "JuIHRoaXMuX2Vyck9iajt9Z2V0VXNlclJlcXVlc3RDb250ZXh0KCkge3JldHVybiB0aGlzLl9jb250ZXh0O319LEFkRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXZlbnQge2NvbnN0cnVjdG9yKHR5cGUs" +
        "IGFkLCBhZERhdGEpIHtzdXBlcih0eXBlKTt0aGlzLl9hZCA9IGFkO3RoaXMuX2FkRGF0YSA9IGFkRGF0YTt9Z2V0QWQoKSB7cmV0dXJuIHRoaXMuX2FkO31nZXRBZERhdGEoKSB7cmV0dXJuIHRoaX" +
        "MuX2FkRGF0YTt9fSxBZHNMb2FkZXI6IGNsYXNzIHtjb25zdHJ1Y3RvcigpIHt0aGlzLl9vbkVycm9yID0gW107dGhpcy5fb25FcnJvclNjb3BlID0gW107dGhpcy5fZXJyb3IgPSBuZXcgd2luZG93" +
        "Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50KG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yKCJObyBhZHMgYXZhaWxhYmxlIix3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS5WQV" +
        "NUX05PX0FEU19BRlRFUl9XUkFQUEVSLHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZS5BRF9MT0FELCkse30sKTt9YWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgY2FwdHVyZSwg" +
        "c2NvcGUpIHtpZiAoZXZlbnQgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7dGhpcy5fb25FcnJvci5wdXNoKGhhbmRsZXIpO3RoaXMuX29uRXJyb3JTY2" +
        "9wZS5wdXNoKHNjb3BlKTt9IGVsc2UgaWYgKHdhcm5Db3VudCA8IDEwKSB7d2FybkNvdW50Kys7dHJ5IHt3aW5kb3cuY29uc29sZS53YXJuKGBbTmFub10gSU1BIEV2ZW50IElnbm9yZWQgOjogJHtl" +
        "dmVudH1gKTt9IGNhdGNoIChlcnIpIHsgfX19cmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcikge2lmIChldmVudCA9PT0gd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50LlR5cG" +
        "UuQURfRVJST1IpIHtmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX29uRXJyb3IubGVuZ3RoOyBpKyspIHtpZiAodGhpcy5fb25FcnJvcltpXSA9PT0gaGFuZGxlcikge3RoaXMuX29uRXJyb3Iuc3Bs" +
        "aWNlKGksIDEpO3RoaXMuX29uRXJyb3JTY29wZS5zcGxpY2UoaSwgMSk7aS0tO319fX1fZGlzcGF0Y2hFcnJvcigpIHtmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX29uRXJyb3IubGVuZ3RoOyBpKy" +
        "spIHtpZiAodGhpcy5fb25FcnJvclNjb3BlW2ldKSB7dGhpcy5fb25FcnJvcltpXS5jYWxsKHRoaXMuX29uRXJyb3JTY29wZVtpXSwgdGhpcy5fZXJyb3IpO30gZWxzZSB7dGhpcy5fb25FcnJvcltp" +
        "XSh0aGlzLl9lcnJvcik7fX19Y29udGVudENvbXBsZXRlKCkgeyB9ZGVzdHJveSgpIHsgfWdldFNldHRpbmdzKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5zZXR0aW5nczt9cmVxdWVzdEFkcy" +
        "gpIHt3aW5kb3cuc2V0VGltZW91dCh0aGlzLl9kaXNwYXRjaEVycm9yLmJpbmQodGhpcyksIDEwKTt9fSxBZHNNYW5hZ2VyTG9hZGVkRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXZlbnQge2NvbnN0cnVj" +
        "dG9yKCkge3Rocm93IG5ldyB3aW5kb3cuRXJyb3IoIltOYW5vXSBOb3QgSW1wbGVtZW50ZWQgOjogTmV1dHJhbGl6ZWQgQWRzTWFuYWdlciIpO319LEFkc1JlbmRlcmluZ1NldHRpbmdzOiBjbGFzcy" +
        "B7fSxBZHNSZXF1ZXN0OiBjbGFzcyB7c2V0QWRXaWxsQXV0b1BsYXkoKSB7IH19LENvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3M6IGNsYXNzIHt9LEltYVNka1NldHRpbmdzOiBjbGFzcyB7Z2V0" +
        "Q29tcGFuaW9uQmFja2ZpbGwoKSB7cmV0dXJuIHdpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLkNvbXBhbmlvbkJhY2tmaWxsTW9kZS5BTFdBWVM7fWdldERpc2FibGVDdXN0b21QbGF5Ym" +
        "Fja0ZvcklPUzEwUGx1cygpIHtyZXR1cm4gZmFsc2U7fWdldERpc2FibGVGbGFzaEFkcygpIHtyZXR1cm4gdHJ1ZTt9Z2V0TG9jYWxlKCkge3JldHVybiAiZW4tQ0EiO31nZXROdW1SZWRpcmVjdHMo" +
        "KSB7cmV0dXJuIDE7fWdldFBsYXllclR5cGUoKSB7cmV0dXJuICJVbmtub3duIjt9Z2V0UGxheWVyVmVyc2lvbigpIHtyZXR1cm4gIjEuMC4wIjt9Z2V0UHBpZCgpIHtyZXR1cm4gIjJHakNnb0VDQV" +
        "AwSWJVIjt9c2V0QXV0b1BsYXlBZEJyZWFrcygpIHsgfXNldENvbXBhbmlvbkJhY2tmaWxsKCkgeyB9c2V0RGlzYWJsZUN1c3RvbVBsYXliYWNrRm9ySU9TMTBQbHVzKCkgeyB9c2V0RGlzYWJsZUZs" +
        "YXNoQWRzKCkgeyB9c2V0TG9jYWxlKCkgeyB9c2V0TnVtUmVkaXJlY3RzKCkgeyB9c2V0UGxheWVyVHlwZSgpIHsgfXNldFBsYXllclZlcnNpb24oKSB7IH1zZXRQcGlkKCkgeyB9c2V0VnBhaWRBbG" +
        "xvd2VkKCkgeyB9c2V0VnBhaWRNb2RlKCkgeyB9fSxVaUVsZW1lbnRzOiB7Q09VTlRET1dOOiAiY291bnRkb3duIix9LFZpZXdNb2RlOiB7RlVMTFNDUkVFTjogImZ1bGxzY3JlZW4iLE5PUk1BTDog" +
        "Im5vcm1hbCIsfSxWRVJTSU9OOiAiMy4xNzMuNCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZSA9IHtWSURFT19QTEFZX0VSUk9SOiA0MDAsRkFJTEVEX1RPX1JFUVVFU1RfQU" +
        "RTOiAxMDA1LFJFUVVJUkVEX0xJU1RFTkVSU19OT1RfQURERUQ6IDkwMCxWQVNUX0xPQURfVElNRU9VVDogMzAxLFZBU1RfTk9fQURTX0FGVEVSX1dSQVBQRVI6IDMwMyxWQVNUX01FRElBX0xPQURf" +
        "VElNRU9VVDogNDAyLFZBU1RfVE9PX01BTllfUkVESVJFQ1RTOiAzMDIsVkFTVF9BU1NFVF9NSVNNQVRDSDogNDAzLFZBU1RfTElORUFSX0FTU0VUX01JU01BVENIOiA0MDMsVkFTVF9OT05MSU5FQV" +
        "JfQVNTRVRfTUlTTUFUQ0g6IDUwMyxWQVNUX0FTU0VUX05PVF9GT1VORDogMTAwNyxWQVNUX1VOU1VQUE9SVEVEX1ZFUlNJT046IDEwMixWQVNUX1NDSEVNQV9WQUxJREFUSU9OX0VSUk9SOiAxMDEs" +
        "VkFTVF9UUkFGRklDS0lOR19FUlJPUjogMjAwLFZBU1RfVU5FWFBFQ1RFRF9MSU5FQVJJVFk6IDIwMSxWQVNUX1VORVhQRUNURURfRFVSQVRJT05fRVJST1I6IDIwMixWQVNUX1dSQVBQRVJfRVJST1" +
        "I6IDMwMCxOT05MSU5FQVJfRElNRU5TSU9OU19FUlJPUjogNTAxLENPTVBBTklPTl9SRVFVSVJFRF9FUlJPUjogNjAyLFZBU1RfRU1QVFlfUkVTUE9OU0U6IDEwMDksVU5TVVBQT1JURURfTE9DQUxF" +
        "OiAxMDExLElOVkFMSURfQURYX0VYVEVOU0lPTjogMTEwNSxJTlZBTElEX0FSR1VNRU5UUzogMTEwMSxVTktOT1dOX0FEX1JFU1BPTlNFOiAxMDEwLFVOS05PV05fRVJST1I6IDkwMCxPVkVSTEFZX0" +
        "FEX1BMQVlJTkdfRkFJTEVEOiA1MDAsVklERU9fRUxFTUVOVF9VU0VEOiAtMSxWSURFT19FTEVNRU5UX1JFUVVJUkVEOiAtMSxWQVNUX01FRElBX0VSUk9SOiAtMSxBRFNMT1RfTk9UX1ZJU0lCTEU6" +
        "IC0xLE9WRVJMQVlfQURfTE9BRElOR19GQUlMRUQ6IC0xLFZBU1RfTUFMRk9STUVEX1JFU1BPTlNFOiAtMSxDT01QQU5JT05fQURfTE9BRElOR19GQUlMRUQ6IC0xLH07d2luZG93Lmdvb2dsZS5pbW" +
        "EuQWRFcnJvci5UeXBlID0ge0FEX0xPQUQ6ICJhZExvYWRFcnJvciIsQURfUExBWTogImFkUGxheUVycm9yIix9O3dpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlID0ge0FEX0VSUk9S" +
        "OiAiYWRFcnJvciIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUgPSB7Q09OVEVOVF9SRVNVTUVfUkVRVUVTVEVEOiAiY29udGVudFJlc3VtZVJlcXVlc3RlZCIsQ09OVEVOVF9QQVVTRV" +
        "9SRVFVRVNURUQ6ICJjb250ZW50UGF1c2VSZXF1ZXN0ZWQiLENMSUNLOiAiY2xpY2siLERVUkFUSU9OX0NIQU5HRTogImR1cmF0aW9uQ2hhbmdlIixFWFBBTkRFRF9DSEFOR0VEOiAiZXhwYW5kZWRD" +
        "aGFuZ2VkIixTVEFSVEVEOiAic3RhcnQiLElNUFJFU1NJT046ICJpbXByZXNzaW9uIixQQVVTRUQ6ICJwYXVzZSIsUkVTVU1FRDogInJlc3VtZSIsRklSU1RfUVVBUlRJTEU6ICJmaXJzdHF1YXJ0aW" +
        "xlIixNSURQT0lOVDogIm1pZHBvaW50IixUSElSRF9RVUFSVElMRTogInRoaXJkcXVhcnRpbGUiLENPTVBMRVRFOiAiY29tcGxldGUiLFVTRVJfQ0xPU0U6ICJ1c2VyQ2xvc2UiLExJTkVBUl9DSEFO" +
        "R0VEOiAibGluZWFyQ2hhbmdlZCIsTE9BREVEOiAibG9hZGVkIixBRF9DQU5fUExBWTogImFkQ2FuUGxheSIsQURfTUVUQURBVEE6ICJhZE1ldGFkYXRhIixBRF9CUkVBS19SRUFEWTogImFkQnJlYW" +
        "tSZWFkeSIsSU5URVJBQ1RJT046ICJpbnRlcmFjdGlvbiIsQUxMX0FEU19DT01QTEVURUQ6ICJhbGxBZHNDb21wbGV0ZWQiLFNLSVBQRUQ6ICJza2lwIixTS0lQUEFCTEVfU1RBVEVfQ0hBTkdFRDog" +
        "InNraXBwYWJsZVN0YXRlQ2hhbmdlZCIsTE9HOiAibG9nIixWSUVXQUJMRV9JTVBSRVNTSU9OOiAidmlld2FibGVfaW1wcmVzc2lvbiIsVk9MVU1FX0NIQU5HRUQ6ICJ2b2x1bWVDaGFuZ2UiLFZPTF" +
        "VNRV9NVVRFRDogIm11dGUiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRzTWFuYWdlckxvYWRlZEV2ZW50LlR5cGUgPSB7QURTX01BTkFHRVJfTE9BREVEOiAiYWRzTWFuYWdlckxvYWRlZCIsfTt3aW5k" +
        "b3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLkNyZWF0aXZlVHlwZSA9IHtBTEw6ICJBbGwiLEZMQVNIOiAiRmxhc2giLElNQUdFOiAiSW1hZ2UiLH07d2luZG93Lmdvb2" +
        "dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5SZXNvdXJjZVR5cGUgPSB7QUxMOiAiQWxsIixIVE1MOiAiSHRtbCIsSUZSQU1FOiAiSUZyYW1lIixTVEFUSUM6ICJTdGF0aWMiLH07" +
        "d2luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5TaXplQ3JpdGVyaWEgPSB7SUdOT1JFOiAiSWdub3JlU2l6ZSIsU0VMRUNUX0VYQUNUX01BVENIOiAiU2VsZWN0RX" +
        "hhY3RNYXRjaCIsU0VMRUNUX05FQVJfTUFUQ0g6ICJTZWxlY3ROZWFyTWF0Y2giLH07d2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuQ29tcGFuaW9uQmFja2ZpbGxNb2RlID0ge0FMV0FZ" +
        "UzogImFsd2F5cyIsT05fTUFTVEVSX0FEOiAib25fbWFzdGVyX2FkIix9O3dpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLlZwYWlkTW9kZSA9IHtESVNBQkxFRDogMCxFTkFCTEVEOiAxLE" +
        "lOU0VDVVJFOiAyLH07d2luZG93Lmdvb2dsZS5pbWEuc2V0dGluZ3MgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MoKTt9KSgpOw==",
        /*
        [
        ],
        false,
        */
    );
    // MoatFreeWheelJSPEM.js
    /*
    a.mkPayload("MoatFreeWheelJSPEM.js", () => {
        "use strict";
        try {
            window.console.error("[Nano] Surrogate Injected :: FreeWheel SDK");
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
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7dHJ5IHt3aW5kb3cuY29uc29sZS5lcnJvcigiW05hbm9dIFN1cnJvZ2F0ZSBJbmplY3RlZCA6OiBGcmVlV2hlZWwgU0RLIi" +
        "k7fSBjYXRjaCAoZXJyKSB7IH13aW5kb3cuTW9hdEZyZWVXaGVlbEpTUEVNID0gY2xhc3Mge2luaXQoKSB7IH1kaXNwb3NlKCkgeyB9fTt9KSgpOw==",
    );
};


//@pragma-if-debug
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
