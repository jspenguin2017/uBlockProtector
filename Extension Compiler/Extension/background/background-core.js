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
    do {
        output += `"${payload.substring(0, 150)}" +\n`;
        payload = payload.substring(150);
    } while (payload.length);
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
    //https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
    /*
    a.printPayload(a.mkPayload(() => {
        "use strict";
        window.console.error("Uncaught Error: IMA SDK is not allowed on this device!");
        const EventDispatcher = class {
            constructor() {
                this.onError = [];
                this._error = new window.google.ima.AdErrorEvent(
                    new window.google.ima.AdError(
                        "No ads available",
                        window.google.ima.AdError.ErrorCode.VAST_NO_ADS_AFTER_WRAPPER,
                        window.google.ima.AdError.Type.AD_LOAD,
                    ),
                    {},
                );
            }
            addEventListener(event, handler) {
                //I think I can get away with returning error for all ads requests
                //The whitelisted SDK would also always error out
                if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                    this.onError.push(handler);
                } else {
                    window.console.warn(`IMA event ${event} is ignored by uBlock Protector.`);
                }
            }
            _dispatchError() {
                for (let i = 0; i < this.onError.length; i++) {
                    this.onError[i](this._error);
                }
            }
        };
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
                AdsLoader: class extends EventDispatcher {
                    constructor() {
                        super();
                    }
                    contentComplete() {
                        window.setTimeout(this._dispatchError(), 10);
                    }
                    destroy() { }
                    getSettings() {
                        return window.google.ima.ImaSdkSettings;
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
    }));
    */
    a.staticServer(
        [
            "https://imasdk.googleapis.com/js/sdkloader/ima3.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IElNQSBTREsgaXMgbm" +
        "90IGFsbG93ZWQgb24gdGhpcyBkZXZpY2UhIik7DQogICAgICAgIGNvbnN0IEV2ZW50RGlzcGF0Y2hlciA9IGNsYXNzIHsNCiAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICAgICAg" +
        "ICAgIHRoaXMub25FcnJvciA9IFtdOw0KICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gbmV3IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudCgNCiAgICAgICAgICAgICAgICAgICAgbm" +
        "V3IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IoDQogICAgICAgICAgICAgICAgICAgICAgICAiTm8gYWRzIGF2YWlsYWJsZSIsDQogICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZ29vZ2xl" +
        "LmltYS5BZEVycm9yLkVycm9yQ29kZS5WQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSLA0KICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5UeXBlLkFEX0xPQU" +
        "QsDQogICAgICAgICAgICAgICAgICAgICksDQogICAgICAgICAgICAgICAgICAgIHt9LA0KICAgICAgICAgICAgICAgICk7DQogICAgICAgICAgICB9DQogICAgICAgICAgICBhZGRFdmVudExpc3Rl" +
        "bmVyKGV2ZW50LCBoYW5kbGVyKSB7DQogICAgICAgICAgICAgICAgLy9JIHRoaW5rIEkgY2FuIGdldCBhd2F5IHdpdGggcmV0dXJuaW5nIGVycm9yIGZvciBhbGwgYWRzIHJlcXVlc3RzDQogICAgIC" +
        "AgICAgICAgICAgLy9UaGUgd2hpdGVsaXN0ZWQgU0RLIHdvdWxkIGFsc28gYWx3YXlzIGVycm9yIG91dA0KICAgICAgICAgICAgICAgIGlmIChldmVudCA9PT0gd2luZG93Lmdvb2dsZS5pbWEuQWRF" +
        "cnJvckV2ZW50LlR5cGUuQURfRVJST1IpIHsNCiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yLnB1c2goaGFuZGxlcik7DQogICAgICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgIC" +
        "AgICAgICAgICAgd2luZG93LmNvbnNvbGUud2FybihgSU1BIGV2ZW50ICR7ZXZlbnR9IGlzIGlnbm9yZWQgYnkgdUJsb2NrIFByb3RlY3Rvci5gKTsNCiAgICAgICAgICAgICAgICB9DQogICAgICAg" +
        "ICAgICB9DQogICAgICAgICAgICBfZGlzcGF0Y2hFcnJvcigpIHsNCiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub25FcnJvci5sZW5ndGg7IGkrKykgew0KICAgICAgIC" +
        "AgICAgICAgICAgICB0aGlzLm9uRXJyb3JbaV0odGhpcy5fZXJyb3IpOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgIH0NCiAgICAgICAgfTsNCiAgICAgICAgLy9JIHRoaW5rIEkgY2Fu" +
        "IGdldCBhd2F5IHdpdGggbm90IGltcGxlbWVudGluZyBpbnRlcmZhY2VzDQogICAgICAgIHdpbmRvdy5nb29nbGUgPSB7DQogICAgICAgICAgICBpbWE6IHsNCiAgICAgICAgICAgICAgICBBZERpc3" +
        "BsYXlDb250YWluZXI6IGNsYXNzIHsNCiAgICAgICAgICAgICAgICAgICAgLy9jb25zdHJ1Y3Rvcihjb250YWluZXIsIHZpZGVvLCBjbGljaykgeyB9DQogICAgICAgICAgICAgICAgICAgIGluaXRp" +
        "YWxpemUoKSB7IH0NCiAgICAgICAgICAgICAgICAgICAgZGVzdHJveSgpIHsgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgQWRFcnJvcjogY2xhc3MgZXh0ZW5kcyBFcnJvci" +
        "B7DQogICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGNvZGUsIHR5cGUpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyKG1lc3NhZ2UpOw0KICAgICAgICAgICAg" +
        "ICAgICAgICAgICAgdGhpcy5jb2RlID0gY29kZTsNCiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgIC" +
        "AgICAgZ2V0RXJyb3JDb2RlKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29kZTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRJ" +
        "bm5lckVycm9yKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0TWVzc2FnZSgpIHsNCi" +
        "AgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2U7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0VHlwZSgpIHsNCiAgICAgICAgICAg" +
        "ICAgICAgICAgICAgIHJldHVybiB0aGlzLnR5cGU7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0VmFzdEVycm9yQ29kZSgpIHsNCiAgICAgICAgICAgICAgIC" +
        "AgICAgICAgIHJldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS5VTktOT1dOX0VSUk9SOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgfSwNCiAg" +
        "ICAgICAgICAgICAgICBBZEVycm9yRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXJyb3JFdmVudCB7DQogICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKGVycm9yLCBjb250ZXh0KSB7DQogICAgIC" +
        "AgICAgICAgICAgICAgICAgICBzdXBlcihlcnJvcik7DQogICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVyck9iaiA9IGVycm9yOw0KICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250" +
        "ZXh0ID0gY29udGV4dDsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRFcnJvcigpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVyck" +
        "9iajsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRVc2VyUmVxdWVzdENvbnRleHQoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5j" +
        "b250ZXh0Ow0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBBZEV2ZW50OiBjbGFzcyBleHRlbmRzIEV2ZW50IHsNCiAgICAgICAgICAgIC" +
        "AgICAgICAgY29uc3RydWN0b3IodHlwZSwgYWQsIGFkRGF0YSkgew0KICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIodHlwZSk7DQogICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkID0g" +
        "YWQ7DQogICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkRGF0YSA9IGFkRGF0YTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRBZCgpIHsNCiAgICAgIC" +
        "AgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIGdldEFkRGF0YSgpIHsNCiAgICAgICAgICAgICAgICAgICAg" +
        "ICAgIHJldHVybiB0aGlzLmFkRGF0YTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAgICAgICAgICAgQWRzTG9hZGVyOiBjbGFzcyBleHRlbmRzIEV2ZW" +
        "50RGlzcGF0Y2hlciB7DQogICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAg" +
        "ICAgICAgICAgICAgICAgICBjb250ZW50Q29tcGxldGUoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLl9kaXNwYXRjaEVycm9yKCksIDEwKTsNCiAgIC" +
        "AgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBkZXN0cm95KCkgeyB9DQogICAgICAgICAgICAgICAgICAgIGdldFNldHRpbmdzKCkgew0KICAgICAgICAgICAgICAgICAgICAg" +
        "ICAgcmV0dXJuIHdpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBZHMoKSB7DQogICAgICAgIC" +
        "AgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLl9kaXNwYXRjaEVycm9yKCksIDEwKTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIH0sDQogICAgICAg" +
        "ICAgICAgICAgQWRzTWFuYWdlckxvYWRlZEV2ZW50OiBjbGFzcyBleHRlbmRzIEV2ZW50IHsNCiAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7DQogICAgICAgICAgICAgICAgICAgIC" +
        "AgICAvL0kgdGhpbmsgSSBjYW4gZ2V0IGF3YXkgd2l0aCBpdCBhcyBsb25nIGFzIEkgZG8gbm90IGRpc3BhdGNoIHRoZSBldmVudA0KICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IHdp" +
        "bmRvdy5FcnJvcigiTmV1dHJhbGl6ZWQgQWRzTWFuYWdlciBpcyBub3QgaW1wbGVtZW50ZWQuIik7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICB9LA0KICAgICAgICAgIC" +
        "AgICAgIEFkc1JlbmRlcmluZ1NldHRpbmdzOiBjbGFzcyB7DQogICAgICAgICAgICAgICAgICAgIC8vSSB0aGluayBJIGNhbiBnZXQgYXdheSB3aXRoIG5vdCBkZWZpbmluZyBhbnl0aGluZw0KICAg" +
        "ICAgICAgICAgICAgICAgICAvL2NvbnN0cnVjdG9yKCkgeyB9DQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBBZHNSZXF1ZXN0OiBjbGFzcyB7DQogICAgICAgICAgICAgICAgIC" +
        "AgIC8vSSB0aGluayBJIGNhbiBnZXQgYXdheSB3aXRoIG5vdCBkZWZpbmluZyBhbnl0aGluZw0KICAgICAgICAgICAgICAgICAgICAvL2NvbnN0cnVjdG9yKCkgeyB9DQogICAgICAgICAgICAgICAg" +
        "ICAgIHNldEFkV2lsbEF1dG9QbGF5KCkgeyB9DQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBDb21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzOiBjbGFzcyB7DQogICAgICAgIC" +
        "AgICAgICAgICAgIC8vSSB0aGluayBJIGNhbiBnZXQgYXdheSB3aXRoIG5vdCBkZWZpbmluZyBhbnl0aGluZw0KICAgICAgICAgICAgICAgICAgICAvL2NvbnN0cnVjdG9yKCkgeyB9DQogICAgICAg" +
        "ICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBJbWFTZGtTZXR0aW5nczogY2xhc3Mgew0KICAgICAgICAgICAgICAgICAgICAvL0kgdGhpbmsgSSBjYW4gZ2V0IGF3YXkgd2l0aCBub3QgZGVmaW" +
        "5pbmcgYW55dGhpbmcNCiAgICAgICAgICAgICAgICAgICAgLy9jb25zdHJ1Y3RvcigpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRDb21wYW5pb25CYWNrZmlsbCgpIHsNCiAgICAgICAgICAg" +
        "ICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5Db21wYW5pb25CYWNrZmlsbE1vZGUuQUxXQVlTOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgIC" +
        "AgICAgICAgICAgICAgIGdldERpc2FibGVDdXN0b21QbGF5YmFja0ZvcklPUzEwUGx1cygpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsNCiAgICAgICAgICAgICAgICAg" +
        "ICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXREaXNhYmxlRmxhc2hBZHMoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KIC" +
        "AgICAgICAgICAgICAgICAgICBnZXRMb2NhbGUoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gImVuLUNBIjsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAg" +
        "ICAgICBnZXROdW1SZWRpcmVjdHMoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRQbGF5ZX" +
        "JUeXBlKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICJVbmtub3duIjsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBnZXRQbGF5ZXJWZXJzaW9u" +
        "KCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICIxLjAuMCI7DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgZ2V0UHBpZCgpIHsNCiAgICAgICAgIC" +
        "AgICAgICAgICAgICAgIHJldHVybiAiMkdqQ2dvRUNBUDBJYlUiOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIC8vSG9wZWZ1bGx5IHRoaXMgd2lsbCBub3QgYmxv" +
        "dyB1cA0KICAgICAgICAgICAgICAgICAgICBzZXRBdXRvUGxheUFkQnJlYWtzKCkgeyB9DQogICAgICAgICAgICAgICAgICAgIHNldENvbXBhbmlvbkJhY2tmaWxsKCkgeyB9DQogICAgICAgICAgIC" +
        "AgICAgICAgIHNldERpc2FibGVDdXN0b21QbGF5YmFja0ZvcklPUzEwUGx1cygpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXREaXNhYmxlRmxhc2hBZHMoKSB7IH0NCiAgICAgICAgICAgICAg" +
        "ICAgICAgc2V0TG9jYWxlKCkgeyB9DQogICAgICAgICAgICAgICAgICAgIHNldE51bVJlZGlyZWN0cygpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXRQbGF5ZXJUeXBlKCkgeyB9DQogICAgIC" +
        "AgICAgICAgICAgICAgIHNldFBsYXllclZlcnNpb24oKSB7IH0NCiAgICAgICAgICAgICAgICAgICAgc2V0UHBpZCgpIHsgfQ0KICAgICAgICAgICAgICAgICAgICBzZXRWcGFpZEFsbG93ZWQoKSB7" +
        "IH0NCiAgICAgICAgICAgICAgICAgICAgc2V0VnBhaWRNb2RlKCkgeyB9DQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBVaUVsZW1lbnRzOiB7DQogICAgICAgICAgICAgICAgIC" +
        "AgIENPVU5URE9XTjogImNvdW50ZG93biIsDQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBWaWV3TW9kZTogew0KICAgICAgICAgICAgICAgICAgICBGVUxMU0NSRUVOOiAiZnVs" +
        "bHNjcmVlbiIsDQogICAgICAgICAgICAgICAgICAgIE5PUk1BTDogIm5vcm1hbCIsDQogICAgICAgICAgICAgICAgfSwNCiAgICAgICAgICAgICAgICBWRVJTSU9OOiAiMy4xNzMuNCIsDQogICAgIC" +
        "AgICAgICB9LA0KICAgICAgICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZSA9IHsNCiAgICAgICAgICAgIFZJREVPX1BMQVlfRVJST1I6IDQwMCwNCiAgICAg" +
        "ICAgICAgIEZBSUxFRF9UT19SRVFVRVNUX0FEUzogMTAwNSwNCiAgICAgICAgICAgIFJFUVVJUkVEX0xJU1RFTkVSU19OT1RfQURERUQ6IDkwMCwNCiAgICAgICAgICAgIFZBU1RfTE9BRF9USU1FT1" +
        "VUOiAzMDEsDQogICAgICAgICAgICBWQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSOiAzMDMsDQogICAgICAgICAgICBWQVNUX01FRElBX0xPQURfVElNRU9VVDogNDAyLA0KICAgICAgICAgICAgVkFT" +
        "VF9UT09fTUFOWV9SRURJUkVDVFM6IDMwMiwNCiAgICAgICAgICAgIFZBU1RfQVNTRVRfTUlTTUFUQ0g6IDQwMywNCiAgICAgICAgICAgIFZBU1RfTElORUFSX0FTU0VUX01JU01BVENIOiA0MDMsDQ" +
        "ogICAgICAgICAgICBWQVNUX05PTkxJTkVBUl9BU1NFVF9NSVNNQVRDSDogNTAzLA0KICAgICAgICAgICAgVkFTVF9BU1NFVF9OT1RfRk9VTkQ6IDEwMDcsDQogICAgICAgICAgICBWQVNUX1VOU1VQ" +
        "UE9SVEVEX1ZFUlNJT046IDEwMiwNCiAgICAgICAgICAgIFZBU1RfU0NIRU1BX1ZBTElEQVRJT05fRVJST1I6IDEwMSwNCiAgICAgICAgICAgIFZBU1RfVFJBRkZJQ0tJTkdfRVJST1I6IDIwMCwNCi" +
        "AgICAgICAgICAgIFZBU1RfVU5FWFBFQ1RFRF9MSU5FQVJJVFk6IDIwMSwNCiAgICAgICAgICAgIFZBU1RfVU5FWFBFQ1RFRF9EVVJBVElPTl9FUlJPUjogMjAyLA0KICAgICAgICAgICAgVkFTVF9X" +
        "UkFQUEVSX0VSUk9SOiAzMDAsDQogICAgICAgICAgICBOT05MSU5FQVJfRElNRU5TSU9OU19FUlJPUjogNTAxLA0KICAgICAgICAgICAgQ09NUEFOSU9OX1JFUVVJUkVEX0VSUk9SOiA2MDIsDQogIC" +
        "AgICAgICAgICBWQVNUX0VNUFRZX1JFU1BPTlNFOiAxMDA5LA0KICAgICAgICAgICAgVU5TVVBQT1JURURfTE9DQUxFOiAxMDExLA0KICAgICAgICAgICAgSU5WQUxJRF9BRFhfRVhURU5TSU9OOiAx" +
        "MTA1LA0KICAgICAgICAgICAgSU5WQUxJRF9BUkdVTUVOVFM6IDExMDEsDQogICAgICAgICAgICBVTktOT1dOX0FEX1JFU1BPTlNFOiAxMDEwLA0KICAgICAgICAgICAgVU5LTk9XTl9FUlJPUjogOT" +
        "AwLA0KICAgICAgICAgICAgT1ZFUkxBWV9BRF9QTEFZSU5HX0ZBSUxFRDogNTAwLA0KICAgICAgICAgICAgVklERU9fRUxFTUVOVF9VU0VEOiAtMSwNCiAgICAgICAgICAgIFZJREVPX0VMRU1FTlRf" +
        "UkVRVUlSRUQ6IC0xLA0KICAgICAgICAgICAgVkFTVF9NRURJQV9FUlJPUjogLTEsDQogICAgICAgICAgICBBRFNMT1RfTk9UX1ZJU0lCTEU6IC0xLA0KICAgICAgICAgICAgT1ZFUkxBWV9BRF9MT0" +
        "FESU5HX0ZBSUxFRDogLTEsDQogICAgICAgICAgICBWQVNUX01BTEZPUk1FRF9SRVNQT05TRTogLTEsDQogICAgICAgICAgICBDT01QQU5JT05fQURfTE9BRElOR19GQUlMRUQ6IC0xLA0KICAgICAg" +
        "ICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLlR5cGUgPSB7DQogICAgICAgICAgICBBRF9MT0FEOiAiYWRMb2FkRXJyb3IiLA0KICAgICAgICAgICAgQURfUExBWTogImFkUG" +
        "xheUVycm9yIiwNCiAgICAgICAgfTsNCiAgICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50LlR5cGUgPSB7DQogICAgICAgICAgICBBRF9FUlJPUjogImFkRXJyb3IiLA0KICAgICAg" +
        "ICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUgPSB7DQogICAgICAgICAgICBDT05URU5UX1JFU1VNRV9SRVFVRVNURUQ6ICJjb250ZW50UmVzdW1lUmVxdWVzdGVkIi" +
        "wNCiAgICAgICAgICAgIENPTlRFTlRfUEFVU0VfUkVRVUVTVEVEOiAiY29udGVudFBhdXNlUmVxdWVzdGVkIiwNCiAgICAgICAgICAgIENMSUNLOiAiY2xpY2siLA0KICAgICAgICAgICAgRFVSQVRJ" +
        "T05fQ0hBTkdFOiAiZHVyYXRpb25DaGFuZ2UiLA0KICAgICAgICAgICAgRVhQQU5ERURfQ0hBTkdFRDogImV4cGFuZGVkQ2hhbmdlZCIsDQogICAgICAgICAgICBTVEFSVEVEOiAic3RhcnQiLA0KIC" +
        "AgICAgICAgICAgSU1QUkVTU0lPTjogImltcHJlc3Npb24iLA0KICAgICAgICAgICAgUEFVU0VEOiAicGF1c2UiLA0KICAgICAgICAgICAgUkVTVU1FRDogInJlc3VtZSIsDQogICAgICAgICAgICBG" +
        "SVJTVF9RVUFSVElMRTogImZpcnN0cXVhcnRpbGUiLA0KICAgICAgICAgICAgTUlEUE9JTlQ6ICJtaWRwb2ludCIsDQogICAgICAgICAgICBUSElSRF9RVUFSVElMRTogInRoaXJkcXVhcnRpbGUiLA" +
        "0KICAgICAgICAgICAgQ09NUExFVEU6ICJjb21wbGV0ZSIsDQogICAgICAgICAgICBVU0VSX0NMT1NFOiAidXNlckNsb3NlIiwNCiAgICAgICAgICAgIExJTkVBUl9DSEFOR0VEOiAibGluZWFyQ2hh" +
        "bmdlZCIsDQogICAgICAgICAgICBMT0FERUQ6ICJsb2FkZWQiLA0KICAgICAgICAgICAgQURfQ0FOX1BMQVk6ICJhZENhblBsYXkiLA0KICAgICAgICAgICAgQURfTUVUQURBVEE6ICJhZE1ldGFkYX" +
        "RhIiwNCiAgICAgICAgICAgIEFEX0JSRUFLX1JFQURZOiAiYWRCcmVha1JlYWR5IiwNCiAgICAgICAgICAgIElOVEVSQUNUSU9OOiAiaW50ZXJhY3Rpb24iLA0KICAgICAgICAgICAgQUxMX0FEU19D" +
        "T01QTEVURUQ6ICJhbGxBZHNDb21wbGV0ZWQiLA0KICAgICAgICAgICAgU0tJUFBFRDogInNraXAiLA0KICAgICAgICAgICAgU0tJUFBBQkxFX1NUQVRFX0NIQU5HRUQ6ICJza2lwcGFibGVTdGF0ZU" +
        "NoYW5nZWQiLA0KICAgICAgICAgICAgTE9HOiAibG9nIiwNCiAgICAgICAgICAgIFZJRVdBQkxFX0lNUFJFU1NJT046ICJ2aWV3YWJsZV9pbXByZXNzaW9uIiwNCiAgICAgICAgICAgIFZPTFVNRV9D" +
        "SEFOR0VEOiAidm9sdW1lQ2hhbmdlIiwNCiAgICAgICAgICAgIFZPTFVNRV9NVVRFRDogIm11dGUiLA0KICAgICAgICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZHNNYW5hZ2VyTG9hZG" +
        "VkRXZlbnQuVHlwZSA9IHsNCiAgICAgICAgICAgIEFEU19NQU5BR0VSX0xPQURFRDogImFkc01hbmFnZXJMb2FkZWQiLA0KICAgICAgICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5Db21w" +
        "YW5pb25BZFNlbGVjdGlvblNldHRpbmdzLkNyZWF0aXZlVHlwZSA9IHsNCiAgICAgICAgICAgIEFMTDogIkFsbCIsDQogICAgICAgICAgICBGTEFTSDogIkZsYXNoIiwNCiAgICAgICAgICAgIElNQU" +
        "dFOiAiSW1hZ2UiLA0KICAgICAgICB9Ow0KICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLlJlc291cmNlVHlwZSA9IHsNCiAgICAgICAgICAgIEFM" +
        "TDogIkFsbCIsDQogICAgICAgICAgICBIVE1MOiAiSHRtbCIsDQogICAgICAgICAgICBJRlJBTUU6ICJJRnJhbWUiLA0KICAgICAgICAgICAgU1RBVElDOiAiU3RhdGljIiwNCiAgICAgICAgfTsNCi" +
        "AgICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5TaXplQ3JpdGVyaWEgPSB7DQogICAgICAgICAgICBJR05PUkU6ICJJZ25vcmVTaXplIiwNCiAgICAg" +
        "ICAgICAgIFNFTEVDVF9FWEFDVF9NQVRDSDogIlNlbGVjdEV4YWN0TWF0Y2giLA0KICAgICAgICAgICAgU0VMRUNUX05FQVJfTUFUQ0g6ICJTZWxlY3ROZWFyTWF0Y2giLA0KICAgICAgICB9Ow0KIC" +
        "AgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5Db21wYW5pb25CYWNrZmlsbE1vZGUgPSB7DQogICAgICAgICAgICBBTFdBWVM6ICJhbHdheXMiLA0KICAgICAgICAgICAgT05f" +
        "TUFTVEVSX0FEOiAib25fbWFzdGVyX2FkIiwNCiAgICAgICAgfTsNCiAgICAgICAgd2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuVnBhaWRNb2RlID0gew0KICAgICAgICAgICAgRElTQU" +
        "JMRUQ6IDAsDQogICAgICAgICAgICBFTkFCTEVEOiAxLA0KICAgICAgICAgICAgSU5TRUNVUkU6IDIsDQogICAgICAgIH07DQogICAgfSkoKTs=",
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
