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
 * @param {Function} server - The server, this function will be passed as the event listener, view Chrome API
 ** documentations for more information: https://developer.chrome.com/extensions/webRequest
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
 * Make data URL.
 * @function
 * @param {Function} payload - The payload.
 * @param {string} [type="text/javascript"] - The MIME type of the payload.
 * @return {string} The URL encoded payload.
 */
a.mkPayload = (payload, type = "text/javascript") => {
    return `data:${type};base64,${btoa(`(${payload})();`)}`;
};
/**
 * Pretty print payload. Only available in debug mode.
 * @function
 * @param {string} payload - The payload.
 */
a.printPayload = (payload) => {
    if (!a.debugMode) {
        console.error("a.printPayload() is only available in debug mode!");
        return;
    }
    let output = "";
    while (payload) {
        output += `"${payload.substring(0, 150)}" +\n`;
        payload = payload.substring(150);
    }
    console.log(output);
};

/**
 * Apply generic rules.
 * @function
 */
a.generic = () => {
    //---jQuery plugin---
    //Payload generator
    /*
    a.printPayload(a.mkPayload(() => {
        "use strict";
        window.console.error("Uncaught Error: jQuery uBlock Origin detector plugin is not allowed on this device!");
        try {
            window.$.adblock = false;
        } catch (err) { }
        try {
            window.jQuery.adblock = false;
        } catch (err) { }
    }));
    */
    a.staticServer(
        [
            "https://ads.korri.fr/index.js",
            "http://*.medianetworkinternational.com/js/advertisement.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IGpRdWVyeSB1QmxvY2" +
        "sgT3JpZ2luIGRldGVjdG9yIHBsdWdpbiBpcyBub3QgYWxsb3dlZCBvbiB0aGlzIGRldmljZSEiKTsNCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIHdpbmRvdy4kLmFkYmxvY2sgPSBmYWxzZTsN" +
        "CiAgICAgICAgfSBjYXRjaCAoZXJyKSB7IH0NCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIHdpbmRvdy5qUXVlcnkuYWRibG9jayA9IGZhbHNlOw0KICAgICAgICB9IGNhdGNoIChlcnIpIHsgfQ" +
        "0KICAgIH0pKCk7",
    );
    //---Interactive Media Ads Software Development Kit---
    //Payload generator
    /*
    //https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
    a.printPayload(a.mkPayload(() => {
        "use strict";
        window.console.error("Uncaught Error: IMA SDK is not allowed on this device!");
        //I think I can get away with not implementing interfaces
        window.google = {
            ima: {
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
                        this.onError = [];
                        //Custom scope: https://www.buzzfeed.com/
                        this.onErrorScope = [];
                        this._error = new window.google.ima.AdErrorEvent(
                            new window.google.ima.AdError(
                                "No ads available",
                                window.google.ima.AdError.ErrorCode.VAST_NO_ADS_AFTER_WRAPPER,
                                window.google.ima.AdError.Type.AD_LOAD,
                            ),
                            {},
                        );
                    }
                    addEventListener(event, handler, ignored, scope) {
                        //I think I can get away with returning error for all ads requests
                        //The whitelisted SDK would also always error out
                        if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                            this.onError.push(handler);
                            this.onErrorScope.push(scope);
                        } else {
                            window.console.warn(`IMA event ${event} is ignored by uBlock Protector.`);
                        }
                    }
                    _dispatchError() {
                        for (let i = 0; i < this.onError.length; i++) {
                            this.onError[i].call(this.onErrorScope[i] || window, this._error);
                        }
                    }
                    //Other logic
                    contentComplete() {
                        window.setTimeout(this._dispatchError(), 10);
                    }
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
            },
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
    }));
    */
    a.staticServer(
        [
            "https://imasdk.googleapis.com/js/sdkloader/ima3.js*",
            "http://imasdk.googleapis.com/js/sdkloader/ima3.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IElNQSBTREsgaXMgbm" +
        "90IGFsbG93ZWQgb24gdGhpcyBkZXZpY2UhIik7DQogICAgICAgIC8vSSB0aGluayBJIGNhbiBnZXQgYXdheSB3aXRoIG5vdCBpbXBsZW1lbnRpbmcgaW50ZXJmYWNlcw0KICAgICAgICB3aW5kb3cu" +
        "Z29vZ2xlID0gew0KICAgICAgICAgICAgaW1hOiB7DQogICAgICAgICAgICAgICAgQWREaXNwbGF5Q29udGFpbmVyOiBjbGFzcyB7DQogICAgICAgICAgICAgICAgICAgIC8vY29uc3RydWN0b3IoY2" +
        "9udGFpbmVyLCB2aWRlbywgY2xpY2spIHsgfQ0KICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplKCkgeyB9DQogICAgICAgICAgICAgICAgICAgIGRlc3Ryb3koKSB7IH0NCiAgICAgICAgICAg" +
        "ICAgICB9LA0KICAgICAgICAgICAgICAgIEFkRXJyb3I6IGNsYXNzIGV4dGVuZHMgRXJyb3Igew0KICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlLCB0eXBlKSB7DQ" +
        "ogICAgICAgICAgICAgICAgICAgICAgICBzdXBlcihtZXNzYWdlKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29kZSA9IGNvZGU7DQogICAgICAgICAgICAgICAgICAgICAgICB0aGlz" +
        "LnR5cGUgPSB0eXBlOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIGdldEVycm9yQ29kZSgpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm" +
        "NvZGU7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0SW5uZXJFcnJvcigpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsOw0KICAgICAg" +
        "ICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIGdldE1lc3NhZ2UoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlOw0KICAgICAgICAgICAgIC" +
        "AgICAgICB9DQogICAgICAgICAgICAgICAgICAgIGdldFR5cGUoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50eXBlOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAg" +
        "ICAgICAgICAgICAgICAgIGdldFZhc3RFcnJvckNvZGUoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5FcnJvckNvZGUuVU5LTk9XTl" +
        "9FUlJPUjsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgQWRFcnJvckV2ZW50OiBjbGFzcyBleHRlbmRzIEVycm9yRXZlbnQgew0KICAg" +
        "ICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcihlcnJvciwgY29udGV4dCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIoZXJyb3IpOw0KICAgICAgICAgICAgICAgICAgICAgICAgdG" +
        "hpcy5lcnJPYmogPSBlcnJvcjsNCiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAg" +
        "Z2V0RXJyb3IoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJPYmo7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0VXNlclJlcX" +
        "Vlc3RDb250ZXh0KCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dDsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAg" +
        "ICAgICAgICAgQWRFdmVudDogY2xhc3MgZXh0ZW5kcyBFdmVudCB7DQogICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHR5cGUsIGFkLCBhZERhdGEpIHsNCiAgICAgICAgICAgICAgICAgIC" +
        "AgICAgIHN1cGVyKHR5cGUpOw0KICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZCA9IGFkOw0KICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZERhdGEgPSBhZERhdGE7DQogICAgICAg" +
        "ICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0QWQoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZDsNCiAgICAgICAgICAgICAgICAgICAgfQ0KIC" +
        "AgICAgICAgICAgICAgICAgICBnZXRBZERhdGEoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZERhdGE7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAg" +
        "ICAgICB9LA0KICAgICAgICAgICAgICAgIEFkc0xvYWRlcjogY2xhc3Mgew0KICAgICAgICAgICAgICAgICAgICAvL0V2ZW50IGxvZ2ljDQogICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKC" +
        "kgew0KICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yID0gW107DQogICAgICAgICAgICAgICAgICAgICAgICAvL0N1c3RvbSBzY29wZTogaHR0cHM6Ly93d3cuYnV6emZlZWQuY29t" +
        "Lw0KICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yU2NvcGUgPSBbXTsNCiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gbmV3IHdpbmRvdy5nb29nbGUuaW1hLk" +
        "FkRXJyb3JFdmVudCgNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvcigNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIk5vIGFk" +
        "cyBhdmFpbGFibGUiLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS5WQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSLA0KIC" +
        "AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLlR5cGUuQURfTE9BRCwNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLA0KICAgICAgICAg" +
        "ICAgICAgICAgICAgICAgICAgIHt9LA0KICAgICAgICAgICAgICAgICAgICAgICAgKTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKG" +
        "V2ZW50LCBoYW5kbGVyLCBpZ25vcmVkLCBzY29wZSkgew0KICAgICAgICAgICAgICAgICAgICAgICAgLy9JIHRoaW5rIEkgY2FuIGdldCBhd2F5IHdpdGggcmV0dXJuaW5nIGVycm9yIGZvciBhbGwg" +
        "YWRzIHJlcXVlc3RzDQogICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB3aGl0ZWxpc3RlZCBTREsgd291bGQgYWxzbyBhbHdheXMgZXJyb3Igb3V0DQogICAgICAgICAgICAgICAgICAgICAgIC" +
        "BpZiAoZXZlbnQgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yLnB1c2goaGFu" +
        "ZGxlcik7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yU2NvcGUucHVzaChzY29wZSk7DQogICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgIC" +
        "AgICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLndhcm4oYElNQSBldmVudCAke2V2ZW50fSBpcyBpZ25vcmVkIGJ5IHVCbG9jayBQcm90ZWN0b3IuYCk7DQogICAgICAgICAgICAgICAgICAg" +
        "ICAgICB9DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgX2Rpc3BhdGNoRXJyb3IoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaS" +
        "A8IHRoaXMub25FcnJvci5sZW5ndGg7IGkrKykgew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcltpXS5jYWxsKHRoaXMub25FcnJvclNjb3BlW2ldIHx8IHdpbmRvdywg" +
        "dGhpcy5fZXJyb3IpOw0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIC8vT3RoZXIgbG9naWMNCiAgICAgICAgICAgIC" +
        "AgICAgICAgY29udGVudENvbXBsZXRlKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvcigpLCAxMCk7DQogICAgICAgICAgICAg" +
        "ICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZGVzdHJveSgpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRTZXR0aW5ncygpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybi" +
        "B3aW5kb3cuZ29vZ2xlLmltYS5zZXR0aW5nczsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QWRzKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAg" +
        "d2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvcigpLCAxMCk7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgICAgICAgIEFkc01hbm" +
        "FnZXJMb2FkZWRFdmVudDogY2xhc3MgZXh0ZW5kcyBFdmVudCB7DQogICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgLy9JIHRoaW5rIEkg" +
        "Y2FuIGdldCBhd2F5IHdpdGggaXQgYXMgbG9uZyBhcyBJIGRvIG5vdCBkaXNwYXRjaCB0aGUgZXZlbnQNCiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyB3aW5kb3cuRXJyb3IoIk5ldX" +
        "RyYWxpemVkIEFkc01hbmFnZXIgaXMgbm90IGltcGxlbWVudGVkLiIpOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBBZHNSZW5kZXJp" +
        "bmdTZXR0aW5nczogY2xhc3Mgew0KICAgICAgICAgICAgICAgICAgICAvL0kgdGhpbmsgSSBjYW4gZ2V0IGF3YXkgd2l0aCBub3QgZGVmaW5pbmcgYW55dGhpbmcNCiAgICAgICAgICAgICAgICAgIC" +
        "AgLy9jb25zdHJ1Y3RvcigpIHsgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgQWRzUmVxdWVzdDogY2xhc3Mgew0KICAgICAgICAgICAgICAgICAgICAvL0kgdGhpbmsgSSBj" +
        "YW4gZ2V0IGF3YXkgd2l0aCBub3QgZGVmaW5pbmcgYW55dGhpbmcNCiAgICAgICAgICAgICAgICAgICAgLy9jb25zdHJ1Y3RvcigpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXRBZFdpbGxBdX" +
        "RvUGxheSgpIHsgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5nczogY2xhc3Mgew0KICAgICAgICAgICAgICAgICAgICAvL0kg" +
        "dGhpbmsgSSBjYW4gZ2V0IGF3YXkgd2l0aCBub3QgZGVmaW5pbmcgYW55dGhpbmcNCiAgICAgICAgICAgICAgICAgICAgLy9jb25zdHJ1Y3RvcigpIHsgfQ0KICAgICAgICAgICAgICAgIH0sDQogIC" +
        "AgICAgICAgICAgICAgSW1hU2RrU2V0dGluZ3M6IGNsYXNzIHsNCiAgICAgICAgICAgICAgICAgICAgLy9JIHRoaW5rIEkgY2FuIGdldCBhd2F5IHdpdGggbm90IGRlZmluaW5nIGFueXRoaW5nDQog" +
        "ICAgICAgICAgICAgICAgICAgIC8vY29uc3RydWN0b3IoKSB7IH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0Q29tcGFuaW9uQmFja2ZpbGwoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZX" +
        "R1cm4gd2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuQ29tcGFuaW9uQmFja2ZpbGxNb2RlLkFMV0FZUzsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBn" +
        "ZXREaXNhYmxlQ3VzdG9tUGxheWJhY2tGb3JJT1MxMFBsdXMoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgIC" +
        "AgICAgICAgICAgZ2V0RGlzYWJsZUZsYXNoQWRzKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAg" +
        "ICAgZ2V0TG9jYWxlKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICJlbi1DQSI7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0TnVtUmVkaX" +
        "JlY3RzKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0UGxheWVyVHlwZSgpIHsNCiAgICAg" +
        "ICAgICAgICAgICAgICAgICAgIHJldHVybiAiVW5rbm93biI7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0UGxheWVyVmVyc2lvbigpIHsNCiAgICAgICAgIC" +
        "AgICAgICAgICAgICAgIHJldHVybiAiMS4wLjAiOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIGdldFBwaWQoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICBy" +
        "ZXR1cm4gIjJHakNnb0VDQVAwSWJVIjsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAvL0hvcGVmdWxseSB0aGlzIHdpbGwgbm90IGJsb3cgdXANCiAgICAgICAgIC" +
        "AgICAgICAgICAgc2V0QXV0b1BsYXlBZEJyZWFrcygpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXRDb21wYW5pb25CYWNrZmlsbCgpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXREaXNh" +
        "YmxlQ3VzdG9tUGxheWJhY2tGb3JJT1MxMFBsdXMoKSB7IH0NCiAgICAgICAgICAgICAgICAgICAgc2V0RGlzYWJsZUZsYXNoQWRzKCkgeyB9DQogICAgICAgICAgICAgICAgICAgIHNldExvY2FsZS" +
        "gpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXROdW1SZWRpcmVjdHMoKSB7IH0NCiAgICAgICAgICAgICAgICAgICAgc2V0UGxheWVyVHlwZSgpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBz" +
        "ZXRQbGF5ZXJWZXJzaW9uKCkgeyB9DQogICAgICAgICAgICAgICAgICAgIHNldFBwaWQoKSB7IH0NCiAgICAgICAgICAgICAgICAgICAgc2V0VnBhaWRBbGxvd2VkKCkgeyB9DQogICAgICAgICAgIC" +
        "AgICAgICAgIHNldFZwYWlkTW9kZSgpIHsgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgVWlFbGVtZW50czogew0KICAgICAgICAgICAgICAgICAgICBDT1VOVERPV046ICJj" +
        "b3VudGRvd24iLA0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgVmlld01vZGU6IHsNCiAgICAgICAgICAgICAgICAgICAgRlVMTFNDUkVFTjogImZ1bGxzY3JlZW4iLA0KICAgIC" +
        "AgICAgICAgICAgICAgICBOT1JNQUw6ICJub3JtYWwiLA0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgVkVSU0lPTjogIjMuMTczLjQiLA0KICAgICAgICAgICAgfSwNCiAgICAg" +
        "ICAgfTsNCiAgICAgICAgLy9OZXN0ZWQgQVBJDQogICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuRXJyb3JDb2RlID0gew0KICAgICAgICAgICAgVklERU9fUExBWV9FUlJPUjogNDAwLA" +
        "0KICAgICAgICAgICAgRkFJTEVEX1RPX1JFUVVFU1RfQURTOiAxMDA1LA0KICAgICAgICAgICAgUkVRVUlSRURfTElTVEVORVJTX05PVF9BRERFRDogOTAwLA0KICAgICAgICAgICAgVkFTVF9MT0FE" +
        "X1RJTUVPVVQ6IDMwMSwNCiAgICAgICAgICAgIFZBU1RfTk9fQURTX0FGVEVSX1dSQVBQRVI6IDMwMywNCiAgICAgICAgICAgIFZBU1RfTUVESUFfTE9BRF9USU1FT1VUOiA0MDIsDQogICAgICAgIC" +
        "AgICBWQVNUX1RPT19NQU5ZX1JFRElSRUNUUzogMzAyLA0KICAgICAgICAgICAgVkFTVF9BU1NFVF9NSVNNQVRDSDogNDAzLA0KICAgICAgICAgICAgVkFTVF9MSU5FQVJfQVNTRVRfTUlTTUFUQ0g6" +
        "IDQwMywNCiAgICAgICAgICAgIFZBU1RfTk9OTElORUFSX0FTU0VUX01JU01BVENIOiA1MDMsDQogICAgICAgICAgICBWQVNUX0FTU0VUX05PVF9GT1VORDogMTAwNywNCiAgICAgICAgICAgIFZBU1" +
        "RfVU5TVVBQT1JURURfVkVSU0lPTjogMTAyLA0KICAgICAgICAgICAgVkFTVF9TQ0hFTUFfVkFMSURBVElPTl9FUlJPUjogMTAxLA0KICAgICAgICAgICAgVkFTVF9UUkFGRklDS0lOR19FUlJPUjog" +
        "MjAwLA0KICAgICAgICAgICAgVkFTVF9VTkVYUEVDVEVEX0xJTkVBUklUWTogMjAxLA0KICAgICAgICAgICAgVkFTVF9VTkVYUEVDVEVEX0RVUkFUSU9OX0VSUk9SOiAyMDIsDQogICAgICAgICAgIC" +
        "BWQVNUX1dSQVBQRVJfRVJST1I6IDMwMCwNCiAgICAgICAgICAgIE5PTkxJTkVBUl9ESU1FTlNJT05TX0VSUk9SOiA1MDEsDQogICAgICAgICAgICBDT01QQU5JT05fUkVRVUlSRURfRVJST1I6IDYw" +
        "MiwNCiAgICAgICAgICAgIFZBU1RfRU1QVFlfUkVTUE9OU0U6IDEwMDksDQogICAgICAgICAgICBVTlNVUFBPUlRFRF9MT0NBTEU6IDEwMTEsDQogICAgICAgICAgICBJTlZBTElEX0FEWF9FWFRFTl" +
        "NJT046IDExMDUsDQogICAgICAgICAgICBJTlZBTElEX0FSR1VNRU5UUzogMTEwMSwNCiAgICAgICAgICAgIFVOS05PV05fQURfUkVTUE9OU0U6IDEwMTAsDQogICAgICAgICAgICBVTktOT1dOX0VS" +
        "Uk9SOiA5MDAsDQogICAgICAgICAgICBPVkVSTEFZX0FEX1BMQVlJTkdfRkFJTEVEOiA1MDAsDQogICAgICAgICAgICBWSURFT19FTEVNRU5UX1VTRUQ6IC0xLA0KICAgICAgICAgICAgVklERU9fRU" +
        "xFTUVOVF9SRVFVSVJFRDogLTEsDQogICAgICAgICAgICBWQVNUX01FRElBX0VSUk9SOiAtMSwNCiAgICAgICAgICAgIEFEU0xPVF9OT1RfVklTSUJMRTogLTEsDQogICAgICAgICAgICBPVkVSTEFZ" +
        "X0FEX0xPQURJTkdfRkFJTEVEOiAtMSwNCiAgICAgICAgICAgIFZBU1RfTUFMRk9STUVEX1JFU1BPTlNFOiAtMSwNCiAgICAgICAgICAgIENPTVBBTklPTl9BRF9MT0FESU5HX0ZBSUxFRDogLTEsDQ" +
        "ogICAgICAgIH07DQogICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZSA9IHsNCiAgICAgICAgICAgIEFEX0xPQUQ6ICJhZExvYWRFcnJvciIsDQogICAgICAgICAgICBBRF9QTEFZ" +
        "OiAiYWRQbGF5RXJyb3IiLA0KICAgICAgICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZSA9IHsNCiAgICAgICAgICAgIEFEX0VSUk9SOiAiYWRFcnJvciIsDQ" +
        "ogICAgICAgIH07DQogICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkRXZlbnQuVHlwZSA9IHsNCiAgICAgICAgICAgIENPTlRFTlRfUkVTVU1FX1JFUVVFU1RFRDogImNvbnRlbnRSZXN1bWVSZXF1" +
        "ZXN0ZWQiLA0KICAgICAgICAgICAgQ09OVEVOVF9QQVVTRV9SRVFVRVNURUQ6ICJjb250ZW50UGF1c2VSZXF1ZXN0ZWQiLA0KICAgICAgICAgICAgQ0xJQ0s6ICJjbGljayIsDQogICAgICAgICAgIC" +
        "BEVVJBVElPTl9DSEFOR0U6ICJkdXJhdGlvbkNoYW5nZSIsDQogICAgICAgICAgICBFWFBBTkRFRF9DSEFOR0VEOiAiZXhwYW5kZWRDaGFuZ2VkIiwNCiAgICAgICAgICAgIFNUQVJURUQ6ICJzdGFy" +
        "dCIsDQogICAgICAgICAgICBJTVBSRVNTSU9OOiAiaW1wcmVzc2lvbiIsDQogICAgICAgICAgICBQQVVTRUQ6ICJwYXVzZSIsDQogICAgICAgICAgICBSRVNVTUVEOiAicmVzdW1lIiwNCiAgICAgIC" +
        "AgICAgIEZJUlNUX1FVQVJUSUxFOiAiZmlyc3RxdWFydGlsZSIsDQogICAgICAgICAgICBNSURQT0lOVDogIm1pZHBvaW50IiwNCiAgICAgICAgICAgIFRISVJEX1FVQVJUSUxFOiAidGhpcmRxdWFy" +
        "dGlsZSIsDQogICAgICAgICAgICBDT01QTEVURTogImNvbXBsZXRlIiwNCiAgICAgICAgICAgIFVTRVJfQ0xPU0U6ICJ1c2VyQ2xvc2UiLA0KICAgICAgICAgICAgTElORUFSX0NIQU5HRUQ6ICJsaW" +
        "5lYXJDaGFuZ2VkIiwNCiAgICAgICAgICAgIExPQURFRDogImxvYWRlZCIsDQogICAgICAgICAgICBBRF9DQU5fUExBWTogImFkQ2FuUGxheSIsDQogICAgICAgICAgICBBRF9NRVRBREFUQTogImFk" +
        "TWV0YWRhdGEiLA0KICAgICAgICAgICAgQURfQlJFQUtfUkVBRFk6ICJhZEJyZWFrUmVhZHkiLA0KICAgICAgICAgICAgSU5URVJBQ1RJT046ICJpbnRlcmFjdGlvbiIsDQogICAgICAgICAgICBBTE" +
        "xfQURTX0NPTVBMRVRFRDogImFsbEFkc0NvbXBsZXRlZCIsDQogICAgICAgICAgICBTS0lQUEVEOiAic2tpcCIsDQogICAgICAgICAgICBTS0lQUEFCTEVfU1RBVEVfQ0hBTkdFRDogInNraXBwYWJs" +
        "ZVN0YXRlQ2hhbmdlZCIsDQogICAgICAgICAgICBMT0c6ICJsb2ciLA0KICAgICAgICAgICAgVklFV0FCTEVfSU1QUkVTU0lPTjogInZpZXdhYmxlX2ltcHJlc3Npb24iLA0KICAgICAgICAgICAgVk" +
        "9MVU1FX0NIQU5HRUQ6ICJ2b2x1bWVDaGFuZ2UiLA0KICAgICAgICAgICAgVk9MVU1FX01VVEVEOiAibXV0ZSIsDQogICAgICAgIH07DQogICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkc01hbmFn" +
        "ZXJMb2FkZWRFdmVudC5UeXBlID0gew0KICAgICAgICAgICAgQURTX01BTkFHRVJfTE9BREVEOiAiYWRzTWFuYWdlckxvYWRlZCIsDQogICAgICAgIH07DQogICAgICAgIHdpbmRvdy5nb29nbGUuaW" +
        "1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuQ3JlYXRpdmVUeXBlID0gew0KICAgICAgICAgICAgQUxMOiAiQWxsIiwNCiAgICAgICAgICAgIEZMQVNIOiAiRmxhc2giLA0KICAgICAgICAg" +
        "ICAgSU1BR0U6ICJJbWFnZSIsDQogICAgICAgIH07DQogICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuUmVzb3VyY2VUeXBlID0gew0KICAgICAgIC" +
        "AgICAgQUxMOiAiQWxsIiwNCiAgICAgICAgICAgIEhUTUw6ICJIdG1sIiwNCiAgICAgICAgICAgIElGUkFNRTogIklGcmFtZSIsDQogICAgICAgICAgICBTVEFUSUM6ICJTdGF0aWMiLA0KICAgICAg" +
        "ICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLlNpemVDcml0ZXJpYSA9IHsNCiAgICAgICAgICAgIElHTk9SRTogIklnbm9yZVNpemUiLA" +
        "0KICAgICAgICAgICAgU0VMRUNUX0VYQUNUX01BVENIOiAiU2VsZWN0RXhhY3RNYXRjaCIsDQogICAgICAgICAgICBTRUxFQ1RfTkVBUl9NQVRDSDogIlNlbGVjdE5lYXJNYXRjaCIsDQogICAgICAg" +
        "IH07DQogICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLkNvbXBhbmlvbkJhY2tmaWxsTW9kZSA9IHsNCiAgICAgICAgICAgIEFMV0FZUzogImFsd2F5cyIsDQogICAgICAgIC" +
        "AgICBPTl9NQVNURVJfQUQ6ICJvbl9tYXN0ZXJfYWQiLA0KICAgICAgICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5WcGFpZE1vZGUgPSB7DQogICAgICAgICAg" +
        "ICBESVNBQkxFRDogMCwNCiAgICAgICAgICAgIEVOQUJMRUQ6IDEsDQogICAgICAgICAgICBJTlNFQ1VSRTogMiwNCiAgICAgICAgfTsNCiAgICAgICAgLy9PdGhlcg0KICAgICAgICB3aW5kb3cuZ2" +
        "9vZ2xlLmltYS5zZXR0aW5ncyA9IG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncygpOw0KICAgIH0pKCk7",
    );
    //---MoatFreeWheelJSPEM.js---
    //Payload generator
    /*
    a.printPayload(a.mkPayload(() => {
        "use strict";
        window.console.error("Uncaught Error: FreeWheel SDK is not allowed on this device!");
        window.MoatFreeWheelJSPEM = class {
            init() { }
            dispose() { }
        };
    }));
    */
    a.staticServer(
        [
            "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
            "https://*.moatads.com/*/MoatFreeWheelJSPEM.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IEZyZWVXaGVlbCBTRE" +
        "sgaXMgbm90IGFsbG93ZWQgb24gdGhpcyBkZXZpY2UhIik7DQogICAgICAgIHdpbmRvdy5Nb2F0RnJlZVdoZWVsSlNQRU0gPSBjbGFzcyB7DQogICAgICAgICAgICBpbml0KCkgeyB9DQogICAgICAg" +
        "ICAgICBkaXNwb3NlKCkgeyB9DQogICAgICAgIH07DQogICAgfSkoKTs=",
    );
};
