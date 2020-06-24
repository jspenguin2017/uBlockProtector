// ----------------------------------------------------------------------------------------------------------------- //

// Nano Defender - An anti-adblock defuser
// Copyright (C) 2016-2019  Nano Defender contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------------------------------------------------------------------------------------- //

// Core library for content rules

// ----------------------------------------------------------------------------------------------------------------- //

"use strict";

// ----------------------------------------------------------------------------------------------------------------- //

a.uBOExtraExcluded = false;

a.isTopFrame = (() => {
    try {
        // This can throw
        return window.self === window.top;
    } catch (err) {
        return false;
    }
})();

// ----------------------------------------------------------------------------------------------------------------- //

a.init = () => {
    console.log(`[Nano] Nano Defender Activated :: ${document.domain}`);
};

// ----------------------------------------------------------------------------------------------------------------- //

a.strEscape = (() => {
    const re = /"/g;
    return (str) => str.replace(re, '\\"');
})();

a.err = (name) => {
    if (name)
        console.error(`[Nano] Generic Solution Triggered :: ${name}`);
    else
        console.error("[Nano] Specific Solution Triggered");
};

a.domCmp = (domList, noErr = false) => {
    for (let i = 0; i < domList.length; i++) {
        if (
            document.domain.endsWith(domList[i]) &&
            (
                document.domain.length === domList[i].length ||
                document.domain.charAt(document.domain.length - domList[i].length - 1) === "."
            )
        ) {
            if (!noErr)
                a.err();
            return true;
        }
    }
    return false;
};

a.domInc = (domList, noErr = false) => {
    for (let i = 0; i < domList.length; i++) {
        const index = document.domain.lastIndexOf(domList[i] + ".");
        if (index > 0 && document.domain.charAt(index - 1) !== ".")
            continue;
        if (index > -1) {
            if (!document.domain.substring(index + domList[i].length + 1).includes(".")) {
                if (!noErr)
                    a.err();
                return true;
            }
        }
    }
    return false;
};

// http://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-parameters
a.serialize = (obj) => {
    let str = "";
    for (const key in obj) {
        if (str !== "")
            str += "&";
        str += `${key}=${encodeURIComponent(obj[key])}`;
    }
    return str;
};

a.uid = (() => {
    let counter = 0;
    return () => {
        const chars = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let str = "";
        for (let i = 0; i < 10; i++)
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        return str + (counter++).toString();
    };
})();

// ----------------------------------------------------------------------------------------------------------------- //

a.on = (...args) => {
    addEventListener(...args);
};

a.ready = (...args) => {
    addEventListener("DOMContentLoaded", ...args);
};

a.always = (...args) => {
    args[0]();
    a.on("DOMContentLoaded", ...args);
    a.on("load", ...args);
};

// ----------------------------------------------------------------------------------------------------------------- //

// Send privileged XMLHttpRequest, ignores CORS and adblocker filtering
//
// Details:
//
// method   : string - Method of the request, usually "GET" or "POST"
// url      : string - URL of the request
// headers? : Object - Headers of the request
// payload? : string - Payload of the request
a.request = (details, onload, onerror) => {
    chrome.runtime.sendMessage({
        cmd: "xhr",
        details: details,
    }, (response) => {
        if (chrome.runtime.lastError)
            return void onerror();

        if (response === null)
            onerror();
        else
            onload(response);
    });
};

// ----------------------------------------------------------------------------------------------------------------- //

a.matchMethod = {
    matchAll: 0,
    string: 1,
    stringExact: 2,
    RegExp: 3,
    callback: 4,
};

a.getMatcher = (method, filter) => {
    switch (method) {
        case a.matchMethod.string:
            return `(args) => {
                for (let i = 0; i < args.length; i++) {
                    if (String(args[i]).includes("${a.strEscape(filter)}")) {
                        return true;
                    }
                }
                return false;
            }`;

        case a.matchMethod.stringExact:
            return `(args) => {
                for (let i = 0; i < args.length; i++) {
                    if ("${a.strEscape(filter)}" === String(args[i])) {
                        return true;
                    }
                }
                return false;
            }`;

        case a.matchMethod.RegExp:
            return `(args) => {
                const matcher = ${filter};
                for (let i = 0; i < args.length; i++) {
                    if (matcher.test(String(args[i]))) {
                        return true;
                    }
                }
                return false;
            }`;

        case a.matchMethod.callback:
            return String(filter);

        default:
            return `() => true`;
    }
};

// ----------------------------------------------------------------------------------------------------------------- //

a.inject = (payload, isReady = false) => {
    const s = document.createElement("script");
    s.textContent = isReady ? payload : `(${payload})();`;

    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("[Nano] Failed :: Inject Standalone Script");

        //@pragma-if-debug
        if (a.debugMode)
            console.log(s.textContent);
        //@pragma-end-if
    }
};

