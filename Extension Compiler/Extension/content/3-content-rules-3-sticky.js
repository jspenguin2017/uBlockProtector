//Content rules for sticky websites
"use strict";

if (a.domCmp(["debridnet.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/77
    /*
    a.ready(() => {
        $("script[src*='clksite.com']").parent().text(`Enter a link below and press "Start":`);
    });
    */
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
