//This file contains background rules that are not quite working, they are only activated in debug mode
"use strict";

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
                "https://*.vidlox.tv/*",
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
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            details.requestHeaders.push({
                name: "X-Forwarded-For",
                value: "107.77.200.10",
            });
            details.requestHeaders.push({
                name: "Client-IP",
                value: "107.77.200.10",
            });
            //Debug log
            console.log(details);
            return { requestHeaders: details.requestHeaders };
        },
        {
            urls: [
                "https://*.go.com/*",
                "http://*.go.com/*",
            ],
        },
        [
            "blocking",
            "requestHeaders",
        ],
    );
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
                    "https://*.gamereactor.eu/*",
                    "http://*.gamereactor.eu/*",
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
}