// Must be called on document-start
//
// Runtime:
//
// CustomEvent   - The real CustomEvent constructor
// dispatchEvent - The real dispatchEvent function
// execute       - Execute code, ignores Content Security Policy
a.injectWithRuntime = (payload, isReady = false) => {
    const magic = a.uid();
    addEventListener(magic, (e) => {
        a.inject(e.detail, true);
    });

    const runtime = `(() => {
        "use strict";
        const dispatchEvent = window.dispatchEvent.bind(window);
        const CustomEvent = window.CustomEvent.bind(window);
        const execute = (code) => {
            dispatchEvent(new CustomEvent("${magic}", {
                detail: code,
            }));
        };
        ${isReady ? payload : `(${payload})();`}
    })();`;

    const s = document.createElement("script");
    s.textContent = runtime;

    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("[Nano] Failed :: Inject Script With Runtime");

        //@pragma-if-debug
        if (a.debugMode)
            console.log(s.textContent);
        //@pragma-end-if
    }
};

// ----------------------------------------------------------------------------------------------------------------- //

// Callback arguments:
//
// node   - Inserted node
// target - Parent node
// e      - Event object, can be used to disconnect the observer
a.onInsert = (handler) => {
    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            for (let j = 0; j < mutations[i].addedNodes.length; j++)
                handler(mutations[i].addedNodes[j], mutations[i].target, observer);
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};

a.onRemove = (handler) => {
    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            for (let j = 0; j < mutations[i].removedNodes.length; j++)
                handler(mutations[i].removedNodes[j], mutations[i].target, observer);
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};

a.beforeScript = (handler) => {
    a.onInsert((node, target, observer) => {
        if (node.tagName === "SCRIPT")
            handler(node, target, observer);
    });
};

// ----------------------------------------------------------------------------------------------------------------- //

// When stealthy is true, style is only injected from the background page
a.css = (() => {
    const reMatcher = /;/g;
    return (code, stealthy = false) => {
        const payload = code.replace(reMatcher, " !important;");
        chrome.runtime.sendMessage({
            cmd: "inject css",
            data: payload,
        });
        if (!stealthy) {
            const s = document.createElement("style");
            s.textContent = payload;
            document.documentElement.append(s);
        }
    };
})();

// Identifier:
//
// Class : .test
// ID    : #test
a.bait = (type, identifier, hidden) => {
    const elem = document.createElement(type);
    switch (identifier.charAt(0)) {
        case '#':
            elem.id = identifier.substring(1);
            break;
        case '.':
            elem.className = identifier.substring(1);
            break;
    }
    if (hidden)
        elem.style.display = "none";
    elem.innerHTML = "<br>";
    document.documentElement.prepend(elem);
};

// Name   : One of "innerHTML", "innerText", "textContent"
// Filter : Filtering function (different from above)
a.antiCollapse = (name, filter) => {
    let parent;
    switch (name) {
        case "innerHTML":
            parent = "Element";
            break;

        case "innerText":
            parent = "HTMLElement";
            break;

        case "textContent":
            parent = "Node";
            break;

        default:
            parent = "Element";
            break;
    }
    a.inject(`(() => {
        "use strict";
        const handler = ${filter};

        const log = window.console.log.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);
        const String = window.String.bind(window);

        try {
            const descriptor = window.Object.getOwnPropertyDescriptor(window.${parent}.prototype, "${name}");
            const _set = descriptor.set;
            const _get = descriptor.get;
            window.Object.defineProperty(window.${parent}.prototype, "${name}", {
                configurable: false,
                set(val) {
                    //@pragma-if-debug
                    if (${a.debugMode}) {
                        warn("[Nano] Element Modification :: ${name}");
                        log(val);
                    }
                    //@pragma-end-if

                    if (handler(this, String(val))) {
                        error("[Nano] Blocked :: Element Modification");
                    } else {
                        log("[Nano] Allowed :: Element Modification");
                        _set.call(this, val);
                    }
                },
                get() {
                    return _get.call(this);
                },
            });
            log("[Nano] Element Collapse Protection :: ${name}");
        } catch (err) {
            error("[Nano] Failed :: Element Collapse Protection On ${name}");
        }
    })();`, true);
};

// ----------------------------------------------------------------------------------------------------------------- //

