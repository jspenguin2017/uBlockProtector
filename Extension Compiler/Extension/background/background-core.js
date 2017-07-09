//The background core library for background rules
"use strict";

//=====Initializer=====
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

//=====Utilities=====
/**
 * Get the URL of a tab.
 * @function
 * @param {integer} tab - The ID of the tab.
 * @param {integer} frame - The ID of the frame.
 * @return {string} The URL of the tab, or an empty string if it is not known.
 */
a.getTabURL = (() => {
    //The tabs database
    let tabs = {};
    if (a.debugMode) {
        //Expose private object in debug mode
        window.getTabURLInternal = tabs;
    }
    //Query existing tabs
    chrome.tabs.query({}, (existingTabs) => {
        for (let i = 0; i < existingTabs.length; i++) {
            const id = existingTabs[i].id;
            if (id !== chrome.tabs.TAB_ID_NONE) {
                if (!tabs[id]) {
                    tabs[id] = {};
                }
                //Only assign if it does not exist
                tabs[id][0] = tabs[id][0] || existingTabs[i].url;
                //Query frames
                chrome.webNavigation.getAllFrames({ tabId: id }, (frames) => {
                    //This can fail if the tab is closed at the right timing
                    if (!chrome.runtime.lastError && tabs[id]) {
                        for (let ii = 0; ii < frames.length; ii++) {
                            //Only assign if it does not exist
                            tabs[id][frames[ii].frameId] = tabs[id][frames[ii].frameId] || frames[ii].url;
                        }
                    }
                });
            }
        }
    });
    //Bind event handlers
    chrome.webNavigation.onCommitted.addListener((details) => {
        if (!tabs[details.tabId]) {
            tabs[details.tabId] = {};
        }
        tabs[details.tabId][details.frameId] = details.url;
    });
    chrome.tabs.onRemoved.addListener((id) => {
        //Free memory when tab is closed
        delete tabs[id];
    });
    //Return closure function
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
            //Defaults to not match if the scheme is not supported or the URL is not valid
            return false;
        }
        dom = dom[1];
        //Loop though each element
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
 * @param {Function} server - The server, this function will be passed as the event listener, view Chrome API
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
    //Payload generator
    /*
    a.mkPayload("jQuery plugin", () => {
        "use strict";
        window.console.error("Uncaught Error: jQuery uBlock Origin detector plugin is not allowed on this device!");
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
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7d2luZG93LmNvbnNvbGUuZXJyb3IoIlVuY2F1Z2h0IEVycm9yOiBqUXVlcnkgdUJsb2NrIE9yaWdpbiBkZXRlY3RvciBwbH" +
        "VnaW4gaXMgbm90IGFsbG93ZWQgb24gdGhpcyBkZXZpY2UhIik7dHJ5IHt3aW5kb3cuJC5hZGJsb2NrID0gZmFsc2U7fSBjYXRjaCAoZXJyKSB7IH10cnkge3dpbmRvdy5qUXVlcnkuYWRibG9jayA9" +
        "IGZhbHNlO30gY2F0Y2ggKGVycikgeyB9fSkoKTs=",
    );
    //---Interactive Media Ads Software Development Kit---
    //Payload generator
    /*
    //https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
    a.mkPayload("IMA SDK", () => {
        "use strict";
        window.console.error("Uncaught Error: IMA SDK is not allowed on this device!");
        //I think I can get away with not implementing interfaces
        window.google = window.google || {};
        window.google.ima = {
            AdDisplayContainer: class {
                //constructor(container, video, click) { }
                initialize() { }
                destroy() { }
            },
            AdError: class extends Error {
                constructor(message, code, type) {
                    super(message);
                    this.code = code;
                    this.type = type;
                }
                getErrorCode() {
                    return this.code;
                }
                getInnerError() {
                    return null;
                }
                getMessage() {
                    return this.message;
                }
                getType() {
                    return this.type;
                }
                getVastErrorCode() {
                    return window.google.ima.AdError.ErrorCode.UNKNOWN_ERROR;
                }
            },
            AdErrorEvent: class extends ErrorEvent {
                constructor(error, context) {
                    super(error);
                    this.errObj = error;
                    this.context = context;
                }
                getError() {
                    return this.errObj;
                }
                getUserRequestContext() {
                    return this.context;
                }
            },
            AdEvent: class extends Event {
                constructor(type, ad, adData) {
                    super(type);
                    this.ad = ad;
                    this.adData = adData;
                }
                getAd() {
                    return this.ad;
                }
                getAdData() {
                    return this.adData;
                }
            },
            AdsLoader: class {
                //Event logic
                constructor() {
                    //Error event callbacks
                    this.onError = [];
                    this.onErrorScope = [];
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
                        this.onError.push(handler);
                        this.onErrorScope.push(scope);
                    } else {
                        window.console.warn(`IMA event ${event} is ignored by uBlock Protector.`);
                    }
                }
                removeEventListener(event, handler) {
                    //capture and scope are not checked
                    if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                        for (let i = 0; i < this.onError.length; i++) {
                            //This should be good enough
                            if (this.onError[i] === handler) {
                                this.onError.splice(i, 1);
                                this.onErrorScope.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    //Ignore otherwise
                }
                _dispatchError() {
                    for (let i = 0; i < this.onError.length; i++) {
                        this.onError[i].call(this.onErrorScope[i] || window, this._error);
                    }
                }
                //Other logic
                contentComplete() { }
                destroy() { }
                getSettings() {
                    return window.google.ima.settings;
                }
                requestAds() {
                    window.setTimeout(this._dispatchError(), 10);
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
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7d2luZG93LmNvbnNvbGUuZXJyb3IoIlVuY2F1Z2h0IEVycm9yOiBJTUEgU0RLIGlzIG5vdCBhbGxvd2VkIG9uIHRoaXMgZG" +
        "V2aWNlISIpO3dpbmRvdy5nb29nbGUgPSB3aW5kb3cuZ29vZ2xlIHx8IHt9O3dpbmRvdy5nb29nbGUuaW1hID0ge0FkRGlzcGxheUNvbnRhaW5lcjogY2xhc3Mge2luaXRpYWxpemUoKSB7IH1kZXN0" +
        "cm95KCkgeyB9fSxBZEVycm9yOiBjbGFzcyBleHRlbmRzIEVycm9yIHtjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlLCB0eXBlKSB7c3VwZXIobWVzc2FnZSk7dGhpcy5jb2RlID0gY29kZTt0aGlzLn" +
        "R5cGUgPSB0eXBlO31nZXRFcnJvckNvZGUoKSB7cmV0dXJuIHRoaXMuY29kZTt9Z2V0SW5uZXJFcnJvcigpIHtyZXR1cm4gbnVsbDt9Z2V0TWVzc2FnZSgpIHtyZXR1cm4gdGhpcy5tZXNzYWdlO31n" +
        "ZXRUeXBlKCkge3JldHVybiB0aGlzLnR5cGU7fWdldFZhc3RFcnJvckNvZGUoKSB7cmV0dXJuIHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuRXJyb3JDb2RlLlVOS05PV05fRVJST1I7fX0sQWRFcn" +
        "JvckV2ZW50OiBjbGFzcyBleHRlbmRzIEVycm9yRXZlbnQge2NvbnN0cnVjdG9yKGVycm9yLCBjb250ZXh0KSB7c3VwZXIoZXJyb3IpO3RoaXMuZXJyT2JqID0gZXJyb3I7dGhpcy5jb250ZXh0ID0g" +
        "Y29udGV4dDt9Z2V0RXJyb3IoKSB7cmV0dXJuIHRoaXMuZXJyT2JqO31nZXRVc2VyUmVxdWVzdENvbnRleHQoKSB7cmV0dXJuIHRoaXMuY29udGV4dDt9fSxBZEV2ZW50OiBjbGFzcyBleHRlbmRzIE" +
        "V2ZW50IHtjb25zdHJ1Y3Rvcih0eXBlLCBhZCwgYWREYXRhKSB7c3VwZXIodHlwZSk7dGhpcy5hZCA9IGFkO3RoaXMuYWREYXRhID0gYWREYXRhO31nZXRBZCgpIHtyZXR1cm4gdGhpcy5hZDt9Z2V0" +
        "QWREYXRhKCkge3JldHVybiB0aGlzLmFkRGF0YTt9fSxBZHNMb2FkZXI6IGNsYXNzIHtjb25zdHJ1Y3RvcigpIHt0aGlzLm9uRXJyb3IgPSBbXTt0aGlzLm9uRXJyb3JTY29wZSA9IFtdO3RoaXMuX2" +
        "Vycm9yID0gbmV3IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudChuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvcigiTm8gYWRzIGF2YWlsYWJsZSIsd2luZG93Lmdvb2dsZS5pbWEuQWRF" +
        "cnJvci5FcnJvckNvZGUuVkFTVF9OT19BRFNfQUZURVJfV1JBUFBFUix3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLlR5cGUuQURfTE9BRCwpLHt9LCk7fWFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG" +
        "hhbmRsZXIsIGNhcHR1cmUsIHNjb3BlKSB7aWYgKGV2ZW50ID09PSB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZS5BRF9FUlJPUikge3RoaXMub25FcnJvci5wdXNoKGhhbmRsZXIp" +
        "O3RoaXMub25FcnJvclNjb3BlLnB1c2goc2NvcGUpO30gZWxzZSB7d2luZG93LmNvbnNvbGUud2FybihgSU1BIGV2ZW50ICR7ZXZlbnR9IGlzIGlnbm9yZWQgYnkgdUJsb2NrIFByb3RlY3Rvci5gKT" +
        "t9fXJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpIHtpZiAoZXZlbnQgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7Zm9yIChsZXQgaSA9" +
        "IDA7IGkgPCB0aGlzLm9uRXJyb3IubGVuZ3RoOyBpKyspIHtpZiAodGhpcy5vbkVycm9yW2ldID09PSBoYW5kbGVyKSB7dGhpcy5vbkVycm9yLnNwbGljZShpLCAxKTt0aGlzLm9uRXJyb3JTY29wZS" +
        "5zcGxpY2UoaSwgMSk7aS0tO319fX1fZGlzcGF0Y2hFcnJvcigpIHtmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub25FcnJvci5sZW5ndGg7IGkrKykge3RoaXMub25FcnJvcltpXS5jYWxsKHRoaXMu" +
        "b25FcnJvclNjb3BlW2ldIHx8IHdpbmRvdywgdGhpcy5fZXJyb3IpO319Y29udGVudENvbXBsZXRlKCkgeyB9ZGVzdHJveSgpIHsgfWdldFNldHRpbmdzKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLm" +
        "ltYS5zZXR0aW5nczt9cmVxdWVzdEFkcygpIHt3aW5kb3cuc2V0VGltZW91dCh0aGlzLl9kaXNwYXRjaEVycm9yKCksIDEwKTt9fSxBZHNNYW5hZ2VyTG9hZGVkRXZlbnQ6IGNsYXNzIGV4dGVuZHMg" +
        "RXZlbnQge2NvbnN0cnVjdG9yKCkge3Rocm93IG5ldyB3aW5kb3cuRXJyb3IoIk5ldXRyYWxpemVkIEFkc01hbmFnZXIgaXMgbm90IGltcGxlbWVudGVkLiIpO319LEFkc1JlbmRlcmluZ1NldHRpbm" +
        "dzOiBjbGFzcyB7fSxBZHNSZXF1ZXN0OiBjbGFzcyB7c2V0QWRXaWxsQXV0b1BsYXkoKSB7IH19LENvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3M6IGNsYXNzIHt9LEltYVNka1NldHRpbmdzOiBj" +
        "bGFzcyB7Z2V0Q29tcGFuaW9uQmFja2ZpbGwoKSB7cmV0dXJuIHdpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLkNvbXBhbmlvbkJhY2tmaWxsTW9kZS5BTFdBWVM7fWdldERpc2FibGVDdX" +
        "N0b21QbGF5YmFja0ZvcklPUzEwUGx1cygpIHtyZXR1cm4gZmFsc2U7fWdldERpc2FibGVGbGFzaEFkcygpIHtyZXR1cm4gdHJ1ZTt9Z2V0TG9jYWxlKCkge3JldHVybiAiZW4tQ0EiO31nZXROdW1S" +
        "ZWRpcmVjdHMoKSB7cmV0dXJuIDE7fWdldFBsYXllclR5cGUoKSB7cmV0dXJuICJVbmtub3duIjt9Z2V0UGxheWVyVmVyc2lvbigpIHtyZXR1cm4gIjEuMC4wIjt9Z2V0UHBpZCgpIHtyZXR1cm4gIj" +
        "JHakNnb0VDQVAwSWJVIjt9c2V0QXV0b1BsYXlBZEJyZWFrcygpIHsgfXNldENvbXBhbmlvbkJhY2tmaWxsKCkgeyB9c2V0RGlzYWJsZUN1c3RvbVBsYXliYWNrRm9ySU9TMTBQbHVzKCkgeyB9c2V0" +
        "RGlzYWJsZUZsYXNoQWRzKCkgeyB9c2V0TG9jYWxlKCkgeyB9c2V0TnVtUmVkaXJlY3RzKCkgeyB9c2V0UGxheWVyVHlwZSgpIHsgfXNldFBsYXllclZlcnNpb24oKSB7IH1zZXRQcGlkKCkgeyB9c2" +
        "V0VnBhaWRBbGxvd2VkKCkgeyB9c2V0VnBhaWRNb2RlKCkgeyB9fSxVaUVsZW1lbnRzOiB7Q09VTlRET1dOOiAiY291bnRkb3duIix9LFZpZXdNb2RlOiB7RlVMTFNDUkVFTjogImZ1bGxzY3JlZW4i" +
        "LE5PUk1BTDogIm5vcm1hbCIsfSxWRVJTSU9OOiAiMy4xNzMuNCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZSA9IHtWSURFT19QTEFZX0VSUk9SOiA0MDAsRkFJTEVEX1RPX1" +
        "JFUVVFU1RfQURTOiAxMDA1LFJFUVVJUkVEX0xJU1RFTkVSU19OT1RfQURERUQ6IDkwMCxWQVNUX0xPQURfVElNRU9VVDogMzAxLFZBU1RfTk9fQURTX0FGVEVSX1dSQVBQRVI6IDMwMyxWQVNUX01F" +
        "RElBX0xPQURfVElNRU9VVDogNDAyLFZBU1RfVE9PX01BTllfUkVESVJFQ1RTOiAzMDIsVkFTVF9BU1NFVF9NSVNNQVRDSDogNDAzLFZBU1RfTElORUFSX0FTU0VUX01JU01BVENIOiA0MDMsVkFTVF" +
        "9OT05MSU5FQVJfQVNTRVRfTUlTTUFUQ0g6IDUwMyxWQVNUX0FTU0VUX05PVF9GT1VORDogMTAwNyxWQVNUX1VOU1VQUE9SVEVEX1ZFUlNJT046IDEwMixWQVNUX1NDSEVNQV9WQUxJREFUSU9OX0VS" +
        "Uk9SOiAxMDEsVkFTVF9UUkFGRklDS0lOR19FUlJPUjogMjAwLFZBU1RfVU5FWFBFQ1RFRF9MSU5FQVJJVFk6IDIwMSxWQVNUX1VORVhQRUNURURfRFVSQVRJT05fRVJST1I6IDIwMixWQVNUX1dSQV" +
        "BQRVJfRVJST1I6IDMwMCxOT05MSU5FQVJfRElNRU5TSU9OU19FUlJPUjogNTAxLENPTVBBTklPTl9SRVFVSVJFRF9FUlJPUjogNjAyLFZBU1RfRU1QVFlfUkVTUE9OU0U6IDEwMDksVU5TVVBQT1JU" +
        "RURfTE9DQUxFOiAxMDExLElOVkFMSURfQURYX0VYVEVOU0lPTjogMTEwNSxJTlZBTElEX0FSR1VNRU5UUzogMTEwMSxVTktOT1dOX0FEX1JFU1BPTlNFOiAxMDEwLFVOS05PV05fRVJST1I6IDkwMC" +
        "xPVkVSTEFZX0FEX1BMQVlJTkdfRkFJTEVEOiA1MDAsVklERU9fRUxFTUVOVF9VU0VEOiAtMSxWSURFT19FTEVNRU5UX1JFUVVJUkVEOiAtMSxWQVNUX01FRElBX0VSUk9SOiAtMSxBRFNMT1RfTk9U" +
        "X1ZJU0lCTEU6IC0xLE9WRVJMQVlfQURfTE9BRElOR19GQUlMRUQ6IC0xLFZBU1RfTUFMRk9STUVEX1JFU1BPTlNFOiAtMSxDT01QQU5JT05fQURfTE9BRElOR19GQUlMRUQ6IC0xLH07d2luZG93Lm" +
        "dvb2dsZS5pbWEuQWRFcnJvci5UeXBlID0ge0FEX0xPQUQ6ICJhZExvYWRFcnJvciIsQURfUExBWTogImFkUGxheUVycm9yIix9O3dpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlID0g" +
        "e0FEX0VSUk9SOiAiYWRFcnJvciIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUgPSB7Q09OVEVOVF9SRVNVTUVfUkVRVUVTVEVEOiAiY29udGVudFJlc3VtZVJlcXVlc3RlZCIsQ09OVE" +
        "VOVF9QQVVTRV9SRVFVRVNURUQ6ICJjb250ZW50UGF1c2VSZXF1ZXN0ZWQiLENMSUNLOiAiY2xpY2siLERVUkFUSU9OX0NIQU5HRTogImR1cmF0aW9uQ2hhbmdlIixFWFBBTkRFRF9DSEFOR0VEOiAi" +
        "ZXhwYW5kZWRDaGFuZ2VkIixTVEFSVEVEOiAic3RhcnQiLElNUFJFU1NJT046ICJpbXByZXNzaW9uIixQQVVTRUQ6ICJwYXVzZSIsUkVTVU1FRDogInJlc3VtZSIsRklSU1RfUVVBUlRJTEU6ICJmaX" +
        "JzdHF1YXJ0aWxlIixNSURQT0lOVDogIm1pZHBvaW50IixUSElSRF9RVUFSVElMRTogInRoaXJkcXVhcnRpbGUiLENPTVBMRVRFOiAiY29tcGxldGUiLFVTRVJfQ0xPU0U6ICJ1c2VyQ2xvc2UiLExJ" +
        "TkVBUl9DSEFOR0VEOiAibGluZWFyQ2hhbmdlZCIsTE9BREVEOiAibG9hZGVkIixBRF9DQU5fUExBWTogImFkQ2FuUGxheSIsQURfTUVUQURBVEE6ICJhZE1ldGFkYXRhIixBRF9CUkVBS19SRUFEWT" +
        "ogImFkQnJlYWtSZWFkeSIsSU5URVJBQ1RJT046ICJpbnRlcmFjdGlvbiIsQUxMX0FEU19DT01QTEVURUQ6ICJhbGxBZHNDb21wbGV0ZWQiLFNLSVBQRUQ6ICJza2lwIixTS0lQUEFCTEVfU1RBVEVf" +
        "Q0hBTkdFRDogInNraXBwYWJsZVN0YXRlQ2hhbmdlZCIsTE9HOiAibG9nIixWSUVXQUJMRV9JTVBSRVNTSU9OOiAidmlld2FibGVfaW1wcmVzc2lvbiIsVk9MVU1FX0NIQU5HRUQ6ICJ2b2x1bWVDaG" +
        "FuZ2UiLFZPTFVNRV9NVVRFRDogIm11dGUiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRzTWFuYWdlckxvYWRlZEV2ZW50LlR5cGUgPSB7QURTX01BTkFHRVJfTE9BREVEOiAiYWRzTWFuYWdlckxvYWRl" +
        "ZCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLkNyZWF0aXZlVHlwZSA9IHtBTEw6ICJBbGwiLEZMQVNIOiAiRmxhc2giLElNQUdFOiAiSW1hZ2UiLH07d2" +
        "luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5SZXNvdXJjZVR5cGUgPSB7QUxMOiAiQWxsIixIVE1MOiAiSHRtbCIsSUZSQU1FOiAiSUZyYW1lIixTVEFUSUM6ICJT" +
        "dGF0aWMiLH07d2luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5TaXplQ3JpdGVyaWEgPSB7SUdOT1JFOiAiSWdub3JlU2l6ZSIsU0VMRUNUX0VYQUNUX01BVENIOi" +
        "AiU2VsZWN0RXhhY3RNYXRjaCIsU0VMRUNUX05FQVJfTUFUQ0g6ICJTZWxlY3ROZWFyTWF0Y2giLH07d2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuQ29tcGFuaW9uQmFja2ZpbGxNb2Rl" +
        "ID0ge0FMV0FZUzogImFsd2F5cyIsT05fTUFTVEVSX0FEOiAib25fbWFzdGVyX2FkIix9O3dpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLlZwYWlkTW9kZSA9IHtESVNBQkxFRDogMCxFTk" +
        "FCTEVEOiAxLElOU0VDVVJFOiAyLH07d2luZG93Lmdvb2dsZS5pbWEuc2V0dGluZ3MgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MoKTt9KSgpOw==",
        a.debugMode ? undefined : [
            //Damage control
            "cbsnews.com",
        ],
        false,
    );
    //---MoatFreeWheelJSPEM.js---
    //Payload generator
    /*
    a.mkPayload("MoatFreeWheelJSPEM.js", () => {
        "use strict";
        window.console.error("Uncaught Error: FreeWheel SDK is not allowed on this device!");
        window.MoatFreeWheelJSPEM = class {
            init() { }
            dispose() { }
        };
    });
    */
    a.staticServer(
        [
            "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
            "https://*.moatads.com/*/MoatFreeWheelJSPEM.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7d2luZG93LmNvbnNvbGUuZXJyb3IoIlVuY2F1Z2h0IEVycm9yOiBGcmVlV2hlZWwgU0RLIGlzIG5vdCBhbGxvd2VkIG9uIH" +
        "RoaXMgZGV2aWNlISIpO3dpbmRvdy5Nb2F0RnJlZVdoZWVsSlNQRU0gPSBjbGFzcyB7aW5pdCgpIHsgfWRpc3Bvc2UoKSB7IH19O30pKCk7",
    );
};

//=====Debug Utilities=====
/**
 * Attempt to make the server think the request is from a different IP.
 * This function is for debugging purposes only, and is only available in debug mode.
 * @function
 * @param {string} urls - The URLs to activate on.
 * @param {string} ip - The IP.
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
 * Make data URL and pretty print it into the console.
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
    //Trim each line to make it smaller
    let lines = (`(${payload})();`).split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        //Remove comments
        if (lines[i].startsWith("//")) {
            lines.splice(i, 1);
            i--;
        }
    }
    //Encode and pretty print
    payload = `data:${type};base64,` + btoa(lines.join(""));
    let output = "";
    while (payload) {
        output += `"${payload.substring(0, 150)}" +\n`;
        payload = payload.substring(150);
    }
    console.log(title);
    console.log(output);
};
