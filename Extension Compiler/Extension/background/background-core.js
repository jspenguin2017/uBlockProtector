//The Core library for background rules
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
        "V2aWNlISIpO3dpbmRvdy5nb29nbGUgPSB7aW1hOiB7QWREaXNwbGF5Q29udGFpbmVyOiBjbGFzcyB7aW5pdGlhbGl6ZSgpIHsgfWRlc3Ryb3koKSB7IH19LEFkRXJyb3I6IGNsYXNzIGV4dGVuZHMg" +
        "RXJyb3Ige2NvbnN0cnVjdG9yKG1lc3NhZ2UsIGNvZGUsIHR5cGUpIHtzdXBlcihtZXNzYWdlKTt0aGlzLmNvZGUgPSBjb2RlO3RoaXMudHlwZSA9IHR5cGU7fWdldEVycm9yQ29kZSgpIHtyZXR1cm" +
        "4gdGhpcy5jb2RlO31nZXRJbm5lckVycm9yKCkge3JldHVybiBudWxsO31nZXRNZXNzYWdlKCkge3JldHVybiB0aGlzLm1lc3NhZ2U7fWdldFR5cGUoKSB7cmV0dXJuIHRoaXMudHlwZTt9Z2V0VmFz" +
        "dEVycm9yQ29kZSgpIHtyZXR1cm4gd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5FcnJvckNvZGUuVU5LTk9XTl9FUlJPUjt9fSxBZEVycm9yRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXJyb3JFdmVudC" +
        "B7Y29uc3RydWN0b3IoZXJyb3IsIGNvbnRleHQpIHtzdXBlcihlcnJvcik7dGhpcy5lcnJPYmogPSBlcnJvcjt0aGlzLmNvbnRleHQgPSBjb250ZXh0O31nZXRFcnJvcigpIHtyZXR1cm4gdGhpcy5l" +
        "cnJPYmo7fWdldFVzZXJSZXF1ZXN0Q29udGV4dCgpIHtyZXR1cm4gdGhpcy5jb250ZXh0O319LEFkRXZlbnQ6IGNsYXNzIGV4dGVuZHMgRXZlbnQge2NvbnN0cnVjdG9yKHR5cGUsIGFkLCBhZERhdG" +
        "EpIHtzdXBlcih0eXBlKTt0aGlzLmFkID0gYWQ7dGhpcy5hZERhdGEgPSBhZERhdGE7fWdldEFkKCkge3JldHVybiB0aGlzLmFkO31nZXRBZERhdGEoKSB7cmV0dXJuIHRoaXMuYWREYXRhO319LEFk" +
        "c0xvYWRlcjogY2xhc3Mge2NvbnN0cnVjdG9yKCkge3RoaXMub25FcnJvciA9IFtdO3RoaXMub25FcnJvclNjb3BlID0gW107dGhpcy5fZXJyb3IgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRFcn" +
        "JvckV2ZW50KG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yKCJObyBhZHMgYXZhaWxhYmxlIix3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZS5WQVNUX05PX0FEU19BRlRFUl9X" +
        "UkFQUEVSLHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3IuVHlwZS5BRF9MT0FELCkse30sKTt9YWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgY2FwdHVyZSwgc2NvcGUpIHtpZiAoZXZlbn" +
        "QgPT09IHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SKSB7dGhpcy5vbkVycm9yLnB1c2goaGFuZGxlcik7dGhpcy5vbkVycm9yU2NvcGUucHVzaChzY29wZSk7fSBl" +
        "bHNlIHt3aW5kb3cuY29uc29sZS53YXJuKGBJTUEgZXZlbnQgJHtldmVudH0gaXMgaWdub3JlZCBieSB1QmxvY2sgUHJvdGVjdG9yLmApO319cmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZG" +
        "xlcikge2lmIChldmVudCA9PT0gd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50LlR5cGUuQURfRVJST1IpIHtmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub25FcnJvci5sZW5ndGg7IGkrKykg" +
        "e2lmICh0aGlzLm9uRXJyb3JbaV0gPT09IGhhbmRsZXIpIHt0aGlzLm9uRXJyb3Iuc3BsaWNlKGksIDEpO3RoaXMub25FcnJvclNjb3BlLnNwbGljZShpLCAxKTtpLS07fX19fV9kaXNwYXRjaEVycm" +
        "9yKCkge2ZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vbkVycm9yLmxlbmd0aDsgaSsrKSB7dGhpcy5vbkVycm9yW2ldLmNhbGwodGhpcy5vbkVycm9yU2NvcGVbaV0gfHwgd2luZG93LCB0aGlzLl9l" +
        "cnJvcik7fX1jb250ZW50Q29tcGxldGUoKSB7d2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvcigpLCAxMCk7fWRlc3Ryb3koKSB7IH1nZXRTZXR0aW5ncygpIHtyZXR1cm4gd2luZG" +
        "93Lmdvb2dsZS5pbWEuc2V0dGluZ3M7fXJlcXVlc3RBZHMoKSB7d2luZG93LnNldFRpbWVvdXQodGhpcy5fZGlzcGF0Y2hFcnJvcigpLCAxMCk7fX0sQWRzTWFuYWdlckxvYWRlZEV2ZW50OiBjbGFz" +
        "cyBleHRlbmRzIEV2ZW50IHtjb25zdHJ1Y3RvcigpIHt0aHJvdyBuZXcgd2luZG93LkVycm9yKCJOZXV0cmFsaXplZCBBZHNNYW5hZ2VyIGlzIG5vdCBpbXBsZW1lbnRlZC4iKTt9fSxBZHNSZW5kZX" +
        "JpbmdTZXR0aW5nczogY2xhc3Mge30sQWRzUmVxdWVzdDogY2xhc3Mge3NldEFkV2lsbEF1dG9QbGF5KCkgeyB9fSxDb21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzOiBjbGFzcyB7fSxJbWFTZGtT" +
        "ZXR0aW5nczogY2xhc3Mge2dldENvbXBhbmlvbkJhY2tmaWxsKCkge3JldHVybiB3aW5kb3cuZ29vZ2xlLmltYS5JbWFTZGtTZXR0aW5ncy5Db21wYW5pb25CYWNrZmlsbE1vZGUuQUxXQVlTO31nZX" +
        "REaXNhYmxlQ3VzdG9tUGxheWJhY2tGb3JJT1MxMFBsdXMoKSB7cmV0dXJuIGZhbHNlO31nZXREaXNhYmxlRmxhc2hBZHMoKSB7cmV0dXJuIHRydWU7fWdldExvY2FsZSgpIHtyZXR1cm4gImVuLUNB" +
        "Ijt9Z2V0TnVtUmVkaXJlY3RzKCkge3JldHVybiAxO31nZXRQbGF5ZXJUeXBlKCkge3JldHVybiAiVW5rbm93biI7fWdldFBsYXllclZlcnNpb24oKSB7cmV0dXJuICIxLjAuMCI7fWdldFBwaWQoKS" +
        "B7cmV0dXJuICIyR2pDZ29FQ0FQMEliVSI7fXNldEF1dG9QbGF5QWRCcmVha3MoKSB7IH1zZXRDb21wYW5pb25CYWNrZmlsbCgpIHsgfXNldERpc2FibGVDdXN0b21QbGF5YmFja0ZvcklPUzEwUGx1" +
        "cygpIHsgfXNldERpc2FibGVGbGFzaEFkcygpIHsgfXNldExvY2FsZSgpIHsgfXNldE51bVJlZGlyZWN0cygpIHsgfXNldFBsYXllclR5cGUoKSB7IH1zZXRQbGF5ZXJWZXJzaW9uKCkgeyB9c2V0UH" +
        "BpZCgpIHsgfXNldFZwYWlkQWxsb3dlZCgpIHsgfXNldFZwYWlkTW9kZSgpIHsgfX0sVWlFbGVtZW50czoge0NPVU5URE9XTjogImNvdW50ZG93biIsfSxWaWV3TW9kZToge0ZVTExTQ1JFRU46ICJm" +
        "dWxsc2NyZWVuIixOT1JNQUw6ICJub3JtYWwiLH0sVkVSU0lPTjogIjMuMTczLjQiLH0sfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yLkVycm9yQ29kZSA9IHtWSURFT19QTEFZX0VSUk9SOiA0MD" +
        "AsRkFJTEVEX1RPX1JFUVVFU1RfQURTOiAxMDA1LFJFUVVJUkVEX0xJU1RFTkVSU19OT1RfQURERUQ6IDkwMCxWQVNUX0xPQURfVElNRU9VVDogMzAxLFZBU1RfTk9fQURTX0FGVEVSX1dSQVBQRVI6" +
        "IDMwMyxWQVNUX01FRElBX0xPQURfVElNRU9VVDogNDAyLFZBU1RfVE9PX01BTllfUkVESVJFQ1RTOiAzMDIsVkFTVF9BU1NFVF9NSVNNQVRDSDogNDAzLFZBU1RfTElORUFSX0FTU0VUX01JU01BVE" +
        "NIOiA0MDMsVkFTVF9OT05MSU5FQVJfQVNTRVRfTUlTTUFUQ0g6IDUwMyxWQVNUX0FTU0VUX05PVF9GT1VORDogMTAwNyxWQVNUX1VOU1VQUE9SVEVEX1ZFUlNJT046IDEwMixWQVNUX1NDSEVNQV9W" +
        "QUxJREFUSU9OX0VSUk9SOiAxMDEsVkFTVF9UUkFGRklDS0lOR19FUlJPUjogMjAwLFZBU1RfVU5FWFBFQ1RFRF9MSU5FQVJJVFk6IDIwMSxWQVNUX1VORVhQRUNURURfRFVSQVRJT05fRVJST1I6ID" +
        "IwMixWQVNUX1dSQVBQRVJfRVJST1I6IDMwMCxOT05MSU5FQVJfRElNRU5TSU9OU19FUlJPUjogNTAxLENPTVBBTklPTl9SRVFVSVJFRF9FUlJPUjogNjAyLFZBU1RfRU1QVFlfUkVTUE9OU0U6IDEw" +
        "MDksVU5TVVBQT1JURURfTE9DQUxFOiAxMDExLElOVkFMSURfQURYX0VYVEVOU0lPTjogMTEwNSxJTlZBTElEX0FSR1VNRU5UUzogMTEwMSxVTktOT1dOX0FEX1JFU1BPTlNFOiAxMDEwLFVOS05PV0" +
        "5fRVJST1I6IDkwMCxPVkVSTEFZX0FEX1BMQVlJTkdfRkFJTEVEOiA1MDAsVklERU9fRUxFTUVOVF9VU0VEOiAtMSxWSURFT19FTEVNRU5UX1JFUVVJUkVEOiAtMSxWQVNUX01FRElBX0VSUk9SOiAt" +
        "MSxBRFNMT1RfTk9UX1ZJU0lCTEU6IC0xLE9WRVJMQVlfQURfTE9BRElOR19GQUlMRUQ6IC0xLFZBU1RfTUFMRk9STUVEX1JFU1BPTlNFOiAtMSxDT01QQU5JT05fQURfTE9BRElOR19GQUlMRUQ6IC" +
        "0xLH07d2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvci5UeXBlID0ge0FEX0xPQUQ6ICJhZExvYWRFcnJvciIsQURfUExBWTogImFkUGxheUVycm9yIix9O3dpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JF" +
        "dmVudC5UeXBlID0ge0FEX0VSUk9SOiAiYWRFcnJvciIsfTt3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUgPSB7Q09OVEVOVF9SRVNVTUVfUkVRVUVTVEVEOiAiY29udGVudFJlc3VtZVJlcX" +
        "Vlc3RlZCIsQ09OVEVOVF9QQVVTRV9SRVFVRVNURUQ6ICJjb250ZW50UGF1c2VSZXF1ZXN0ZWQiLENMSUNLOiAiY2xpY2siLERVUkFUSU9OX0NIQU5HRTogImR1cmF0aW9uQ2hhbmdlIixFWFBBTkRF" +
        "RF9DSEFOR0VEOiAiZXhwYW5kZWRDaGFuZ2VkIixTVEFSVEVEOiAic3RhcnQiLElNUFJFU1NJT046ICJpbXByZXNzaW9uIixQQVVTRUQ6ICJwYXVzZSIsUkVTVU1FRDogInJlc3VtZSIsRklSU1RfUV" +
        "VBUlRJTEU6ICJmaXJzdHF1YXJ0aWxlIixNSURQT0lOVDogIm1pZHBvaW50IixUSElSRF9RVUFSVElMRTogInRoaXJkcXVhcnRpbGUiLENPTVBMRVRFOiAiY29tcGxldGUiLFVTRVJfQ0xPU0U6ICJ1" +
        "c2VyQ2xvc2UiLExJTkVBUl9DSEFOR0VEOiAibGluZWFyQ2hhbmdlZCIsTE9BREVEOiAibG9hZGVkIixBRF9DQU5fUExBWTogImFkQ2FuUGxheSIsQURfTUVUQURBVEE6ICJhZE1ldGFkYXRhIixBRF" +
        "9CUkVBS19SRUFEWTogImFkQnJlYWtSZWFkeSIsSU5URVJBQ1RJT046ICJpbnRlcmFjdGlvbiIsQUxMX0FEU19DT01QTEVURUQ6ICJhbGxBZHNDb21wbGV0ZWQiLFNLSVBQRUQ6ICJza2lwIixTS0lQ" +
        "UEFCTEVfU1RBVEVfQ0hBTkdFRDogInNraXBwYWJsZVN0YXRlQ2hhbmdlZCIsTE9HOiAibG9nIixWSUVXQUJMRV9JTVBSRVNTSU9OOiAidmlld2FibGVfaW1wcmVzc2lvbiIsVk9MVU1FX0NIQU5HRU" +
        "Q6ICJ2b2x1bWVDaGFuZ2UiLFZPTFVNRV9NVVRFRDogIm11dGUiLH07d2luZG93Lmdvb2dsZS5pbWEuQWRzTWFuYWdlckxvYWRlZEV2ZW50LlR5cGUgPSB7QURTX01BTkFHRVJfTE9BREVEOiAiYWRz" +
        "TWFuYWdlckxvYWRlZCIsfTt3aW5kb3cuZ29vZ2xlLmltYS5Db21wYW5pb25BZFNlbGVjdGlvblNldHRpbmdzLkNyZWF0aXZlVHlwZSA9IHtBTEw6ICJBbGwiLEZMQVNIOiAiRmxhc2giLElNQUdFOi" +
        "AiSW1hZ2UiLH07d2luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5SZXNvdXJjZVR5cGUgPSB7QUxMOiAiQWxsIixIVE1MOiAiSHRtbCIsSUZSQU1FOiAiSUZyYW1l" +
        "IixTVEFUSUM6ICJTdGF0aWMiLH07d2luZG93Lmdvb2dsZS5pbWEuQ29tcGFuaW9uQWRTZWxlY3Rpb25TZXR0aW5ncy5TaXplQ3JpdGVyaWEgPSB7SUdOT1JFOiAiSWdub3JlU2l6ZSIsU0VMRUNUX0" +
        "VYQUNUX01BVENIOiAiU2VsZWN0RXhhY3RNYXRjaCIsU0VMRUNUX05FQVJfTUFUQ0g6ICJTZWxlY3ROZWFyTWF0Y2giLH07d2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MuQ29tcGFuaW9u" +
        "QmFja2ZpbGxNb2RlID0ge0FMV0FZUzogImFsd2F5cyIsT05fTUFTVEVSX0FEOiAib25fbWFzdGVyX2FkIix9O3dpbmRvdy5nb29nbGUuaW1hLkltYVNka1NldHRpbmdzLlZwYWlkTW9kZSA9IHtESV" +
        "NBQkxFRDogMCxFTkFCTEVEOiAxLElOU0VDVVJFOiAyLH07d2luZG93Lmdvb2dsZS5pbWEuc2V0dGluZ3MgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuSW1hU2RrU2V0dGluZ3MoKTt9KSgpOw==",
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