// Name           : Name of the function to filter
// Method, Filter : See a.getMatcher
// Parent         : Parent object, use "." to separate levels
a.filter = (name, method, filter, parent = "window") => {
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const matcher = ${a.getMatcher(method, filter)};

        const log = window.console.log.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);

        let parent, original;
        const newFunc = (...args) => {
            //@pragma-if-debug
            if (${a.debugMode}) {
                warn("[Nano] Filtered Function Called :: ${strParent}.${name}");
                for (let i = 0; i < args.length; i++) {
                    log(String(args[i]));
                }
            }
            //@pragma-end-if

            if (matcher(args)) {
                error("[Nano] Blocked :: ${strParent}.${name}");
            } else {
                log("[Nano] Allowed :: ${strParent}.${name}");
                return original.apply(parent, args);
            }
        };

        try {
            parent = ${parent};
            original = ${parent}["${name}"];
            ${parent}["${name}"] = newFunc;
            log("[Nano] Filter Activated :: ${strParent}.${name}");
        } catch (err) {
            error("[Nano] Failed :: Filter On ${strParent}.${name}");
        }
    })();`, true);
};

// Timer : One of "setTimeout", "setInterval"
a.timewarp = (timer, method, filter, ratio = 0.02) => {
    a.inject(`(() => {
        "use strict";
        const matcher = ${a.getMatcher(method, filter)};

        const log = window.console.log.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);

        let original;
        const newFunc = (...args) => {
            //@pragma-if-debug
            if (${a.debugMode}) {
                warn("[Nano] Timer Called :: window.${timer}");
                for (let i = 0; i < args.length; i++) {
                    log(String(args[i]));
                }
            }
            //@pragma-end-if

            if (matcher(args)) {
                error("[Nano] Timewarped");
                args[1] *= ${ratio};
            } else {
                log("[Nano] Not Timewarped");
            }
            return original.apply(window, args);
        };

        try {
            original = window.${timer};
            window.${timer} = newFunc;
            log("[Nano] Timewarp Activated :: window.${timer}");
        } catch (err) {
            error("[Nano] Failed :: Timewarp On window.${timer}!");
        }
    })();`, true);
};

a.readOnly = (name, val, parent = "window") => {
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const val = ${val};
        try {
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set() { },
                get() {
                    return val;
                },
            });

            //@pragma-if-debug
            if (${a.debugMode}) {
                window.console.log("[Nano] Read-only Property :: ${strParent}.${name}");
            }
            //@pragma-end-if
        } catch (err) {
            window.console.error("[Nano] Failed :: Read-only Property ${strParent}.${name}");
        }
    })();`, true);
};

