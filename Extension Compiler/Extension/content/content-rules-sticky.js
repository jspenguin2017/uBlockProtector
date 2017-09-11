//Content rules for sticky websites
"use strict";

if (a.domCmp(["socketloop.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/366
    a.readOnly("epmads_block", false);
    a.readOnly("DMAds", true);
    a.filter("fetch", a.matchMethod.RegExp, /^(?:http|\/\/)/);
    /*
    a.antiCollapse("innerHTML", (ignored, val) => {
        return !realVal.trim();
    });
    a.antiCollapse("innerText", (ignored, val) => {
        return !val.trim();
    });
    */
    a.replace(() => {
        this.addEventListener("readystatechange", () => {
            if (this.readyState === 4 && this.status !== 200) {
                window.Object.defineProperties(this, {
                    "responseText": {
                        configurable: false,
                        set() { },
                        get() {
                            return "Connection Established";
                        },
                    },
                    "status": {
                        configurable: false,
                        set() { },
                        get() {
                            return 200;
                        },
                    },
                    "statusText": {
                        configurable: false,
                        set() { },
                        get() {
                            return "OK";
                        },
                    },
                });
            }
        });
    });
}
if (a.domCmp(["debridnet.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/77
    /*
    a.ready(() => {
        $("script[src*='clksite.com']").parent().text(`Enter a link below and press "Start":`);
    });
    */
    const re = /\.height\(\)/g;
    a.beforeScript((script) => {
        if (!script.textContent) {
            return;
        }
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
/*
if (a.domCmp(["lolalytics.com"])) {
    //https://github.com/AdguardTeam/AdguardFilters/issues/6280
    //https://github.com/AdguardTeam/AdguardFilters/issues/6576
    //https://github.com/uBlockOrigin/uAssets/issues/668
    a.timewarp("setTimeout", a.matchMethod.matchAll, null, 600000); //Maximum delay is 24.8 days
    a.readOnly("cookie", undefined, "window.document");
    a.css("div[class] { opacity:1; }");
    a.beforeScript((script, ignored, e) => {
        if (script.textContent && script.textContent.includes("XMLHttpRequest")) {
            script.textContent = script.textContent.replace("send(null)", "return");
            e.disconnect();
        }
    });
    a.ready(() => {
        $(".adsbygoogle").each((elem) => {
            elem.append(document.createElement("div"), document.createElement("iframe"));
        });
        let data = [];
        $("style").each((elem) => {
            for (let i = 0; i < elem.sheet.rules.length; i++) {
                try {
                    if (elem.sheet.rules[i].style.opacity.startsWith("0.") &&
                        !data.includes(elem.sheet.rules[i].selectorText)) {
                        data.push(elem.sheet.rules[i].selectorText);
                    }
                } catch (err) { }
            }
        });
        for (let i = 0; i < data.length; i++) {
            a.css(`${data[i]} { opacity:1; }`);
        }
    });
}
*/
