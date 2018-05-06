/**
 * Content rules for sticky websites.
 */
"use strict";

if ((/^anime(?:dao|take)\d*?\.[^.]+$/).test(document.domain)) {
    // These websites use rolling domains to dodge filter rules
    a.beforeScript((script) => {
        if (script.textContent && script.textContent.includes("adblockDetect")) {
            script.remove();
        }
    });
}
if (a.domCmp(["debridnet.com"])) {
    const re = /\.height\(\)/g;
    a.beforeScript((script) => {
        if (script.textContent) {
            script.textContent = script.textContent.replace(re, " && false && 0");
        }
    });
    a.timewarp("setTimeout", a.matchMethod.RegExp, /^\d+000$/, 0.2);
    for (let i = 0; i < 15; i++) {
        const s = document.createElement("script");
        document.documentElement.append(s);
    }
}