a.noAccess = (name, parent = "window") => {
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const err = new window.Error("[Nano] Blocked :: Property Access");

        //@pragma-if-debug
        const Error = window.Error.bind(window);
        //@pragma-end-if

        const throwErr = () => {
            //@pragma-if-debug
            if (${a.debugMode}) {
                throw new Error("[Nano] Blocked :: Property Access");
            }
            //@pragma-end-if

            throw err;
        };
        try {
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set: throwErr,
                get: throwErr,
            });

            //@pragma-if-debug
            if (${a.debugMode}) {
                window.console.log("[Nano] Non-accessible Property :: ${strParent}.${name}");
            }
            //@pragma-end-if
        } catch (err) {
            window.console.error("[Nano] Failed :: Non-accessible Property ${strParent}.${name}");
        }
    })();`, true);
};

// Chain : Property chain, use "." to separate levels, do not include "window"
a.noAccessExt = (chain) => {
    chain = a.strEscape(chain);
    a.inject(`(() => {
        //Based on uAssets
        //License: https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE
        "use strict";
        const error = window.console.error.bind(window.console);
        const err = new window.Error("[Nano] Blocked :: Property Access");
        const Object = window.Object.bind(window);
        const descriptor = window.Object.getOwnPropertyDescriptor.bind(window.Object);
        const define = window.Object.defineProperty.bind(window.Object);

        //@pragma-if-debug
        const Error = window.Error.bind(window);
        //@pragma-end-if

        const throwErr = () => {
            //@pragma-if-debug
            if (${a.debugMode}) {
                throw new Error("[Nano] Blocked :: Property Access");
            }
            //@pragma-end-if

            throw err;
        };
        let trustedSetters = {};

        const proxy = (parent, chain) => {
            const i = chain.indexOf(".");
            if (i === -1) {
                const current = descriptor(parent, chain);
                if (!current || current.set !== throwErr || current.get !== throwErr) {
                    define(parent, chain, {
                        configurable: false,
                        set: throwErr,
                        get: throwErr,
                    });
                }
            } else {
                const name = chain.slice(0, i);
                let val = parent[name];
                chain = chain.substring(i + 1);
                if (val instanceof Object) {
                    proxy(val, chain);
                } else {
                    const current = descriptor(parent, name);
                    if (!current || !trustedSetters[chain] || trustedSetters[chain] !== current.set) {
                        const setter = (value) => {
                            if (value instanceof Object) {
                                try {
                                    proxy(value, chain);
                                    val = value;
                                } catch (err) {
                                    error("[Nano] Failed :: Refresh Non-accessible Property ${chain}");
                                }
                            }
                        };
                        trustedSetters[chain] = setter;
                        define(parent, name, {
                            configurable: false,
                            set: setter,
                            get() { return val; },
                        });
                    }
                }
            }
        };

        try {
            proxy(window, "${chain}");
            window.console.log("[Nano] Non-accessible Property :: ${chain}");
        } catch (err) {
            error("[Nano] Failed :: Non-accessible Property ${chain}");
        }
    })();`, true);
};

// ----------------------------------------------------------------------------------------------------------------- //

a.params = () => {
    const url = new URL(document.location);
    return url.searchParams;
};

a.redirectToParam = (key) => {
    const params = a.params();
    const href = params.get(key);
    if (typeof href === "string") {
        stop();
        try {
            location.href = href;
        } catch (err) {
            console.error("[Nano] Failed :: Redirect To Param");
        }
    }
};

// Omit value to get cookie
a.cookie = (key, val, time = 31536000000, path = "/") => {
    if (val === undefined) {
        // Get mode
        const cookies = document.cookie;
        const i = cookies.indexOf(`${key}=`);
        const j = cookies.indexOf(";", i);
        if (i === -1) {
            return null;
        } else {
            if (j === -1)
                return cookies.substring(i + key.length + 1);
            else
                return cookies.substring(i + key.length + 1, j);
        }
    } else {
        // Set mode
        const expire = new Date();
        expire.setTime(expire.getTime() + time);
        document.cookie = `${key}=${encodeURIComponent(val)};expires=${expire.toGMTString()};path=${path}`;
    }
};

a.loopbackXHR = (server) => {
    a.inject(`(() => {
        "use strict";
        const server = ${server};
        let original;
        const newXHR = function (...args) {
            const wrapped = new (window.Function.prototype.bind.apply(original, args));
            const _open = wrapped.open;
            wrapped.open = function (...args) {
                const data = server(...args);
                if (typeof data === "string") {
                    window.Object.defineProperties(this, {
                        "responseText": {
                            configurable: false,
                            set() { },
                            get() {
                                return data;
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
                return _open.apply(wrapped, args);
            };
            return wrapped;
        };
        try {
            original = window.XMLHttpRequest;
            window.XMLHttpRequest = newXHR;
        } catch (err) {
            window.console.error("[Nano] Failed :: XMLHttpRequest Loopback Engine");
        }
    })();`, true);
};

// Runtime:
//
// this
// method
// url
// isAsync
// user
// passwd
// rest    : Array, includes isAsync onwards
// replace : Call to replace payload
//           this, payload string
a.replaceXHR = (handler) => {
    a.inject(`(() => {
        "use strict";
        const replace = (that, text) => {
            window.Object.defineProperty(that, "responseText", {
                configurable: false,
                set() { },
                get() {
                    return text;
                },
            });
            window.Object.defineProperty(that, "response", {
                configurable: false,
                set() { },
                get() {
                    return text;
                },
            });
        };
        try {
            const _open = window.XMLHttpRequest.prototype.open;
            window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                const [isAsync, user, passwd] = rest;
                (${handler})();
                return _open.call(this, method, url, ...rest);
            };
        } catch (err) {
            window.console.error("[Nano] Failed :: XMLHttpRequest Replace Engine");
        }
    })();`, true);
};

a.close = () => {
    chrome.runtime.sendMessage({
        cmd: "remove tab",
    });
};

// ----------------------------------------------------------------------------------------------------------------- //

// These functions must be called on document-start

a.generic = () => {

    // ------------------------------------------------------------------------------------------------------------- //

    // Based on generic solutions of Anti-Adblock Killer
    // License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE

    // ------------------------------------------------------------------------------------------------------------- //

    // document-start

    // FuckAdBlock
    a.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
    a.generic.FuckAdBlock("KillAdBlock", "killAdBlock");
    // People customize this too much, and is causing problems
    // a.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");

    // ads.js v1
    a.readOnly("canRunAds", true);
    a.readOnly("canShowAds", true);
    a.readOnly("isAdBlockActive", false);

    // ------------------------------------------------------------------------------------------------------------- //

    // document-end

    a.ready(() => {
        // AdBlock Alerter (WP)
        if ($("div.adb_overlay > div.adb_modal_img").length) {
            $("div.adb_overlay").remove();
            a.css("html, body { height:auto; overflow:auto; }");
            a.err("AdBlock Alerter");
        }

        // Generic block screens
        {
            const elem = document.getElementById("blockdiv");
            if (
                elem &&
                elem.innerHTML === "disable ad blocking or use another browser without any adblocker when you visit"
            ) {
                elem.remove();
                console.error("[Nano] Generic Solution Triggered :: Generic Block Screens");
            }
        }
    });

    // ------------------------------------------------------------------------------------------------------------- //

    // on-insert

    // No-Adblock
    const re1 = /^[a-z0-9]*$/;

    // StopAdBlock
    const re2 = /^a[a-z0-9]*$/;

    // AntiAdblock (Packer)
    const reIframeId = /^(?:z|w)d$/;
    const reImgId = /^(?:x|g)d$/;
    const reImgSrc = /\/ads\/banner\.jpg/;
    const reIframeSrc = /\/adhandler\/|\/adimages\/|ad\.html/;

    const onInsertHandler = (insertedNode) => {
        // No-Adblock
        if (
            insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 4 &&
            re1.test(insertedNode.id) &&
            insertedNode.firstChild &&
            insertedNode.firstChild.id &&
            insertedNode.firstChild.id === insertedNode.id &&
            insertedNode.innerHTML.includes("no-adblock.com")
        ) {
            insertedNode.remove();
            a.err("No-Adblock");
        }

        // StopAdblock
        if (
            insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 7 &&
            re2.test(insertedNode.id) &&
            insertedNode.parentNode &&
            insertedNode.parentNode.id &&
            insertedNode.parentNode.id === insertedNode.id + "2" &&
            insertedNode.innerHTML.includes("stopadblock.org")
        ) {
            insertedNode.remove();
            a.err("StopAdblock");
        }

        // AntiAdblock (Packer)
        if (
            insertedNode.id &&
            reImgId.test(insertedNode.id) &&
            insertedNode.nodeName === "IMG" &&
            reImgSrc.test(insertedNode.src) ||
            insertedNode.id &&
            reIframeId.test(insertedNode.id) &&
            insertedNode.nodeName === "IFRAME" &&
            reIframeSrc.test(insertedNode.src)
        ) {
            insertedNode.remove();
            a.err("AntiAdblock");
        }
    };
    a.onInsert(onInsertHandler);

    // ------------------------------------------------------------------------------------------------------------- //

    a.inject(() => {

        // --------------------------------------------------------------------------------------------------------- //

        "use strict";

        // --------------------------------------------------------------------------------------------------------- //

        const data = {};

        const error = window.console.error.bind(window.console);

        const err = (name) => {
            error(`[Nano] Generic Solution Triggered :: ${name}`);
        };

        // --------------------------------------------------------------------------------------------------------- //

        // document-start

        // AdBlocker Detector
        window.$tieE3 = true;

        // AdBlock Notify
        try {
            let val;

            let isEvil = false;

            const anErr = new window.Error("[Nano] Generic Solution Triggered :: AdBlock Notify");

            window.Object.defineProperty(window, "anOptions", {
                configurable: true, // Important
                set(arg) {
                    try {
                        if (
                            typeof arg === "object" && arg !== null &&
                            arg.anAlternativeText !== undefined &&
                            arg.anOptionAdsSelectors !== undefined &&
                            arg.anOptionChoice !== undefined &&
                            arg.anOptionModalShowAfter !== undefined &&
                            arg.anOptionModalclose !== undefined &&
                            arg.anSiteID !== undefined &&
                            arg.modalHTML !== undefined
                        ) {
                            isEvil = true;
                            return;
                        }
                    } catch (err) { }
                    val = arg;
                },
                get() {
                    if (isEvil)
                        throw anErr;
                    else
                        return val;
                },
            });
        } catch (err) {
            error("[Nano] Failed :: AdBlock Notify Defuser");
        }

        // --------------------------------------------------------------------------------------------------------- //

        // document-end

        window.addEventListener("DOMContentLoaded", () => {
            // AdBlock Detector (XenForo Rellect)
            if (
                typeof window.XenForo === "object" && window.XenForo !== null &&
                typeof window.XenForo.rellect === "object"
            ) {
                window.XenForo.rellect = {
                    AdBlockDetector: {
                        start() { },
                    },
                };
                err("XenForo");
            }

            // Adbuddy
            if (typeof window.closeAdbuddy === "function") {
                window.closeAdbuddy();
                err("Adbuddy");
            }

            // Antiblock.org v2
            try {
                const re = /^#([a-z0-9]{4,10}) ~ \* \{ display: none; \}/;
                const styles = window.document.querySelectorAll("style");
                outmost: for (let i = 0; i < styles.length; i++) {
                    const style = styles[i];
                    const cssRules = style.sheet.cssRules;
                    for (var j = 0; j < cssRules.length; j++) {
                        const cssRule = cssRules[j];
                        const cssText = cssRule.cssText;
                        if (re.test(cssText)) {
                            const id = re.exec(cssText)[1];
                            const scripts = window.document.querySelectorAll("script");
                            for (let k = 0; k < scripts.length; k++) {
                                if (scripts[k].textContent.includes(`w.addEventListener('load',${id},false)`)) {
                                    data.abo2 = id;
                                    err("Antiblock.org v2");
                                    break outmost;
                                }
                            }
                        }
                    }
                }
            } catch (err) { }

            // BetterStopAdblock, Antiblock.org v3, and Legacy BlockAdBlock
            {
                const re = /^[a-z0-9]{4,12}$/i;
                for (let prop in window) {
                    try {
                        if (
                            !prop.startsWith("webkit") &&
                            prop !== "document" &&
                            re.test(prop) &&
                            window[prop] instanceof window.HTMLDocument === false &&
                            window.hasOwnProperty(prop) &&
                            typeof window[prop] === "object" && window[prop] !== null
                        ) {
                            const method = window[prop];

                            // BetterStopAdblock and Antiblock.org v3
                            if (
                                method.deferExecution &&
                                method.displayMessage &&
                                method.getElementBy &&
                                method.getStyle &&
                                method.insert &&
                                method.nextFunction
                            ) {
                                if (method.toggle) {
                                    data.bsa = prop;
                                    err("BetterStopAdblock");
                                } else {
                                    data.abo3 = prop;
                                    err("Antiblock.org v3");
                                }
                                window[prop] = null;
                            }

                            // Legacy BlockAdBlock
                            BlockAdBlock: {
                                // https://github.com/jspenguin2017/uBlockProtector/issues/321
                                if (method.length)
                                    break BlockAdBlock;

                                let keyLen = 0;
                                let hasBab = false;
                                let keyCount = 0;

                                for (let k in method) {
                                    if (k.length === 10) {
                                        keyLen += k.length;
                                    } else if (k === "bab") {
                                        hasBab = true;
                                    } else {
                                        break BlockAdBlock;
                                    }

                                    if (keyLen > 30) {
                                        break BlockAdBlock;
                                    }

                                    keyCount += 1;

                                    if (keyCount > 3) {
                                        break BlockAdBlock;
                                    }
                                }

                                if (hasBab) {
                                    keyLen += 10;
                                }

                                if (keyLen === 30 && keyCount === 3) {
                                    window[prop] = null;
                                    err("BlockAdBlock");
                                }
                            }
                        }
                    } catch (err) { }
                }
            }
        });

        // --------------------------------------------------------------------------------------------------------- //

        // on-insert

        // Antiblock.org (all version) and BetterStopAdblock
        const reMsgId = /^[a-z0-9]{4,10}$/i;
        const reTag1 = /^(?:div|span|b|i|font|strong|center)$/i;
        const reTag2 = /^(?:a|b|i|s|u|q|p|strong|center)$/i;
        const reWords1 = new window.RegExp("ad blocker|ad block|ad-block|adbl" +
            "ocker|ad-blocker|adblock|bloqueur|bloqueador|Werbeblocker|adbloc" +
            "kert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#" +
            "1587;|блокировщиком", "i");
        const reWords2 = new window.RegExp("kapat|disable|désactivez|désactiv" +
            "er|desactivez|desactiver|desative|desactivar|desactive|desactiva" +
            "|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#" +
            "947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1" +
            "087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|public" +
            "ités|рекламе|verhindert|advert|kapatınız", "i");

        // Adunblock
        const reId = /^[a-z]{8}$/;
        const reClass = /^[a-z]{8} [a-z]{8}/;
        const reBg = /^[a-z]{8}-bg$/;

        const onInsertHandler = (insertedNode) => {
            // Antiblock.org (all version) and BetterStopAdblock
            if (
                insertedNode.parentNode &&
                insertedNode.id &&
                insertedNode.style &&
                insertedNode.childNodes.length &&
                insertedNode.firstChild &&
                !insertedNode.firstChild.id &&
                !insertedNode.firstChild.className &&
                reMsgId.test(insertedNode.id) &&
                reTag1.test(insertedNode.nodeName) &&
                reTag2.test(insertedNode.firstChild.nodeName)
            ) {
                const audio = insertedNode.querySelector("audio[loop]");

                if (audio) {
                    audio.pause();
                    audio.remove();
                    err("Antiblock.org");
                } else if (
                    data.abo2 && insertedNode.id === data.abo2 ||
                    (
                        insertedNode.firstChild.hasChildNodes() &&
                        reWords1.test(insertedNode.firstChild.innerHTML) &&
                        reWords2.test(insertedNode.firstChild.innerHTML)
                    )
                ) {
                    insertedNode.remove();
                    err("Antiblock.org v2");
                } else if (
                    data.abo3 && insertedNode.id === data.abo3 ||
                    (
                        insertedNode.firstChild.hasChildNodes() &&
                        insertedNode.firstChild.firstChild.nodeName === "IMG" &&
                        insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64")
                    )
                ) {
                    window[data.abo3] = null;
                    insertedNode.remove();
                    err("Antiblock.org v3");
                } else if (data.bsa && insertedNode.id === data.bsa) {
                    window[data.bsa] = null;
                    insertedNode.remove();
                    err("BetterStopAdblock");
                }
            }

            // Adunblock
            if (
                window.vtfab !== undefined &&
                window.adblock_antib !== undefined &&
                insertedNode.parentNode &&
                insertedNode.parentNode.nodeName === "BODY" &&
                insertedNode.id &&
                reId.test(insertedNode.id) &&
                insertedNode.nodeName === "DIV" &&
                insertedNode.nextSibling &&
                insertedNode.nextSibling.className &&
                insertedNode.nextSibling.nodeName === "DIV"
            ) {
                if (
                    insertedNode.className &&
                    reClass.test(insertedNode.className) &&
                    reBg.test(insertedNode.nextSibling.className) &&
                    insertedNode.nextSibling.style &&
                    insertedNode.nextSibling.style.display !== "none"
                ) {
                    // Full Screen Message (Premium)
                    insertedNode.nextSibling.remove();
                    insertedNode.remove();
                    a.err("Adunblock Premium");
                } else if (
                    insertedNode.nextSibling.id &&
                    reId.test(insertedNode.nextSibling.id) &&
                    insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")
                ) {
                    // Top bar Message (Free)
                    insertedNode.remove();
                    a.err("Adunblock Free");
                }
            }
        };
        const observer = new window.MutationObserver((mutations) => {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length) {
                    for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                        onInsertHandler(mutations[i].addedNodes[j]);
                    }
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });

        // --------------------------------------------------------------------------------------------------------- //

    });
};

a.generic.FuckAdBlock = (constructorName, instanceName) => {
    a.inject(`(() => {
        "use strict";
        const errMsg = "[Nano] Generic Solution Triggered :: FuckAdBlock";
        const error = window.console.error.bind(window.console);
        const patchedFuckAdBlock = function () {
            // Based on FuckAdBlock
            // License: https://github.com/sitexw/FuckAdBlock/blob/master/LICENSE

            this._callbacks = [];
            window.addEventListener("load", () => {
                this.emitEvent();
            });

            //v3 methods
            this.setOption = () => {
                return this;
            };
            this.check = () => {
                this.emitEvent();
                return true;
            };
            this.emitEvent = () => {
                for (let i = 0; i < this._callbacks.length; i++) {
                    this._callbacks[i]();
                }
                return this;
            };
            this.clearEvent = () => {
                this._callbacks = [];
            };
            this.on = (detected, func) => {
                if (!detected) {
                    this._callbacks.push(func);
                }
                error(errMsg);
                return this;
            };
            this.onDetected = () => {
                error(errMsg);
                return this;
            };
            this.onNotDetected = (func) => {
                return this.on(false, func);
            };

            //v4 methods
            this.debug = {};
            this.debug.set = () => {
                return this;
            };
        };

        const isSafeCall = () => {
            const script = window.document.currentScript;
            if (!script || script.src || !script.textContent) {
                return true;
            }
            if (script.textContent.includes("adBlockDetected") && script.textContent.includes("importFAB.onerror")) {
                return false;
            }
            return true;
        };
        const defuseCDN = (() => {
            let done = false;
            return () => {
                if (done) {
                    return;
                }

                const _createElement = window.document.createElement;
                window.document.createElement = function (name, ...rest) {
                    let element = _createElement.call(this, name, ...rest);
                    if (name === "script") {
                        element.addEventListener("error", (e) => {
                            if (element.src && element.src.startsWith("https://cdnjs.cloudflare.com/ajax/libs/fuckadblock/")) {
                                e.preventDefault();
                                e.stopPropagation();
                                element.onload();
                            }
                        }, true);
                    }
                    return element;
                };

                done = true;
            };
        })();

        try {
            window.Object.defineProperty(window, "${a.strEscape(constructorName)}", {
                configurable: true,
                set() { },
                get() {
                    if (isSafeCall()) {
                        return patchedFuckAdBlock;
                    } else {
                        defuseCDN();
                    }
                },
            });
            const instance = new patchedFuckAdBlock();
            window.Object.defineProperty(window, "${a.strEscape(instanceName)}", {
                configurable: true,
                set() { },
                get() {
                    if (isSafeCall()) {
                        return instance;
                    } else {
                        defuseCDN();
                    }
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: FuckAdBlock Defuser");
        }
    })();`, true);
};

a.generic.Adfly = () => {
    // Based on AdsBypasser
    // License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
    a.inject(() => {
        "use strict";
        const err = new window.ReferenceError("ysmm is not defined");
        const isDigit = /^\d$/;

        const handler = (encodedURL) => {
            if (window.document.body)
                return;

            let var1 = "", var2 = "";
            for (let i = 0; i < encodedURL.length; i++) {
                if (i % 2 === 0)
                    var1 = var1 + encodedURL.charAt(i);
                else
                    var2 = encodedURL.charAt(i) + var2;
            }

            let data = (var1 + var2).split("");
            for (let i = 0; i < data.length; i++) {
                if (isDigit.test(data[i])) {
                    for (let ii = i + 1; ii < data.length; ii++) {
                        if (isDigit.test(data[ii])) {
                            const temp = parseInt(data[i]) ^ parseInt(data[ii]);
                            if (temp < 10)
                                data[i] = temp.toString();

                            i = ii;
                            break;
                        }
                    }
                }
            }

            data = data.join("");
            const decodedURL = window.atob(data).slice(16, -16);

            window.stop();
            window.onbeforeunload = null;
            window.location.href = decodedURL;
        };

        try {
            let val;
            let flag = true;
            window.Object.defineProperty(window, "ysmm", {
                configurable: true,
                set(value) {
                    if (flag) {
                        flag = false;
                        try {
                            if (typeof value === "string")
                                handler(value);
                        } catch (err) { }
                    }
                    val = value;
                },
                get() {
                    if (flag)
                        throw err;
                    else
                        return val;
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: Adfly Skipper");
        }
    });
};

a.generic.AdflyForcedNotification = () => {
    // https://github.com/NanoAdblocker/NanoFilters/issues/370
    a.ready(() => {
        if (location.pathname === "/pushredirect/") {
            const arrow = document.querySelector("body > div.arrow");
            const logo = document.querySelector("body > div.logo-wrapper > img.logo");
            if (arrow !== null && logo !== null) {
                const params = a.params();
                const site = params.get("site");
                const dest = params.get("dest");
                if (site === "adfly" && typeof dest === "string") {
                    stop();
                    try {
                        location.href = dest;
                    } catch (err) {
                        console.error("[Nano] Failed :: Adfly Forced Notification Blocker");
                    }
                }
            }
        }
    });
};

a.generic.app_vars = () => {
    a.inject(() => {
        try {
            let _app_vars;
            window.Object.defineProperty(window, "app_vars", {
                configurable: true,
                set(val) {
                    _app_vars = val;
                    try {
                        window.Object.defineProperty(_app_vars, "disable_adblock", {
                            configurable: true,
                            set() { },
                            get() {
                                return "0";
                            },
                        });
                        window.Object.defineProperty(_app_vars, "force_disable_adblock", {
                            configurable: true,
                            set() { },
                            get() {
                                return "0";
                            },
                        });
                    } catch (err) { }
                },
                get() {
                    return _app_vars;
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: app_vars Defuser");
        }
    });
};

a.generic.CloudflareApps = () => {
    a.inject(() => {
        "use strict";
        try {
            const error = window.console.error.bind(window.console);
            const badApps = new window.Set([
                "RVaR_vPwa0_9", // AdBlock Blocker
                "ngqhM7rZolNP", // AdBlock Minus
            ]);
            let logged = false;
            let value;
            window.Object.defineProperty(window, "CloudflareApps", {
                configurable: true,
                set(arg) {
                    value = arg;
                },
                get() {
                    try {
                        if (value instanceof window.Object && value.installs instanceof window.Object) {
                            for (const val of window.Object.values(value.installs)) {
                                if (val instanceof window.Object && "options" in val && badApps.has(val.appId)) {
                                    window.Object.defineProperty(val, "URLPatterns", {
                                        configurable: true,
                                        get() {
                                            return ["$^"];
                                        },
                                        set() { },
                                    });
                                    if (!logged) {
                                        error("[Nano] Generic Solution Triggered :: Cloudflare Apps");
                                        logged = true;
                                    }
                                }
                            }
                        }
                    } catch (err) { }
                    return value;
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: Cloudflare Apps Defuser");
        }
    });
};

// Deprecated
a.generic.adsjsV2 = (min = 11, max = 14) => {
    a.inject(`(() => {
        "use strict";
        const error = window.console.error.bind(window.console);
        const matcher = /^[a-zA-Z0-9]{${min},${max}}$/;
        const err = new window.TypeError("Failed to execute 'getElementById' on 'Document': " +
            "1 argument required, but only 0 present.");
        let original;
        const newFunc = (...args) => {
            if (args.length) {
                if (matcher.test(String(args[0]))) {
                    let elem = original.apply(window.document, args);
                    if (elem) {
                        return elem;
                    } else {
                        error("[Nano] Generic Solution Triggered :: ads.js v2");
                        return window.document.createElement("div");
                    }
                } else {
                    return original.apply(window.document, args)
                }
            } else {
                throw err;
            }
        };
        try {
            original = window.document.getElementById;
            window.document.getElementById = newFunc;
        } catch (err) {
            error("[Nano] Failed :: ads.js v2 Defuser");
        }
    })();`, true);
};

// ----------------------------------------------------------------------------------------------------------------- //

//@pragma-if-debug

// ----------------------------------------------------------------------------------------------------------------- //

a.trace = (name, parent = "window") => {
    if (!a.debugMode) {
        console.error("a.trace() is only available in debug mode!");
        return;
    }
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const trace = window.console.trace.bind(window.console);
        let val;
        try {
            val = ${parent}["${name}"];
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set(v) {
                    trace("[Nano] SET ${strParent}.${name}", v);
                    val = v;
                },
                get() {
                    trace("[Nano] GET ${strParent}.${name}", val);
                    return val;
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: Trace Property ${strParent}.${name}");
        }
    })();`, true);
};

a.backgroundLog = (log) => {
    if (!a.debugMode) {
        console.error("a.backgroundLog() is only available in debug mode!");
        return;
    }
    chrome.runtime.sendMessage({
        cmd: "log",
        data: log,
    });
};

a.setBenchmarkedInterval = (func, delay, ...args) => {
    if (!a.debugMode) {
        console.error("a.setBenchmarkedInterval() should only be used in debug mode!");
        return setInterval(func, delay, ...args);
    }
    return setInterval(() => {
        const t0 = performance.now();
        func(...args);
        const t1 = performance.now();
        console.log(`[Nano] Benchmark Interval :: ${func.name} Used ${t1 - t0} Milliseconds`);
    }, delay);
};

// ----------------------------------------------------------------------------------------------------------------- //

//@pragma-end-if

// ----------------------------------------------------------------------------------------------------------------- //
