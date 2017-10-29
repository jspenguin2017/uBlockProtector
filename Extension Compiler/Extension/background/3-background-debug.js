//This file contains background rules for debugging purposes, they are only activated in debug mode
"use strict";

//@pragma-if-debug

//Tools
if (a.debugMode) {
    {
        //https://github.com/jspenguin2017/uBlockProtector/issues/338
        a.proxy(
            [
                "*://go.com/*",
                "*://*.go.com/*",
            ],
            "107.77.200.10",
        );
    }
    {
        //https://github.com/jspenguin2017/uBlockProtector/issues/286
        a.proxy(
            [
                "*://itv.com/*",
                "*://*.itv.com/*",
            ],
            "88.82.2.10",
        );
    }
    {
        //https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/10
        a.proxy(
            [
                "*://tvnow.de/*",
                "*://*.tvnow.de/*",
            ],
            "46.101.180.199",
        );
    }
    //a.proxy() does not work for: viasport.fi, topserialy.to
}

//Rules
if (a.debugMode) {
    /*
    {
        //https://github.com/AdguardTeam/AdguardFilters/issues/6718
        //Looks like viz.com is no longer embedding hulu.com
        a.staticServer(
            [
                "*://ads-v-darwin.hulustream.com/published/*.mp4*",
                "*://*.ads-v-darwin.hulustream.com/published/*.mp4*",
            ],
            [
                "media",
            ],
            a.blankMP4,
            [
                "player.hulu.com",
            ],
            true,
        );
    }
    */
    {
        //https://github.com/jspenguin2017/uBlockProtector/issues/660
        const payload = "data:application/json;base64," + btoa(JSON.stringify({}));
        a.staticServer(
            [
                "*://*.uplynk.com/preplay/*",
            ],
            [
                "xmlhttprequest",
            ],
            payload,
            [
                "fox.com",
            ],
            true,
        );
    }
}

//@pragma-end-if
