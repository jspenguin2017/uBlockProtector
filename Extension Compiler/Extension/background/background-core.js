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
                        console.log(`Sending cross origin request to ${args[0].details.url}`);
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
 * Get the URL of a frame of a tab.
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
        let warnCount = 0;
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
                    return this.message;
                }
                getType() {
                    return this._type;
                }
                getVastErrorCode() {
                    return window.google.ima.AdError.ErrorCode.UNKNOWN_ERROR;
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
                        window.console.warn(`IMA event ${event} is ignored by uBlock Protector.`);
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
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7d2luZG93LmNvbnNvbGUuZXJyb3IoIlVuY2F1Z2h0IEVycm9yOiBJTUEgU0RLIGlzIG5vdCBhbGxvd2VkIG9uIHRoaXMgZG" +
        "V2aWNlISIpO2xldCB3YXJuQ291bnQgPSAwO3dpbmRvdy5nb29nbGUgPSB3aW5kb3cuZ29vZ2xlIHx8IHt9O3dpbmRvdy5nb29nbGUuaW1hID0ge0FkRGlzcGxheUNvbnRhaW5lcjogY2xhc3Mge2lu" +
        "aXRpYWxpemUoKSB7IH1kZXN0cm95KCkgeyB9fSxBZEVycm9yOiBjbGFzcyBleHRlbmRzIEVycm9yIHtjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlLCB0eXBlKSB7c3VwZXIobWVzc2FnZSk7dGhpcy" +
        "5fY29kZSA9IGNvZGU7dGhpcy5fdHlwZSA9IHR5cGU7fWdldEVycm9yQ29kZSgpIHtyZXR1cm4gdGhpcy5fY29kZTt9Z2V0SW5uZXJFcnJvcigpIHtyZXR1cm4gbnVsbDt9Z2V0TWVzc2FnZSgpIHty" +
        "ZXR1cm4gdGhpcy5tZXNzYWdlO31nZXRUeXBlKCkge3JldHVybiB0aGlzLl90eXBlO31nZXRWYXN0RXJyb3JDb2RlKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS" +
        "5VTktOT1dOX0VSUk9SO319LEFkRXJyb3JFdmVudDogY2xhc3MgZXh0ZW5kcyBFcnJvckV2ZW50IHtjb25zdHJ1Y3RvcihlcnJvciwgY29udGV4dCkge3N1cGVyKGVycm9yKTt0aGlzLl9lcnJPYmog" +
        "PSBlcnJvcjt0aGlzLl9jb250ZXh0ID0gY29udGV4dDt9Z2V0RXJyb3IoKSB7cmV0dXJuIHRoaXMuX2Vyck9iajt9Z2V0VXNlclJlcXVlc3RDb250ZXh0KCkge3JldHVybiB0aGlzLl9jb250ZXh0O3" +
        "19LEFkRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXZlbnQge2NvbnN0cnVjdG9yKHR5cGUsIGFkLCBhZERhdGEpIHtzdXBlcih0eXBlKTt0aGlzLl9hZCA9IGFkO3RoaXMuX2FkRGF0YSA9IGFkRGF0YTt9" +
        "Z2V0QWQoKSB7cmV0dXJuIHRoaXMuX2FkO31nZXRBZERhdGEoKSB7cmV0dXJuIHRoaXMuX2FkRGF0YTt9fSxBZHNMb2FkZXI6IGNsYXNzIHtjb25zdHJ1Y3RvcigpIHt0aGlzLl9vbkVycm9yID0gW1" +
        "07dGhpcy5fb25FcnJvclNjb3BlID0gW107dGhpcy5fZXJyb3IgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50KG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yKCJObyBhZHMg" +
        "YXZhaWxhYmxlIix3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS5WQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSLHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZS5BRF9MT0FELC" +
        "kse30sKTt9YWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgY2FwdHVyZSwgc2NvcGUpIHtpZiAoZXZlbnQgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VS" +
        "Uk9SKSB7dGhpcy5fb25FcnJvci5wdXNoKGhhbmRsZXIpO3RoaXMuX29uRXJyb3JTY29wZS5wdXNoKHNjb3BlKTt9IGVsc2UgaWYgKHdhcm5Db3VudCA8IDEwKSB7d2FybkNvdW50Kys7d2luZG93Lm" +
        "NvbnNvbGUud2FybihgSU1BIGV2ZW50ICR7ZXZlbnR9IGlzIGlnbm9yZWQgYnkgdUJsb2NrIFByb3RlY3Rvci5gKTt9fXJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpIHtpZiAoZXZl" +
        "bnQgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9vbkVycm9yLmxlbmd0aDsgaSsrKSB7aWYgKHRoaXMuX2" +
        "9uRXJyb3JbaV0gPT09IGhhbmRsZXIpIHt0aGlzLl9vbkVycm9yLnNwbGljZShpLCAxKTt0aGlzLl9vbkVycm9yU2NvcGUuc3BsaWNlKGksIDEpO2ktLTt9fX19X2Rpc3BhdGNoRXJyb3IoKSB7Zm9y" +
        "IChsZXQgaSA9IDA7IGkgPCB0aGlzLl9vbkVycm9yLmxlbmd0aDsgaSsrKSB7aWYgKHRoaXMuX29uRXJyb3JTY29wZVtpXSkge3RoaXMuX29uRXJyb3JbaV0uY2FsbCh0aGlzLl9vbkVycm9yU2NvcG" +
        "VbaV0sIHRoaXMuX2Vycm9yKTt9IGVsc2Uge3RoaXMuX29uRXJyb3JbaV0odGhpcy5fZXJyb3IpO319fWNvbnRlbnRDb21wbGV0ZSgpIHsgfWRlc3Ryb3koKSB7IH1nZXRTZXR0aW5ncygpIHtyZXR1" +
        "cm4gd2luZG93Lmdvb2dsZS5pbWEuc2V0dGluZ3M7fXJlcXVlc3RBZHMoKSB7d2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvci5iaW5kKHRoaXMpLCAxMCk7fX0sQWRzTWFuYWdlck" +
        "xvYWRlZEV2ZW50OiBjbGFzcyBleHRlbmRzIEV2ZW50IHtjb25zdHJ1Y3RvcigpIHt0aHJvdyBuZXcgd2luZG93LkVycm9yKCJOZXV0cmFsaXplZCBBZHNNYW5hZ2VyIGlzIG5vdCBpbXBsZW1lbnRl" +
        "ZC4iKTt9fSxBZHNSZW5kZXJpbmdTZXR0aW5nczogY2xhc3Mge30sQWRzUmVxdWVzdDogY2xhc3Mge3NldEFkV2lsbEF1dG9QbGF5KCkgeyB9fSxDb21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzOi" +
        "BjbGFzcyB7fSxJbWFTZGtTZXR0aW5nczogY2xhc3Mge2dldENvbXBhbmlvbkJhY2tmaWxsKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5Db21wYW5pb25CYWNrZmls" +
        "bE1vZGUuQUxXQVlTO31nZXREaXNhYmxlQ3VzdG9tUGxheWJhY2tGb3JJT1MxMFBsdXMoKSB7cmV0dXJuIGZhbHNlO31nZXREaXNhYmxlRmxhc2hBZHMoKSB7cmV0dXJuIHRydWU7fWdldExvY2FsZS" +
        "gpIHtyZXR1cm4gImVuLUNBIjt9Z2V0TnVtUmVkaXJlY3RzKCkge3JldHVybiAxO31nZXRQbGF5ZXJUeXBlKCkge3JldHVybiAiVW5rbm93biI7fWdldFBsYXllclZlcnNpb24oKSB7cmV0dXJuICIx" +
        "LjAuMCI7fWdldFBwaWQoKSB7cmV0dXJuICIyR2pDZ29FQ0FQMEliVSI7fXNldEF1dG9QbGF5QWRCcmVha3MoKSB7IH1zZXRDb21wYW5pb25CYWNrZmlsbCgpIHsgfXNldERpc2FibGVDdXN0b21QbG" +
        "F5YmFja0ZvcklPUzEwUGx1cygpIHsgfXNldERpc2FibGVGbGFzaEFkcygpIHsgfXNldExvY2FsZSgpIHsgfXNldE51bVJlZGlyZWN0cygpIHsgfXNldFBsYXllclR5cGUoKSB7IH1zZXRQbGF5ZXJW" +
        "ZXJzaW9uKCkgeyB9c2V0UHBpZCgpIHsgfXNldFZwYWlkQWxsb3dlZCgpIHsgfXNldFZwYWlkTW9kZSgpIHsgfX0sVWlFbGVtZW50czoge0NPVU5URE9XTjogImNvdW50ZG93biIsfSxWaWV3TW9kZT" +
        "oge0ZVTExTQ1JFRU46ICJmdWxsc2NyZWVuIixOT1JNQUw6ICJub3JtYWwiLH0sVkVSU0lPTjogIjMuMTczLjQiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5FcnJvckNvZGUgPSB7VklERU9f" +
        "UExBWV9FUlJPUjogNDAwLEZBSUxFRF9UT19SRVFVRVNUX0FEUzogMTAwNSxSRVFVSVJFRF9MSVNURU5FUlNfTk9UX0FEREVEOiA5MDAsVkFTVF9MT0FEX1RJTUVPVVQ6IDMwMSxWQVNUX05PX0FEU1" +
        "9BRlRFUl9XUkFQUEVSOiAzMDMsVkFTVF9NRURJQV9MT0FEX1RJTUVPVVQ6IDQwMixWQVNUX1RPT19NQU5ZX1JFRElSRUNUUzogMzAyLFZBU1RfQVNTRVRfTUlTTUFUQ0g6IDQwMyxWQVNUX0xJTkVB" +
        "Ul9BU1NFVF9NSVNNQVRDSDogNDAzLFZBU1RfTk9OTElORUFSX0FTU0VUX01JU01BVENIOiA1MDMsVkFTVF9BU1NFVF9OT1RfRk9VTkQ6IDEwMDcsVkFTVF9VTlNVUFBPUlRFRF9WRVJTSU9OOiAxMD" +
        "IsVkFTVF9TQ0hFTUFfVkFMSURBVElPTl9FUlJPUjogMTAxLFZBU1RfVFJBRkZJQ0tJTkdfRVJST1I6IDIwMCxWQVNUX1VORVhQRUNURURfTElORUFSSVRZOiAyMDEsVkFTVF9VTkVYUEVDVEVEX0RV" +
        "UkFUSU9OX0VSUk9SOiAyMDIsVkFTVF9XUkFQUEVSX0VSUk9SOiAzMDAsTk9OTElORUFSX0RJTUVOU0lPTlNfRVJST1I6IDUwMSxDT01QQU5JT05fUkVRVUlSRURfRVJST1I6IDYwMixWQVNUX0VNUF" +
        "RZX1JFU1BPTlNFOiAxMDA5LFVOU1VQUE9SVEVEX0xPQ0FMRTogMTAxMSxJTlZBTElEX0FEWF9FWFRFTlNJT046IDExMDUsSU5WQUxJRF9BUkdVTUVOVFM6IDExMDEsVU5LTk9XTl9BRF9SRVNQT05T" +
        "RTogMTAxMCxVTktOT1dOX0VSUk9SOiA5MDAsT1ZFUkxBWV9BRF9QTEFZSU5HX0ZBSUxFRDogNTAwLFZJREVPX0VMRU1FTlRfVVNFRDogLTEsVklERU9fRUxFTUVOVF9SRVFVSVJFRDogLTEsVkFTVF" +
        "9NRURJQV9FUlJPUjogLTEsQURTTE9UX05PVF9WSVNJQkxFOiAtMSxPVkVSTEFZX0FEX0xPQURJTkdfRkFJTEVEOiAtMSxWQVNUX01BTEZPUk1FRF9SRVNQT05TRTogLTEsQ09NUEFOSU9OX0FEX0xP" +
        "QURJTkdfRkFJTEVEOiAtMSx9O3dpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZSA9IHtBRF9MT0FEOiAiYWRMb2FkRXJyb3IiLEFEX1BMQVk6ICJhZFBsYXlFcnJvciIsfTt3aW5kb3cuZ29vZ2" +
        "xlLmltYS5BZEVycm9yRXZlbnQuVHlwZSA9IHtBRF9FUlJPUjogImFkRXJyb3IiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlID0ge0NPTlRFTlRfUkVTVU1FX1JFUVVFU1RFRDogImNv" +
        "bnRlbnRSZXN1bWVSZXF1ZXN0ZWQiLENPTlRFTlRfUEFVU0VfUkVRVUVTVEVEOiAiY29udGVudFBhdXNlUmVxdWVzdGVkIixDTElDSzogImNsaWNrIixEVVJBVElPTl9DSEFOR0U6ICJkdXJhdGlvbk" +
        "NoYW5nZSIsRVhQQU5ERURfQ0hBTkdFRDogImV4cGFuZGVkQ2hhbmdlZCIsU1RBUlRFRDogInN0YXJ0IixJTVBSRVNTSU9OOiAiaW1wcmVzc2lvbiIsUEFVU0VEOiAicGF1c2UiLFJFU1VNRUQ6ICJy" +
        "ZXN1bWUiLEZJUlNUX1FVQVJUSUxFOiAiZmlyc3RxdWFydGlsZSIsTUlEUE9JTlQ6ICJtaWRwb2ludCIsVEhJUkRfUVVBUlRJTEU6ICJ0aGlyZHF1YXJ0aWxlIixDT01QTEVURTogImNvbXBsZXRlIi" +
        "xVU0VSX0NMT1NFOiAidXNlckNsb3NlIixMSU5FQVJfQ0hBTkdFRDogImxpbmVhckNoYW5nZWQiLExPQURFRDogImxvYWRlZCIsQURfQ0FOX1BMQVk6ICJhZENhblBsYXkiLEFEX01FVEFEQVRBOiAi" +
        "YWRNZXRhZGF0YSIsQURfQlJFQUtfUkVBRFk6ICJhZEJyZWFrUmVhZHkiLElOVEVSQUNUSU9OOiAiaW50ZXJhY3Rpb24iLEFMTF9BRFNfQ09NUExFVEVEOiAiYWxsQWRzQ29tcGxldGVkIixTS0lQUE" +
        "VEOiAic2tpcCIsU0tJUFBBQkxFX1NUQVRFX0NIQU5HRUQ6ICJza2lwcGFibGVTdGF0ZUNoYW5nZWQiLExPRzogImxvZyIsVklFV0FCTEVfSU1QUkVTU0lPTjogInZpZXdhYmxlX2ltcHJlc3Npb24i" +
        "LFZPTFVNRV9DSEFOR0VEOiAidm9sdW1lQ2hhbmdlIixWT0xVTUVfTVVURUQ6ICJtdXRlIix9O3dpbmRvdy5nb29nbGUuaW1hLkFkc01hbmFnZXJMb2FkZWRFdmVudC5UeXBlID0ge0FEU19NQU5BR0" +
        "VSX0xPQURFRDogImFkc01hbmFnZXJMb2FkZWQiLH07d2luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5DcmVhdGl2ZVR5cGUgPSB7QUxMOiAiQWxsIixGTEFTSDog" +
        "IkZsYXNoIixJTUFHRTogIkltYWdlIix9O3dpbmRvdy5nb29nbGUuaW1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuUmVzb3VyY2VUeXBlID0ge0FMTDogIkFsbCIsSFRNTDogIkh0bWwiLE" +
        "lGUkFNRTogIklGcmFtZSIsU1RBVElDOiAiU3RhdGljIix9O3dpbmRvdy5nb29nbGUuaW1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuU2l6ZUNyaXRlcmlhID0ge0lHTk9SRTogIklnbm9y" +
        "ZVNpemUiLFNFTEVDVF9FWEFDVF9NQVRDSDogIlNlbGVjdEV4YWN0TWF0Y2giLFNFTEVDVF9ORUFSX01BVENIOiAiU2VsZWN0TmVhck1hdGNoIix9O3dpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldH" +
        "RpbmdzLkNvbXBhbmlvbkJhY2tmaWxsTW9kZSA9IHtBTFdBWVM6ICJhbHdheXMiLE9OX01BU1RFUl9BRDogIm9uX21hc3Rlcl9hZCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5W" +
        "cGFpZE1vZGUgPSB7RElTQUJMRUQ6IDAsRU5BQkxFRDogMSxJTlNFQ1VSRTogMix9O3dpbmRvdy5nb29nbGUuaW1hLnNldHRpbmdzID0gbmV3IHdpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbm" +
        "dzKCk7fSkoKTs=",
        /*
        [
            //Damage control
        ],
        false,
        */
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
