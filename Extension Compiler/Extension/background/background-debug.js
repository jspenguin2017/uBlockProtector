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
    //Seems to be validated on the server side, this does not work
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
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/344
    {
        const genPayload = (csid, caid, cbfn) => {
            //Looks like this cannot be static, media URLs seems to be included in this file
            //Also, this is not optimized
            let payload = `{
                version: "1",
                networkId: "-1",
                parameters: [
                    {
                        name: "autoloadExtensions",
                        category: "profile",
                        value: "https://jspenguin.com/API/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
                    },
                ],
                rendererManifest: {
                    adRenderers: {
                        version: "1",
                        adRenderer: [],
                    },
                },
                visitor: {
                    "httpHeaders": [],
                    "state": [],
                },
                errors: {
                    errors: [],
                },
                eventCallbacks: {
                    eventCallbacks: [],
                },
                ads: {
                    ads: [],
                },
                siteSection: {
                    customId: "@csid",
                    videoPlayer: {
                        videoAsset: {
                            eventCallbacks: [],
                            customId: "@caid",
                            networkId: "-1",
                            adSlots: [],
                        },
                        adSlots: [],
                    },
                    adSlots: [],
                },
            }`;
            return "data:text/javascript;base64," + btoa(cbfn + "(" + payload.replace("@csid", csid).replace("@caid", caid) + ");");
        };
        //Matchers
        const reOrigin = /^(https?:\/\/\w+\.ncaa\.com\/|$)/; //Aggressively redirect if the URL of the tab is not known
        const reCsid = /csid=([^&]+)/;
        const reCaid = /caid=([^&]+)/;
        const reCbfn = /cbfn=([^&]+)/;
        //Main ads request nooping
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => {
                //Debug log
                console.log(details);
                if (reOrigin.test(a.getTabURL(details.tabId))) {
                    const csid = reCsid.exec(details.url);
                    const caid = reCaid.exec(details.url);
                    const cbfn = reCbfn.exec(details.url);
                    if (csid && caid && cbfn) {
                        return { redirectUrl: genPayload(csid[1], caid[1], decodeURIComponent(cbfn[1])) };
                    }
                } else {
                    //Debug log
                    console.log(a.getTabURL(details.tabId));
                    //return { cancel: true };
                }
            },
            {
                urls: [
                    "https://*.fwmrm.net/*",
                    "http://*.fwmrm.net/*",
                ],
                types: [
                    "script",
                ],
            },
            [
                "blocking",
            ],
        );
    }
}
