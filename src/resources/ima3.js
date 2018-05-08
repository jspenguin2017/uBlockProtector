/**
 * Interactive Media Ads Software Development Kit surrogate.
 * https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis
 */
; (() => {
    "use strict";

    try {
        window.console.error("[Nano] Surrogate Injected :: IMA SDK");
    } catch (err) { }

    let warnCount = 0;

    window.google = window.google || {};

    // Interfaces are not implemented
    window.google.ima = {
        AdDisplayContainer: class {
            // constructor(container, video, click) { }
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
                return "AdError " + this._code + ": " + this._message + ".";
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
            constructor() {
                this._onError = [];
                this._onErrorScope = [];
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
                // The real SDK should also always return error
                if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                    this._onError.push(handler);
                    this._onErrorScope.push(scope);
                } else if (warnCount < 10) {
                    warnCount++;
                    try {
                        window.console.warn("[Nano] IMA Event Ignored :: " + event);
                    } catch (err) { }
                }
            }
            removeEventListener(event, handler) {
                // Capture and scope are not checked
                if (event === window.google.ima.AdErrorEvent.Type.AD_ERROR) {
                    for (let i = 0; i < this._onError.length; i++) {
                        // This should be good enough
                        if (this._onError[i] === handler) {
                            this._onError.splice(i, 1);
                            this._onErrorScope.splice(i, 1);
                            i--;
                        }
                    }
                }
                // Ignore otherwise
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
                // Not implemented
                throw new window.Error("[Nano] Not Implemented :: Neutralized AdsManager");
            }
        },

        AdsRenderingSettings: class {
            // Not implemented
            // constructor() { }
        },

        AdsRequest: class {
            // Partially implemented
            // constructor() { }
            setAdWillAutoPlay() { }
            setAdWillPlayMuted() { }
        },

        CompanionAdSelectionSettings: class {
            // Not implemented
            // constructor() { }
        },

        ImaSdkSettings: class {
            // Partially implemented
            // constructor() { }
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

    window.google.ima.settings = new window.google.ima.ImaSdkSettings();
})();
