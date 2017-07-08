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
 * Apply generic rules.
 * @function
 */
a.generic = () => {
    //---jQuery plugin---
    //Payload generator
    /*
    a.mkPayload(() => {
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
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IGpRdWVyeSB1QmxvY2" +
        "sgT3JpZ2luIGRldGVjdG9yIHBsdWdpbiBpcyBub3QgYWxsb3dlZCBvbiB0aGlzIGRldmljZSEiKTsNCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIHdpbmRvdy4kLmFkYmxvY2sgPSBmYWxzZTsN" +
        "CiAgICAgICAgfSBjYXRjaCAoZXJyKSB7IH0NCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIHdpbmRvdy5qUXVlcnkuYWRibG9jayA9IGZhbHNlOw0KICAgICAgICB9IGNhdGNoIChlcnIpIHsgfQ" +
        "0KICAgIH0pKCk7",
    );
    //---Interactive Media Ads Software Development Kit---
    //Payload generator

    //https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
    a.mkPayload(() => {
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
                    removeEventListener(event, handler) { //capture and scope are not checked
                        if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                            for (let i = 0; i < this.onError.length; i++) {
                                //This should be good enough
                                if (this.onError[i] === handler) {
                                    this.onError.splice(i, 1);
                                    this.onErrorScope.splice(i, 1);
                                }
                            }
                        } //Ignore otherwise
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
    });

    a.staticServer(
        [
            "https://imasdk.googleapis.com/js/sdkloader/ima3.js*",
            "http://imasdk.googleapis.com/js/sdkloader/ima3.js*",
        ],
        [
            "script",
        ],
        "data:text/javascript;base64,KCgpID0+IHsidXNlIHN0cmljdCI7d2luZG93LmNvbnNvbGUuZXJyb3IoIlVuY2F1Z2h0IEVycm9yOiBJTUEgU0RLIGlzIG5vdCBhbGxvd2VkIG9uIHRoaXMgZG" +
        "V2aWNlISIpOy8vSSB0aGluayBJIGNhbiBnZXQgYXdheSB3aXRoIG5vdCBpbXBsZW1lbnRpbmcgaW50ZXJmYWNlc3dpbmRvdy5nb29nbGUgPSB7aW1hOiB7QWREaXNwbGF5Q29udGFpbmVyOiBjbGFz" +
        "cyB7Ly9jb25zdHJ1Y3Rvcihjb250YWluZXIsIHZpZGVvLCBjbGljaykgeyB9aW5pdGlhbGl6ZSgpIHsgfWRlc3Ryb3koKSB7IH19LEFkRXJyb3I6IGNsYXNzIGV4dGVuZHMgRXJyb3Ige2NvbnN0cn" +
        "VjdG9yKG1lc3NhZ2UsIGNvZGUsIHR5cGUpIHtzdXBlcihtZXNzYWdlKTt0aGlzLmNvZGUgPSBjb2RlO3RoaXMudHlwZSA9IHR5cGU7fWdldEVycm9yQ29kZSgpIHtyZXR1cm4gdGhpcy5jb2RlO31n" +
        "ZXRJbm5lckVycm9yKCkge3JldHVybiBudWxsO31nZXRNZXNzYWdlKCkge3JldHVybiB0aGlzLm1lc3NhZ2U7fWdldFR5cGUoKSB7cmV0dXJuIHRoaXMudHlwZTt9Z2V0VmFzdEVycm9yQ29kZSgpIH" +
        "tyZXR1cm4gd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5FcnJvckNvZGUuVU5LTk9XTl9FUlJPUjt9fSxBZEVycm9yRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXJyb3JFdmVudCB7Y29uc3RydWN0b3Io" +
        "ZXJyb3IsIGNvbnRleHQpIHtzdXBlcihlcnJvcik7dGhpcy5lcnJPYmogPSBlcnJvcjt0aGlzLmNvbnRleHQgPSBjb250ZXh0O31nZXRFcnJvcigpIHtyZXR1cm4gdGhpcy5lcnJPYmo7fWdldFVzZX" +
        "JSZXF1ZXN0Q29udGV4dCgpIHtyZXR1cm4gdGhpcy5jb250ZXh0O319LEFkRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXZlbnQge2NvbnN0cnVjdG9yKHR5cGUsIGFkLCBhZERhdGEpIHtzdXBlcih0eXBl" +
        "KTt0aGlzLmFkID0gYWQ7dGhpcy5hZERhdGEgPSBhZERhdGE7fWdldEFkKCkge3JldHVybiB0aGlzLmFkO31nZXRBZERhdGEoKSB7cmV0dXJuIHRoaXMuYWREYXRhO319LEFkc0xvYWRlcjogY2xhc3" +
        "Mgey8vRXZlbnQgbG9naWNjb25zdHJ1Y3RvcigpIHsvL0Vycm9yIGV2ZW50IGNhbGxiYWNrc3RoaXMub25FcnJvciA9IFtdO3RoaXMub25FcnJvclNjb3BlID0gW107Ly9UaGUgZXJyb3IgZXZlbnQg" +
        "b2JqZWN0dGhpcy5fZXJyb3IgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50KG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yKCJObyBhZHMgYXZhaWxhYmxlIix3aW5kb3cuZ2" +
        "9vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS5WQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSLHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZS5BRF9MT0FELCkse30sKTt9YWRkRXZlbnRMaXN0" +
        "ZW5lcihldmVudCwgaGFuZGxlciwgY2FwdHVyZSwgc2NvcGUpIHsvL0kgdGhpbmsgSSBjYW4gZ2V0IGF3YXkgd2l0aCByZXR1cm5pbmcgZXJyb3IgZm9yIGFsbCBhZHMgcmVxdWVzdHMvL1RoZSB3aG" +
        "l0ZWxpc3RlZCBTREsgd291bGQgYWxzbyBhbHdheXMgZXJyb3Igb3V0aWYgKGV2ZW50ID09PSB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZS5BRF9FUlJPUikge3RoaXMub25FcnJv" +
        "ci5wdXNoKGhhbmRsZXIpO3RoaXMub25FcnJvclNjb3BlLnB1c2goc2NvcGUpO30gZWxzZSB7d2luZG93LmNvbnNvbGUud2FybihgSU1BIGV2ZW50ICR7ZXZlbnR9IGlzIGlnbm9yZWQgYnkgdUJsb2" +
        "NrIFByb3RlY3Rvci5gKTt9fXJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpIHsgLy9jYXB0dXJlIGFuZCBzY29wZSBhcmUgbm90IGNoZWNrZWRpZiAoZXZlbnQgPT09IHdpbmRvdy5n" +
        "b29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9uRXJyb3IubGVuZ3RoOyBpKyspIHsvL1RoaXMgc2hvdWxkIGJlIGdvb2QgZW5vdW" +
        "doaWYgKHRoaXMub25FcnJvcltpXSA9PT0gaGFuZGxlcikge3RoaXMub25FcnJvci5zcGxpY2UoaSwgMSk7dGhpcy5vbkVycm9yU2NvcGUuc3BsaWNlKGksIDEpO319fSAvL0lnbm9yZSBvdGhlcndp" +
        "c2V9X2Rpc3BhdGNoRXJyb3IoKSB7Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9uRXJyb3IubGVuZ3RoOyBpKyspIHt0aGlzLm9uRXJyb3JbaV0uY2FsbCh0aGlzLm9uRXJyb3JTY29wZVtpXSB8fC" +
        "B3aW5kb3csIHRoaXMuX2Vycm9yKTt9fS8vT3RoZXIgbG9naWNjb250ZW50Q29tcGxldGUoKSB7d2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvcigpLCAxMCk7fWRlc3Ryb3koKSB7" +
        "IH1nZXRTZXR0aW5ncygpIHtyZXR1cm4gd2luZG93Lmdvb2dsZS5pbWEuc2V0dGluZ3M7fXJlcXVlc3RBZHMoKSB7d2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvcigpLCAxMCk7fX" +
        "0sQWRzTWFuYWdlckxvYWRlZEV2ZW50OiBjbGFzcyBleHRlbmRzIEV2ZW50IHtjb25zdHJ1Y3RvcigpIHsvL0kgdGhpbmsgSSBjYW4gZ2V0IGF3YXkgd2l0aCBpdCBhcyBsb25nIGFzIEkgZG8gbm90" +
        "IGRpc3BhdGNoIHRoZSBldmVudHRocm93IG5ldyB3aW5kb3cuRXJyb3IoIk5ldXRyYWxpemVkIEFkc01hbmFnZXIgaXMgbm90IGltcGxlbWVudGVkLiIpO319LEFkc1JlbmRlcmluZ1NldHRpbmdzOi" +
        "BjbGFzcyB7Ly9JIHRoaW5rIEkgY2FuIGdldCBhd2F5IHdpdGggbm90IGRlZmluaW5nIGFueXRoaW5nLy9jb25zdHJ1Y3RvcigpIHsgfX0sQWRzUmVxdWVzdDogY2xhc3Mgey8vSSB0aGluayBJIGNh" +
        "biBnZXQgYXdheSB3aXRoIG5vdCBkZWZpbmluZyBhbnl0aGluZy8vY29uc3RydWN0b3IoKSB7IH1zZXRBZFdpbGxBdXRvUGxheSgpIHsgfX0sQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5nczogY2" +
        "xhc3Mgey8vSSB0aGluayBJIGNhbiBnZXQgYXdheSB3aXRoIG5vdCBkZWZpbmluZyBhbnl0aGluZy8vY29uc3RydWN0b3IoKSB7IH19LEltYVNka1NldHRpbmdzOiBjbGFzcyB7Ly9JIHRoaW5rIEkg" +
        "Y2FuIGdldCBhd2F5IHdpdGggbm90IGRlZmluaW5nIGFueXRoaW5nLy9jb25zdHJ1Y3RvcigpIHsgfWdldENvbXBhbmlvbkJhY2tmaWxsKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZG" +
        "tTZXR0aW5ncy5Db21wYW5pb25CYWNrZmlsbE1vZGUuQUxXQVlTO31nZXREaXNhYmxlQ3VzdG9tUGxheWJhY2tGb3JJT1MxMFBsdXMoKSB7cmV0dXJuIGZhbHNlO31nZXREaXNhYmxlRmxhc2hBZHMo" +
        "KSB7cmV0dXJuIHRydWU7fWdldExvY2FsZSgpIHtyZXR1cm4gImVuLUNBIjt9Z2V0TnVtUmVkaXJlY3RzKCkge3JldHVybiAxO31nZXRQbGF5ZXJUeXBlKCkge3JldHVybiAiVW5rbm93biI7fWdldF" +
        "BsYXllclZlcnNpb24oKSB7cmV0dXJuICIxLjAuMCI7fWdldFBwaWQoKSB7cmV0dXJuICIyR2pDZ29FQ0FQMEliVSI7fS8vSG9wZWZ1bGx5IHRoaXMgd2lsbCBub3QgYmxvdyB1cHNldEF1dG9QbGF5" +
        "QWRCcmVha3MoKSB7IH1zZXRDb21wYW5pb25CYWNrZmlsbCgpIHsgfXNldERpc2FibGVDdXN0b21QbGF5YmFja0ZvcklPUzEwUGx1cygpIHsgfXNldERpc2FibGVGbGFzaEFkcygpIHsgfXNldExvY2" +
        "FsZSgpIHsgfXNldE51bVJlZGlyZWN0cygpIHsgfXNldFBsYXllclR5cGUoKSB7IH1zZXRQbGF5ZXJWZXJzaW9uKCkgeyB9c2V0UHBpZCgpIHsgfXNldFZwYWlkQWxsb3dlZCgpIHsgfXNldFZwYWlk" +
        "TW9kZSgpIHsgfX0sVWlFbGVtZW50czoge0NPVU5URE9XTjogImNvdW50ZG93biIsfSxWaWV3TW9kZToge0ZVTExTQ1JFRU46ICJmdWxsc2NyZWVuIixOT1JNQUw6ICJub3JtYWwiLH0sVkVSU0lPTj" +
        "ogIjMuMTczLjQiLH0sfTsvL05lc3RlZCBwcm9wZXJ0aWVzd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5FcnJvckNvZGUgPSB7VklERU9fUExBWV9FUlJPUjogNDAwLEZBSUxFRF9UT19SRVFVRVNU" +
        "X0FEUzogMTAwNSxSRVFVSVJFRF9MSVNURU5FUlNfTk9UX0FEREVEOiA5MDAsVkFTVF9MT0FEX1RJTUVPVVQ6IDMwMSxWQVNUX05PX0FEU19BRlRFUl9XUkFQUEVSOiAzMDMsVkFTVF9NRURJQV9MT0" +
        "FEX1RJTUVPVVQ6IDQwMixWQVNUX1RPT19NQU5ZX1JFRElSRUNUUzogMzAyLFZBU1RfQVNTRVRfTUlTTUFUQ0g6IDQwMyxWQVNUX0xJTkVBUl9BU1NFVF9NSVNNQVRDSDogNDAzLFZBU1RfTk9OTElO" +
        "RUFSX0FTU0VUX01JU01BVENIOiA1MDMsVkFTVF9BU1NFVF9OT1RfRk9VTkQ6IDEwMDcsVkFTVF9VTlNVUFBPUlRFRF9WRVJTSU9OOiAxMDIsVkFTVF9TQ0hFTUFfVkFMSURBVElPTl9FUlJPUjogMT" +
        "AxLFZBU1RfVFJBRkZJQ0tJTkdfRVJST1I6IDIwMCxWQVNUX1VORVhQRUNURURfTElORUFSSVRZOiAyMDEsVkFTVF9VTkVYUEVDVEVEX0RVUkFUSU9OX0VSUk9SOiAyMDIsVkFTVF9XUkFQUEVSX0VS" +
        "Uk9SOiAzMDAsTk9OTElORUFSX0RJTUVOU0lPTlNfRVJST1I6IDUwMSxDT01QQU5JT05fUkVRVUlSRURfRVJST1I6IDYwMixWQVNUX0VNUFRZX1JFU1BPTlNFOiAxMDA5LFVOU1VQUE9SVEVEX0xPQ0" +
        "FMRTogMTAxMSxJTlZBTElEX0FEWF9FWFRFTlNJT046IDExMDUsSU5WQUxJRF9BUkdVTUVOVFM6IDExMDEsVU5LTk9XTl9BRF9SRVNQT05TRTogMTAxMCxVTktOT1dOX0VSUk9SOiA5MDAsT1ZFUkxB" +
        "WV9BRF9QTEFZSU5HX0ZBSUxFRDogNTAwLFZJREVPX0VMRU1FTlRfVVNFRDogLTEsVklERU9fRUxFTUVOVF9SRVFVSVJFRDogLTEsVkFTVF9NRURJQV9FUlJPUjogLTEsQURTTE9UX05PVF9WSVNJQk" +
        "xFOiAtMSxPVkVSTEFZX0FEX0xPQURJTkdfRkFJTEVEOiAtMSxWQVNUX01BTEZPUk1FRF9SRVNQT05TRTogLTEsQ09NUEFOSU9OX0FEX0xPQURJTkdfRkFJTEVEOiAtMSx9O3dpbmRvdy5nb29nbGUu" +
        "aW1hLkFkRXJyb3IuVHlwZSA9IHtBRF9MT0FEOiAiYWRMb2FkRXJyb3IiLEFEX1BMQVk6ICJhZFBsYXlFcnJvciIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZSA9IHtBRF9FUl" +
        "JPUjogImFkRXJyb3IiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlID0ge0NPTlRFTlRfUkVTVU1FX1JFUVVFU1RFRDogImNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQiLENPTlRFTlRfUEFV" +
        "U0VfUkVRVUVTVEVEOiAiY29udGVudFBhdXNlUmVxdWVzdGVkIixDTElDSzogImNsaWNrIixEVVJBVElPTl9DSEFOR0U6ICJkdXJhdGlvbkNoYW5nZSIsRVhQQU5ERURfQ0hBTkdFRDogImV4cGFuZG" +
        "VkQ2hhbmdlZCIsU1RBUlRFRDogInN0YXJ0IixJTVBSRVNTSU9OOiAiaW1wcmVzc2lvbiIsUEFVU0VEOiAicGF1c2UiLFJFU1VNRUQ6ICJyZXN1bWUiLEZJUlNUX1FVQVJUSUxFOiAiZmlyc3RxdWFy" +
        "dGlsZSIsTUlEUE9JTlQ6ICJtaWRwb2ludCIsVEhJUkRfUVVBUlRJTEU6ICJ0aGlyZHF1YXJ0aWxlIixDT01QTEVURTogImNvbXBsZXRlIixVU0VSX0NMT1NFOiAidXNlckNsb3NlIixMSU5FQVJfQ0" +
        "hBTkdFRDogImxpbmVhckNoYW5nZWQiLExPQURFRDogImxvYWRlZCIsQURfQ0FOX1BMQVk6ICJhZENhblBsYXkiLEFEX01FVEFEQVRBOiAiYWRNZXRhZGF0YSIsQURfQlJFQUtfUkVBRFk6ICJhZEJy" +
        "ZWFrUmVhZHkiLElOVEVSQUNUSU9OOiAiaW50ZXJhY3Rpb24iLEFMTF9BRFNfQ09NUExFVEVEOiAiYWxsQWRzQ29tcGxldGVkIixTS0lQUEVEOiAic2tpcCIsU0tJUFBBQkxFX1NUQVRFX0NIQU5HRU" +
        "Q6ICJza2lwcGFibGVTdGF0ZUNoYW5nZWQiLExPRzogImxvZyIsVklFV0FCTEVfSU1QUkVTU0lPTjogInZpZXdhYmxlX2ltcHJlc3Npb24iLFZPTFVNRV9DSEFOR0VEOiAidm9sdW1lQ2hhbmdlIixW" +
        "T0xVTUVfTVVURUQ6ICJtdXRlIix9O3dpbmRvdy5nb29nbGUuaW1hLkFkc01hbmFnZXJMb2FkZWRFdmVudC5UeXBlID0ge0FEU19NQU5BR0VSX0xPQURFRDogImFkc01hbmFnZXJMb2FkZWQiLH07d2" +
        "luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5DcmVhdGl2ZVR5cGUgPSB7QUxMOiAiQWxsIixGTEFTSDogIkZsYXNoIixJTUFHRTogIkltYWdlIix9O3dpbmRvdy5n" +
        "b29nbGUuaW1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuUmVzb3VyY2VUeXBlID0ge0FMTDogIkFsbCIsSFRNTDogIkh0bWwiLElGUkFNRTogIklGcmFtZSIsU1RBVElDOiAiU3RhdGljIi" +
        "x9O3dpbmRvdy5nb29nbGUuaW1hLkNvbXBhbmlvbkFkU2VsZWN0aW9uU2V0dGluZ3MuU2l6ZUNyaXRlcmlhID0ge0lHTk9SRTogIklnbm9yZVNpemUiLFNFTEVDVF9FWEFDVF9NQVRDSDogIlNlbGVj" +
        "dEV4YWN0TWF0Y2giLFNFTEVDVF9ORUFSX01BVENIOiAiU2VsZWN0TmVhck1hdGNoIix9O3dpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLkNvbXBhbmlvbkJhY2tmaWxsTW9kZSA9IHtBTF" +
        "dBWVM6ICJhbHdheXMiLE9OX01BU1RFUl9BRDogIm9uX21hc3Rlcl9hZCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5WcGFpZE1vZGUgPSB7RElTQUJMRUQ6IDAsRU5BQkxFRDog" +
        "MSxJTlNFQ1VSRTogMix9Oy8vSW5pdGlhbGl6YXRpb253aW5kb3cuZ29vZ2xlLmltYS5zZXR0aW5ncyA9IG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncygpO30pKCk7",
    );
    //---MoatFreeWheelJSPEM.js---
    //Payload generator
    /*
    a.mkPayload(() => {
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
        "data:text/javascript;base64,KCgpID0+IHsNCiAgICAgICAgInVzZSBzdHJpY3QiOw0KICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcigiVW5jYXVnaHQgRXJyb3I6IEZyZWVXaGVlbCBTRE" +
        "sgaXMgbm90IGFsbG93ZWQgb24gdGhpcyBkZXZpY2UhIik7DQogICAgICAgIHdpbmRvdy5Nb2F0RnJlZVdoZWVsSlNQRU0gPSBjbGFzcyB7DQogICAgICAgICAgICBpbml0KCkgeyB9DQogICAgICAg" +
        "ICAgICBkaXNwb3NlKCkgeyB9DQogICAgICAgIH07DQogICAgfSkoKTs=",
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
 * @param {Function} payload - The payload.
 * @param {string} [type="text/javascript"] - The MIME type of the payload.
 * @return {string} The URL encoded payload.
 */
a.mkPayload = (payload, type = "text/javascript") => {
    if (!a.debugMode) {
        console.error("a.mkPayload() is only available in debug mode!");
        return;
    }
    //Trim each line to make it smaller
    let lines = (`(${payload})();`).split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    payload = `data:${type};base64,` + btoa(lines.join(""));
    let output = "";
    while (payload) {
        output += `"${payload.substring(0, 150)}" +\n`;
        payload = payload.substring(150);
    }
    console.log(output);
};
