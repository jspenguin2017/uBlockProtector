//Content rules for sticky websites
"use strict";

if (a.debugMode && a.domCmp(["socketloop.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/366
    a.readOnly("epmads_block", true);
    a.readOnly("DMAds", true);
    a.inject(() => {
        "use strict";
        const _fetch = window.fetch;
        const re1 = /^https?:\/\//;
        const re2 = /^https?:\/\/[^/]*socketloop\.com\//;
        const newFunc = (url, ...rest) => {
            if (re1.test(url) && !re2.test(url)) {
                return new window.Promise((f) => { f(); });
            } else {
                return _fetch.call(window, url, ...rest);
            }
        };
        window.Object.defineProperty(window, "fetch", {
            configurable: false,
            set() { },
            get() {
                return newFunc;
            },
        });
    });
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
