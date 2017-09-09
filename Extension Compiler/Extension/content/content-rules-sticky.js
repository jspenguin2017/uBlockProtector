//Content rules for sticky websites
"use strict";

if (a.domCmp(["socketloop.com"])) {
    a.readOnly("epmads_block", false);
    a.readOnly("DMAds", true);
    /*
    a.antiCollapse("innerHTML", (ignored, val) => {
        const realVal = val.trim();
        return !realVal || realVal === "<br>";
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
    a.inject(() => {
        "use strict";
        delete window.fetch;
    });
    a.ready(() => {
        a.inject(() => {
            "use strict";
            try {
                window.console.meme(" ", " ", "90's Problems");
            } catch (err) { }
        });
    });
}
/*
if (a.domCmp(["lolalytics.com"])) {
    //https://github.com/AdguardTeam/AdguardFilters/issues/6280
    //https://github.com/AdguardTeam/AdguardFilters/issues/6576
    //https://github.com/uBlockOrigin/uAssets/issues/668
    a.timewarp("setTimeout", a.matchMethod.matchAll, null, 1e9);
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
