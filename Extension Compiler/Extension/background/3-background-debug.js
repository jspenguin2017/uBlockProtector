//This file contains background rules for debugging purposes, they are only activated in debug mode
"use strict";

//Tools
if (a.debugMode) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/209
    chrome.webRequest.onHeadersReceived.addListener(
        (details) => {
            details.responseHeaders.push({
                name: "Access-Control-Allow-Origin",
                value: "https://vidlox.tv",
            });
            //Debug log
            console.log(details);
            return { responseHeaders: details.responseHeaders };
        },
        {
            urls: [
                "*://vidlox.tv/*",
                "*://*.vidlox.tv/*",
            ],
            types: [
                //"main_frame",
                "xmlhttprequest",
            ],
        },
        [
            "blocking",
            "responseHeaders",
        ],
    );
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/338
    a.proxy(
        [
            "*://go.com/*",
            "*://*.go.com/*",
        ],
        "107.77.200.10",
    );
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/286
    a.proxy(
        [
            "*://itv.com/*",
            "*://*.itv.com/*",
        ],
        "88.82.2.10",
    );
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/88
    /*
    //The trick does not work for this domain
    a.proxy(
        [
            "*://viasport.fi/*",
            "*://*.viasport.fi/*",
        ],
        "213.243.191.42",
        true,
    );
    */
    //Issue: https://github.com/reek/anti-adblock-killer/issues/3291
    /*
    //The trick does not work for this domain
    a.proxy(
        [
            "*://topserialy.to/*",
            "*://*.topserialy.to/*",
        ],
        "43.255.151.144",
        true,
    );
    */
    //Issue: https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/10
    a.proxy(
        [
            "*://tvnow.de/*",
            "*://*.tvnow.de/*",
        ],
        "46.101.180.199",
    );
}
//Rules
if (a.debugMode) {
    /*
    //Looks like viz.com is no longer embedding hulu.com
    {
        //https://github.com/AdguardTeam/AdguardFilters/issues/6718
        a.staticServer(
            [
                "*://ads-v-darwin.hulustream.com/published/*.mp4",
                "*://*.ads-v-darwin.hulustream.com/published/*.mp4",
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
}
