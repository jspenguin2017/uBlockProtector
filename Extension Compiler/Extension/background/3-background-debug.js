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
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/343
    //Seems to be validated on the server side, this does not work, actually, modifying the cookie makes it worse
    {
        //Generate cookie value
        const mkVal = () => {
            const timestamp = Math.floor(Date.now() / 1000) + 1000;
            return `10_${timestamp}`;
        };
        //The cookie matcher
        const reMatcher = /countdownToAd=[^;]+/;
        //Listen and modify headers
        chrome.webRequest.onBeforeSendHeaders.addListener(
            (details) => {
                for (let i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name === "Cookie") {
                        if (details.requestHeaders[i].value.includes("countdownToAd=")) {
                            details.requestHeaders[i].value =
                                details.requestHeaders[i].value.replace(reMatcher, `countdownToAd=${mkVal()}`);
                        } else {
                            details.requestHeaders[i].value += `; countdownToAd=${mkVal()}`;
                        }
                    }
                }
                //Debug log
                console.log(details);
                return { requestHeaders: details.requestHeaders };
            },
            {
                urls: [
                    "*://gamereactor.eu/*",
                    "*://*.gamereactor.eu/*",
                ],
                types: [
                    "main_frame",
                ],
            },
            [
                "blocking",
                "requestHeaders",
            ],
        );
    }
    */
}
