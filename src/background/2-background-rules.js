/**
 * Background rules.
 */
"use strict";

a.init();
a.generic();

{
    // fwmrm.net
    // https://github.com/jspenguin2017/uBlockProtector/issues/344
    const genPayload = (csid, caid, cbfn) => {
        // Paths in this payload are placeholders, no request to jspenguin.com
        // will leave the browser
        // Event callbacks are blocked by Nano Defender Integration filter
        // list
        let payload = `(() => {
            "use strict";
            try {
                window.console.log("[Nano] Request Loopback :: v.fwmrm.net");
            } catch (err) { }
            ${cbfn}({
                version: "1",
                networkId: "100",
                parameters: [
                    {
                        name: "autoloadExtensions",
                        category: "profile",
                        value: "https://jspenguin.com/uBlockProtector/Solutions/MoatFreeWheelJSPEM.js",
                    },
                ],
                rendererManifest: {
                    adRenderers: {
                        version: "1",
                        adRenderer: [
                            {
                                name: "g_html5_null",
                                url: "class://NullRenderer",
                                contentType: "null/null,",
                                adUnit: "video,linear-animation,generic-overlay,app-interstitial,",
                                slotType: "preroll,midroll,postroll,overlay,display,pause_midroll,",
                                creativeApi: "None,",
                            },
                        ],
                    },
                },
                visitor: {
                    httpHeaders: [],
                    state: [],
                },
                errors: {
                    errors: [],
                },
                eventCallbacks: {
                    eventCallbacks: [
                        {
                            url: "https://jspenguin.com/uBlockProtector/Solutions/Blocked.php",
                            type: "GENERIC",
                            use: "BASE",
                            showBrowser: false,
                            trackingUrls: [],
                        },
                    ],
                },
                ads: {
                    ads: [],
                },
                siteSection: {
                    customId: "${csid}",
                    videoPlayer: {
                        videoAsset: {
                            eventCallbacks: [
                                {
                                    url: "https://jspenguin.com/uBlockProtector/Solutions/Blocked.php",
                                    name: "videoView",
                                    type: "IMPRESSION",
                                    use: "OVERRIDE",
                                    showBrowser: false,
                                    trackingUrls: [],
                                },
                            ],
                            customId: "${caid}",
                            networkId: "100",
                            adSlots: [
                                {
                                    eventCallbacks: [
                                        {
                                            url: "https://jspenguin.com/uBlockProtector/Solutions/Blocked.php",
                                            name: "slotImpression",
                                            type: "IMPRESSION",
                                            use: "OVERRIDE",
                                            showBrowser: false,
                                            trackingUrls: [],
                                        },
                                        {
                                            url: "https://jspenguin.com/uBlockProtector/Solutions/Blocked.php",
                                            name: "slotEnd",
                                            type: "IMPRESSION",
                                            use: "OVERRIDE",
                                            showBrowser: false,
                                            trackingUrls: [],
                                        },
                                    ],
                                    customId: "1000",
                                    selectedAds: [],
                                    timePosition: "0",
                                    timePositionClass: "preroll",
                                    adUnit: "preroll",
                                },
                            ],
                        },
                        adSlots: [],
                    },
                    adSlots: [],
                },
            });
        })();`;
        return "data:text/javascript;base64," + btoa(payload);
    };

    const reCsid = /csid=([^&]+)/;
    const reCaid = /caid=([^&]+)/;
    const reCbfn = /cbfn=([^&]+)/;

    a.dynamicServer(
        [
            "http://*.v.fwmrm.net/ad/g/*",
            "https://*.v.fwmrm.net/ad/g/*",
        ],
        [
            "script",
        ],
        (details) => {
            const csid = reCsid.exec(details.url);
            const caid = reCaid.exec(details.url);
            const cbfn = reCbfn.exec(details.url);
            if (csid && caid && cbfn) {
                return { redirectUrl: genPayload(csid[1], caid[1], decodeURIComponent(cbfn[1])) };
            } else {
                console.log("[Nano] Failed :: Extract Parameters From A Request To v.fwmrm.net");

                //@pragma-if-debug
                if (a.debugMode) {
                    console.log(details);
                }
                //@pragma-end-if

                // Block the request as a fallback
                return { cancel: true };
            }
        },
        [
            "ncaa.com",
            "pga.com",
            "q2.be",
            "vtm.be",
            "ruutu.fi",
            "medialaancdn.be",
            "medialaan.be",
        ],
    );
}
{
    // shorte.st and related domains
    // https://github.com/jspenguin2017/uBlockProtector/issues/169
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            for (let i = 0; i < details.requestHeaders.length; i++) {
                if (details.requestHeaders[i].name === "User-Agent") {
                    details.requestHeaders.splice(i, 1);
                    break;
                }
            }
            return { requestHeaders: details.requestHeaders };
        },
        {
            urls: [
                "*://shorte.st/*",
                "*://5k4i.com/*",
                "*://ceesty.com/*",
                "*://clkme.me/*",
                "*://clkmein.com/*",
                "*://cllkme.com/*",
                "*://corneey.com/*",
                "*://destyy.com/*",
                "*://festyy.com/*",
                "*://gestyy.com/*",
                "*://pj45.com/*",
                "*://sh.st/*",
                "*://viid.me/*",
                "*://wiid.me/*",
                "*://xiw34.com/*",
                "*://iklan.master-cyber.com/*",
                "*://links.orgasmatrix.com/*",
                "*://wik34.com/*",
                "*://zryydi.com/*",
                "*://skiip.me/*",
            ],
            types: [
                "main_frame",
                "sub_frame",
            ],
        },
        [
            "blocking",
            "requestHeaders",
        ],
    );
}
