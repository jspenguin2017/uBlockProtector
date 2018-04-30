/**
 * Special background script for Firefox.
 */
"use strict";

{
    // https://github.com/jspenguin2017/uBlockProtector/issues/660
    a.dynamicServer(
        [
            "*://*.uplynk.com/preplay/*",
        ],
        [
            "xmlhttprequest",
        ],
        (details) => {
            let payload = "";

            let filter = browser.webRequest.filterResponseData(details.requestId);
            let decoder = new TextDecoder("utf-8");
            let encoder = new TextEncoder();

            filter.ondata = (e) => {
                payload += decoder.decode(e.data, { stream: true });
            };
            filter.onstop = () => {
                try {
                    payload = JSON.parse(payload);
                } catch (err) {
                    filter.write(encoder.encode(payload));
                    filter.disconnect();
                    return;
                }

                //@pragma-if-debug
                if (a.debugMode) {
                    console.log(payload.ads);
                }
                //@pragma-end-if

                payload.ads = {
                    breakOffsets: [],
                    breaks: [],
                    placeholderOffsets: [],
                };

                filter.write(encoder.encode(JSON.stringify(payload)));
                filter.disconnect();
            };
        },
        [
            "fox.com",
        ],
        true,
    );
}
