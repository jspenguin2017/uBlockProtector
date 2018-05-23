/**
 * Background rules for debugging. Only run in debug mode.
 */
"use strict";

//@pragma-if-debug

// Tools
if (a.debugMode) {
    {
        // https://github.com/jspenguin2017/uBlockProtector/issues/338
        a.proxy(
            [
                "*://go.com/*",
                "*://*.go.com/*",
            ],
            "107.77.200.10",
        );
    }
    {
        // https://github.com/jspenguin2017/uBlockProtector/issues/286
        a.proxy(
            [
                "*://itv.com/*",
                "*://*.itv.com/*",
            ],
            "88.82.2.10",
        );
    }
    {
        // https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/10
        a.proxy(
            [
                "*://tvnow.de/*",
                "*://*.tvnow.de/*",
            ],
            "46.101.180.199",
        );
    }
    // a.proxy() does not work for: viasport.fi, topserialy.to
}

// Rules
if (a.debugMode) {
    {
        // uplynk.com
        // https://github.com/uBlockOrigin/uAssets/issues/772
        const reBlock = /^https?:\/\/(?:[^.]*?\.)?uplynk\.com\/api\/v3\/preplay\//;
        const reStrip = /^https?:\/\/(?:[^.]*?\.)?uplynk\.com\/ext\/[^?]*\.m3u8\?/;

        a.dynamicServer(
            [
                "*://uplynk.com/*",
                "*://*.uplynk.com/*",
            ],
            [
                "xmlhttprequest",
            ],
            (details) => {
                if (reBlock.test(details.url)) {
                    return { cancel: true };
                } else if (reStrip.test(details.url)) {
                    const i = details.url.indexOf('?');
                    return { redirectUrl: details.url.substring(0, i) };
                }
            },
        );
    }
}

//@pragma-end-if
