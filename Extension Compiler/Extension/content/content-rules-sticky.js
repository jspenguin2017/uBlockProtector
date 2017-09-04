//Content rules for sticky websites
"use strict";

if (a.domCmp(["socketloop.com"])) {
    a.readOnly("epmads_block", false);
    a.readOnly("DMAds", true);
    a.antiCollapse("innerHTML", (ignored, val) => {
        return !val.trim();
    });
    a.antiCollapse("innerText", (ignored, val) => {
        return !val.trim();
    });
}
if (a.domCmp(["lolalytics.com"])) {
    //https://github.com/AdguardTeam/AdguardFilters/issues/6280
    //https://github.com/AdguardTeam/AdguardFilters/issues/6576
    //https://github.com/uBlockOrigin/uAssets/issues/668
    a.timewarp("setTimeout", a.matchMethod.matchAll, null, 1e9);
    a.readOnly("cookie", undefined, "window.document");
    a.css("div[class] { opacity:1; }");
    a.onBeforeScriptExecute((script, ignored, e) => {
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
