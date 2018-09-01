/**
 * Core library for content rules.
 */
"use strict";


/**
 * Initialization.
 * @function
 */
a.init = () => {
    console.log(`[Nano] Nano Defender Activated :: ${document.domain}`);
};
/**
 * Whether uBO-Extra should not run.
 * @var {boolean}
 */
a.uBOExtraExcluded = false;


/**
 * Escape double quotes in a string.
 * @function
 * @param {string} str - The string to escape.
 * @return {string} The escaped string.
 */
a.strEscape = (() => {
    const re = /"/g;
    return (str) => str.replace(re, `\\"`);
})();
/**
 * Whether this frame is top frame.
 * @const {boolean}
 */
a.isTopFrame = (() => {
    try {
        return window.self === window.top;
    } catch (err) {
        // Top frame not accessible due to security policy
        return false;
    }
})();
/**
 * Shortcut for addEventListener(...args).
 * @const {Function}
 */
a.on = (...args) => { addEventListener(...args); };
/**
 * Shortcut for addEventListener("DOMContentLoaded", ...args).
 * @const {Function}
 */
a.ready = (...args) => { addEventListener("DOMContentLoaded", ...args); }
/**
 * Run a function on document-start, document-end, and document-idle.
 * @function
 * @param {Special} ...args - ...args in addEventListener("...", ...args).
 */
a.always = (...args) => {
    args[0]();
    a.on("DOMContentLoaded", ...args);
    a.on("load", ...args);
};
/**
 * Write an error message to console.
 * @function
 * @param {string} [name=undefined] - The name of the adblocker detector.
 */
a.err = (name) => {
    if (name) {
        console.error(`[Nano] Generic Solution Triggered :: ${name}`);
    } else {
        console.error("[Nano] Specific Solution Triggered");
    }
};
/**
 * Send a highly privileged XMLHttpRequest, it goes though Cross Origin
 * Resource Sharing policies as well as adblocker filtering.
 * @function
 * @param {Object} details - Details about this request.
 ** @param {string} method - The method of the request, usually "GET" or "POST".
 ** @param {string} url - The URL of the request.
 ** @param {Object|undefined} [headers=undefined] - The headers of the request.
 ** @param {string|null} [payload=null] - The payload of the request.
 * @param {Function} onload - The load event handler.
 ** @param {string} response - The response text.
 * @param {Function} onerror - The error event handler.
 */
a.request = (details, onload, onerror) => {
    chrome.runtime.sendMessage({
        cmd: "xhr",
        details: details,
    }, (response) => {
        if (response === null) {
            onerror();
        } else {
            onload(response);
        }
    });
};
/**
 * Check if current domain ends with one of the domains in the list.
 * "example.com" will match domains that matches /(^|.*\.)example\.com$/.
 * @function
 * @param {Array.<string>} domList - The list of domains to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error
 ** message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domCmp = (domList, noErr) => {
    for (let i = 0; i < domList.length; i++) {
        if (
            document.domain.endsWith(domList[i]) &&
            (
                document.domain.length === domList[i].length ||
                document.domain.charAt(document.domain.length - domList[i].length - 1) === '.'
            )
        ) {
            if (!noErr) {
                a.err();
            }
            return true;
        }
    }
    return false;
};
/**
 * Check if current domain includes one of the strings that is in the list.
 * "example" will match domains that matches /(^|.*\.)example\.[^\.]*$/.
 * "git.example" will match domains that matches /(^|.*\.)git\.example\.[^\.]*$/.
 * @function
 * @param {Array.<string>} domList - The list of strings to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error
 ** message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domInc = (domList, noErr) => {
    for (let i = 0; i < domList.length; i++) {
        let index = document.domain.lastIndexOf(domList[i] + ".");
        if (index > 0 && document.domain.charAt(index - 1) !== '.') {
            continue;
        }
        if (index > -1) {
            if (!document.domain.substring(index + domList[i].length + 1).includes(".")) {
                if (!noErr) {
                    a.err();
                }
                return true;
            }
        }
    }
    return false;
};
/**
 * Match methods.
 * @const {Enumeration}
 */
a.matchMethod = {
    /**
     * Match all.
     * @param {undefined|null} [filter=undefined] - The filter.
     */
    matchAll: 0,
    /**
     * Partial string match. Result in match if one of the arguments contains
     * the filter.
     * @param {string} filter - The filter.
     */
    string: 1,
    /**
     * Exact string match. Result in match if one of the arguments is exactly
     * the filter.
     * @param {string} filter - The filter.
     */
    stringExact: 2,
    /**
     * Regular expression based matching, filter.test() will be used to apply
     * matching.
     * @param {RegExp} filter - The filter.
     */
    RegExp: 3,
    /**
     * Callback based matching, the callback function will lose its scope.
     * @param {Function} filter - The callback function.
     */
    callback: 4,
};
/**
 * Get a matcher function, the filter will be "hard coded" into it.
 * @function
 * @param {Enumeration} method - The method to use.
 * @param {undefined|null|string|RegExp|Function} filter - An appropriate
 ** filter.
 * @return {string} A matcher function.
 */
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
/**
 * Inject a standalone script to the page.
 * @function
 * @param {string|Function} payload - The script to inject.
 * @param {boolean} [isReady=false] - Set this to true if the payload does not
 ** need a execution wrapper.
 */
a.inject = (payload, isReady) => {
    let s = document.createElement("script");
    s.textContent = isReady ? payload : `(${payload})();`;
    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("[Nano] Failed :: Inject Standalone Script");
        //@pragma-if-debug
        if (a.debugMode) {
            console.log(s.textContent);
        }
        //@pragma-end-if
    }
};
/**
 * Similar to a.inject(), but the injected code is enclosed in a wrapper that
 * have some rumtime functions.
 * Must be called on document-start to ensure security.
 * @function
 * @param {string|Function} payload - The script to inject.
 * @param {boolean} [isReady=false] - Set this to true if the payload does not
 ** need a execution wrapper.
 * @runtime dispatchEvent, CustomEvent
 ** The real dispatchEvent and CustomEvent, useful when you need custom
 ** messaging.
 * @runtime execute
 ** Run code ignoring Content Security Policy.
 ** @function
 ** @param {string} code - The code to execute, must already have execution
 *** wrapper if it needs one. The execution will be done on the next tick,
 *** which makes it not truly synchronous.
 */
a.injectWithRuntime = (payload, isReady) => {
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

    let s = document.createElement("script");
    s.textContent = runtime;
    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("[Nano] Failed :: Inject Script With Runtime");
        //@pragma-if-debug
        if (a.debugMode) {
            console.log(s.textContent);
        }
        //@pragma-end-if
    }
};
/**
 * Serialize an object into GET request parameters.
 * Source: http://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-parameters
 * @function
 * @param {Object} obj - The object to serialize, can be at most 1 level deep.
 * @return {string} The serialized string.
 */
a.serialize = (obj) => {
    let str = "";
    for (let key in obj) {
        if (str !== "") {
            str += "&";
        }
        str += `${key}=${encodeURIComponent(obj[key])}`;
    }
    return str;
};
/**
 * Returns an unique ID which is also a valid variable name.
 * @function
 * @return {string} The unique ID.
 */
a.uid = (() => {
    let counter = 0;
    return () => {
        const chars = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let str = "";
        for (let i = 0; i < 10; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str + (counter++).toString();
    };
})();
/**
 * Set up DOM insert observer.
 * @function
 * @param {Function} handler - The mutation handler.
 ** @param {HTMLElement} insertedNode - The inserted node.
 ** @param {HTMLElement} target - The parent of the inserted node.
 ** @param {MutationObserver} e - The observer object, call disconnect on it to
 *** stop observing.
 */
a.onInsert = (handler) => {
    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                handler(mutations[i].addedNodes[j], mutations[i].target, observer);
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};
/**
 * Set up DOM remove observer.
 * @function
 * @param {Function} handler - The mutation handler.
 ** @param {HTMLElement} removedNode - The removed node.
 ** @param {HTMLElement} target - The parent of the removed node.
 ** @param {MutationObserver} e - The observer object, call disconnect on it
 *** to stop observing.
 */
a.onRemove = (handler) => {
    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            for (let j = 0; j < mutations[i].removedNodes.length; j++) {
                handler(mutations[i].removedNodes[j], mutations[i].target, observer);
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};
/**
 * Set up script execution observer.
 * Can only interfere execution of scripts hard coded into the main document.
 * @function
 * @param {Function} handler - The event handler.
 ** @param {HTMLScriptElement} script - The script that is about to be executed,
 *** it may not have its final textContent.
 ** @param {HTMLElement} parent - The parent node of this script.
 ** @param {MutationObserver} e - The observer object, call disconnect on it to
 *** stop observing.
 */
a.beforeScript = (handler) => {
    a.onInsert((node, target, observer) => {
        if (node.tagName === "SCRIPT") {
            handler(node, target, observer);
        }
    });
};


/**
 * Inject CSS, "!important" will be added automatically.
 * @function
 * @param {string} code - The CSS to inject.
 * @param {boolean} [stealthy=false] - Whether the style should only be
 ** injected from background page only, this will not carete a style element,
 ** but the injected style have a lower priority. The injection from background
 ** is asynchronous.
 */
a.css = (() => {
    const reMatcher = /;/g;
    return (code, stealthy) => {
        const payload = code.replace(reMatcher, " !important;");
        chrome.runtime.sendMessage({
            cmd: "inject css",
            data: payload,
        });
        if (!stealthy) {
            let s = document.createElement("style");
            s.textContent = payload;
            document.documentElement.append(s);
        }
    };
})();
/**
 * Add a bait element, this sometimes has a side effect that adds an empty bar
 * on top of the page.
 * Sometimes the height of the bait element is checked, so I cannot make it 0
 * height.
 * @function
 * @param {string} type - The type of the element, example: div
 * @param {string} identifier - The class or id, examples:
 ** Class: .test
 ** ID: #test
 * @param {boolean} [hidden=false] - Whether the element should be hidden.
 */
a.bait = (type, identifier, hidden) => {
    let elem = document.createElement(type);
    switch (identifier.charAt(0)) {
        case '#':
            elem.id = identifier.substring(1);
            break;
        case '.':
            elem.className = identifier.substring(1);
            break;
    }
    if (hidden) {
        elem.style.display = "none";
    }
    elem.innerHTML = "<br>";
    document.documentElement.prepend(elem);
};
/**
 * Filter a function, should be called on document-start.
 * @function
 * @param {string} name - The name of the function.
 * @param {Enumeration} [method=a.matchMethod.matchAll] - An option from
 ** a.matchMethods, omit or pass null defaults to match all.
 * @param {Many} filter - The filter to apply, this must be appropriate for the
 ** method.
 * @param {string} [parent="window"] - The name of the parent object, use "."
 ** or bracket notation to separate layers. The parent must exist.
 */
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
/**
 * Filter assignment of innerHTML, innerText, or textContent. Should be called
 * on document-start.
 * @function
 * @param {string} name - The name of the property to filter, can be
 ** "innerHTML", "innerText", or "textContent".
 * @param {Function} filter - The filter function. Use closure and self
 ** execution if you need to initialize.
 ** @param {HTMLElement} elem - The target element.
 ** @param {string} val - The value that is set.
 ** @return {boolean} True to block the assignment, false to allow.
 */
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
/**
 * Change the execution delay for setTimeout or setInterval, should be called
 * on document-start.
 * @function
 * @param {string} timer - The name of the timer to patch, can be "setTimeout"
 ** or "setInterval".
 * @param {Enumeration} [method=method=a.matchMethod.matchAll] - An option from
 ** a.matchMethods, omit or pass null defaults to match all.
 * @param {Many} filter - The filter to apply, this must be appropriate for the
 ** method.
 * @param {float} [ratio=0.02] - The boost ratio, between 0 and 1 for speed up,
 ** larger than 1 for slow down, defaults to speed up 50 times.
 */
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
/**
 * Defines a read-only property, should be called on document-start.
 * May not be able to lock the property's own properties.
 * @function
 * @param {string} name - The name of the property to define.
 * @param {Any} val - The value to set, must have extra quotes if it is a
 ** literal string. If it is a funciton, it will lose its scope, if it is an
 ** object, you are responsible in making it into a string.
 * @param {string} [parent="window"] - The name of the parent object, use "."
 ** or bracket notation to separate layers. The parent must exist.
 */
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
/**
 * Defines a non-accessible property, should be called on document-start.
 * @function
 * @param {string} name - The name of the property to define.
 * @param {string} [parent="window"] - The name of the parent object, use "."
 ** or bracket notation to separate layers. The parent must exist.
 */
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
/**
 * Similar to a.noAccess(), but with a more complicated property looping logic.
 * @function
 * @param {string} chain - The property chain, use "." to separate layers. Do
 ** not include "window".
 */
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
/**
 * Set or get a cookie.
 * @function
 * @param {string} key - The key of the cookie.
 * @param {string} [val=undefined] - The value to set, omit this to get the
 ** cookie.
 * @param {integer} [time=31536000000] - In how many milliseconds will it
 ** expire, defaults to 1 year.
 * @param {string} [path="/"] - The path to set.
 * @return {string|null|undefined} The value of the cookie, null will be
 ** returned if the cookie does not exist, and undefined will be returned in
 ** set mode.
 */
a.cookie = (key, val, time = 31536000000, path = "/") => {
    if (val === undefined) {
        //Get mode
        const cookies = document.cookie;
        const i = cookies.indexOf(`${key}=`);
        const j = cookies.indexOf(";", i);
        if (i === -1) {
            return null;
        } else {
            if (j === -1) {
                //Goes to the end
                return cookies.substring(i + key.length + 1);
            } else {
                return cookies.substring(i + key.length + 1, j);
            }
        }
    } else {
        //Set mode
        let expire = new Date();
        expire.setTime(expire.getTime() + time);
        document.cookie = `${key}=${encodeURIComponent(val)};expires=${expire.toGMTString()};path=${path}`;
    }
};
/**
 * Install XMLHttpRequest loopback engine. Should be called once on
 * document-start if needed.
 * The request will always be sent so event handlers can be triggered.
 * Depending on the website, a background redirect may also be required.
 * @function
 * @param {Function} server - The loopback server.
 ** @param {Any} ...args - The arguments supplied to open.
 ** @return {string|Any} Return a string to override the result of this request,
 *** return anything else to not interfere.
 */
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
/**
 * Install XMLHttpRequest replace engine. Should be called once on
 * document-start if needed.
 * @function
 * @param {Function} handler - The replace handler, must be an arrow function.
 * @runtime this, method, url, isAsync, user, passwd, ...rest
 ** Keyword this and arguments passed to XMLHttpRequest.prototype.open().
 ** Keep in mind that the array rest includes isAsync, user, and passwd.
 * @runtime replace
 ** Replace payload.
 ** @function
 ** @param {This} that - The keyword this.
 ** @param {string} text - The new payload.
 */
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
/**
 * Forcefully close the current tab. This is asynchronous.
 * @function
 */
a.close = () => {
    chrome.runtime.sendMessage({
        cmd: "remove tab",
    });
};


/**
 * Apply generic solutions, call once on document-start if needed.
 * @function
 */
a.generic = () => {
    // Based on generic solutions of Anti-Adblock Killer, modified to fit my API
    // License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE


    // document-start
    // FuckAdBlock
    // a.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");
    a.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
    a.generic.FuckAdBlock("KillAdBlock", "killAdBlock");
    // ads.js v1
    a.readOnly("canRunAds", true);
    a.readOnly("canShowAds", true);
    a.readOnly("isAdBlockActive", false);

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
            if (elem && elem.innerHTML === "disable ad blocking or use another browser without any adblocker when you visit") {
                elem.remove();
                console.error("[Nano] Generic Solution Triggered :: Generic Block Screens");
            }
        }
    });

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
        if (insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 4 &&
            re1.test(insertedNode.id) &&
            insertedNode.firstChild &&
            insertedNode.firstChild.id &&
            insertedNode.firstChild.id === insertedNode.id &&
            insertedNode.innerHTML.includes("no-adblock.com")) {

            insertedNode.remove();
            a.err("No-Adblock");
        }
        // StopAdblock
        if (insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 7 &&
            re2.test(insertedNode.id) &&
            insertedNode.parentNode &&
            insertedNode.parentNode.id &&
            insertedNode.parentNode.id === insertedNode.id + "2" &&
            insertedNode.innerHTML.includes("stopadblock.org")) {

            insertedNode.remove();
            a.err("StopAdblock");
        }
        // AntiAdblock (Packer)
        if (insertedNode.id &&
            reImgId.test(insertedNode.id) &&
            insertedNode.nodeName === "IMG" &&
            reImgSrc.test(insertedNode.src) ||
            insertedNode.id &&
            reIframeId.test(insertedNode.id) &&
            insertedNode.nodeName === "IFRAME" &&
            reIframeSrc.test(insertedNode.src)) {

            insertedNode.remove();
            a.err("AntiAdblock");
        }
    };
    a.onInsert(onInsertHandler);


    a.inject(() => {
        "use strict";

        // Initialization
        let data = {};
        const error = window.console.error.bind(window.console);
        const err = (name) => {
            error(`[Nano] Generic Solution Triggered :: ${name}`);
        };

        // document-start
        // Playwire
        // Test link: http://support.playwire.com/article/adblock-detector-demo/
        try {
            const fakeTester = {
                check(f) {
                    err("Playwire");
                    f();
                },
            };
            // Since this is generic I cannot assign it to an object here
            let val;
            window.Object.defineProperty(window, "Zeus", {
                configurable: false,
                set(arg) {
                    val = arg;
                    try {
                        if (val instanceof window.Object && val.AdBlockTester !== fakeTester) {
                            window.Object.defineProperty(val, "AdBlockTester", {
                                configurable: false,
                                set() { },
                                get() {
                                    return fakeTester;
                                },
                            });
                        }
                    } catch (err) { }
                },
                get() {
                    return val;
                },
            });
        } catch (err) {
            error("[Nano] Failed :: Playwire Defuser");
        }
        // AdBlock Notify
        try {
            let val;
            let isEvil = false;
            const anErr = new window.Error("[Nano] Generic Solution Triggered :: AdBlock Notify");
            window.Object.defineProperty(window, "anOptions", {
                configurable: false,
                set(arg) {
                    try {
                        if (arg instanceof window.Object &&
                            arg.anAlternativeText !== undefined &&
                            arg.anOptionAdsSelectors !== undefined &&
                            arg.anOptionChoice !== undefined &&
                            arg.anOptionModalShowAfter !== undefined &&
                            arg.anOptionModalclose !== undefined &&
                            arg.anSiteID !== undefined &&
                            arg.modalHTML !== undefined) {
                            isEvil = true;
                            return;
                        }
                    } catch (err) { }
                    val = arg;
                },
                get() {
                    if (isEvil) {
                        throw anErr;
                    } else {
                        return val;
                    }
                },
            });
        } catch (err) {
            error("[Nano] Failed :: AdBlock Notify Defuser");
        }

        // document-end
        window.addEventListener("DOMContentLoaded", () => {
            // AdBlock Detector (XenForo Rellect)
            if (window.XenForo && typeof window.XenForo.rellect === "object") {
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
            // BetterStopAdblock, Antiblock.org v3, and BlockAdBlock
            {
                const re = /^[a-z0-9]{4,12}$/i;
                for (let prop in window) {
                    try {
                        if (!prop.startsWith("webkit") &&
                            prop !== "document" &&
                            re.test(prop) &&
                            (window[prop] instanceof window.HTMLDocument) === false &&
                            window.hasOwnProperty(prop) &&
                            typeof window[prop] === "object") {
                            const method = window[prop];
                            // BetterStopAdblock and Antiblock.org v3
                            if (method.deferExecution &&
                                method.displayMessage &&
                                method.getElementBy &&
                                method.getStyle &&
                                method.insert &&
                                method.nextFunction) {

                                if (method.toggle) {
                                    data.bsa = prop;
                                    err("BetterStopAdblock");
                                } else {
                                    data.abo3 = prop;
                                    err("Antiblock.org v3");
                                }
                                window[prop] = null;
                            }
                            // BlockAdBlock
                            BlockAdBlock: {
                                // https://github.com/jspenguin2017/uBlockProtector/issues/321
                                // Important, otherwise large arrays chokes this
                                if (method.length) {
                                    break BlockAdBlock;
                                }

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
            if (insertedNode.parentNode &&
                insertedNode.id &&
                insertedNode.style &&
                insertedNode.childNodes.length &&
                insertedNode.firstChild &&
                !insertedNode.firstChild.id &&
                !insertedNode.firstChild.className &&
                reMsgId.test(insertedNode.id) &&
                reTag1.test(insertedNode.nodeName) &&
                reTag2.test(insertedNode.firstChild.nodeName)) {
                const audio = insertedNode.querySelector("audio[loop]");

                if (audio) {
                    audio.pause();
                    audio.remove();
                    err("Antiblock.org");
                } else if ((data.abo2 && insertedNode.id === data.abo2) ||
                    (insertedNode.firstChild.hasChildNodes() &&
                        reWords1.test(insertedNode.firstChild.innerHTML) &&
                        reWords2.test(insertedNode.firstChild.innerHTML))) {

                    insertedNode.remove();
                    err("Antiblock.org v2");
                } else if ((data.abo3 && insertedNode.id === data.abo3) ||
                    (insertedNode.firstChild.hasChildNodes() &&
                        insertedNode.firstChild.firstChild.nodeName === "IMG" &&
                        insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64"))) {

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
            if (window.vtfab !== undefined &&
                window.adblock_antib !== undefined &&
                insertedNode.parentNode &&
                insertedNode.parentNode.nodeName === "BODY" &&
                insertedNode.id &&
                reId.test(insertedNode.id) &&
                insertedNode.nodeName === "DIV" &&
                insertedNode.nextSibling &&
                insertedNode.nextSibling.className &&
                insertedNode.nextSibling.nodeName === "DIV") {
                if (insertedNode.className &&
                    reClass.test(insertedNode.className) &&
                    reBg.test(insertedNode.nextSibling.className) &&
                    insertedNode.nextSibling.style &&
                    insertedNode.nextSibling.style.display !== "none") {

                    // Full Screen Message (Premium)
                    insertedNode.nextSibling.remove();
                    insertedNode.remove();
                    a.err("Adunblock Premium");
                } else if (insertedNode.nextSibling.id &&
                    reId.test(insertedNode.nextSibling.id) &&
                    insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")) {

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
    });
};
/**
 * Create a non-overridable FuckAdBlock constructor and instance that always
 * returns not detected.
 * @function
 * @param {string} constructorName - The name of the constructor.
 * @param {string} instanceName - The name of the instance.
 */
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
/**
 * Setup generic Adfly bypasser, call once on document-start if needed.
 * @function
 */
a.generic.Adfly = () => {
    // Based on AdsBypasser
    // License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
    a.inject(() => {
        "use strict";
        const isDigit = /^\d$/;
        const handler = (encodedURL) => {
            if (window.document.body) {
                return;
            }

            let var1 = "", var2 = "";
            for (let i = 0; i < encodedURL.length; i++) {
                if (i % 2 === 0) {
                    var1 = var1 + encodedURL.charAt(i);
                } else {
                    var2 = encodedURL.charAt(i) + var2;
                }
            }
            let data = (var1 + var2).split("");
            for (let i = 0; i < data.length; i++) {
                if (isDigit.test(data[i])) {
                    for (let ii = i + 1; ii < data.length; ii++) {
                        if (isDigit.test(data[ii])) {
                            const temp = parseInt(data[i]) ^ parseInt(data[ii]);
                            if (temp < 10) {
                                data[i] = temp.toString();
                            }
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
                configurable: false,
                set(value) {
                    if (flag) {
                        flag = false;
                        try {
                            if (typeof value === "string") {
                                handler(value);
                            }
                        } catch (err) { }
                    }
                    val = value;
                },
                get() {
                    return val;
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: Adfly Bypasser");
        }
    });
};
/**
 * Set up app_vars defuser, call once on document-start if needed.
 * @function
 */
a.generic.app_vars = () => {
    a.inject(() => {
        try {
            // const _setInterval = window.setInterval;
            let _app_vars;
            window.Object.defineProperty(window, "app_vars", {
                configurable: true,
                set(val) {
                    _app_vars = val;
                    try {
                        window.Object.defineProperty(_app_vars, "force_disable_adblock", {
                            configurable: true,
                            set() {
                                /*
                                window.setInterval = (func, delay, ...args) => {
                                    if (delay === 1000) {
                                        delay = 50;
                                    }
                                    return _setInterval.call(window, func, delay, ...args);
                                };
                                */
                            },
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
            window.consol.error("[Nano] Failed :: app_vars Defuser");
        }
    });
};
/**
 * Set up ads.js v2 defuser, call once on document-start if needed.
 * This defuser may cause some websites to malfunction.
 * @function
 * @param {integer} [min=11] - The minimum length of bait element ID.
 * @param {integer} [max=14] - The maximum length of bait element ID.
 */
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
/**
 * Set up NoAdBlock defuser, call once on document-start if needed.
 * @function
 */
a.generic.NoAdBlock = () => {
    a.inject(() => {
        "use strict";
        try {
            const error = window.console.error.bind(window.console);
            let needDefuse = true;
            let installs = {};
            window.CloudflareApps = {};
            window.Object.defineProperty(window.CloudflareApps, "installs", {
                configurable: false,
                set(val) {
                    installs = val;
                },
                get() {
                    if (needDefuse && installs instanceof window.Object) {
                        try {
                            for (let key in installs) {
                                if (installs[key].appId === "ziT6U3epKObS" && installs[key].options) {
                                    window.Object.defineProperty(installs[key], "URLPatterns", {
                                        configurable: false,
                                        set() { },
                                        get() {
                                            return ["$^"];
                                        },
                                    });
                                    needDefuse = false;
                                    error("[Nano] Generic Solution Triggered :: NoAdBlock");
                                }
                            }
                        } catch (err) { }
                    }
                    return installs;
                },
            });
        } catch (err) {
            window.console.error("[Nano] Failed :: NoAdBlock Defuser");
        }
    });
};


//@pragma-if-debug
/**
 * Trace the access to a property, should be called on document-start.
 * Only available in debug mode, conflict with other functions that lock
 * variables.
 * @function
 * @param {string} name - The name of the property to define.
 * @param {string} [parent="window"] - The name of the parent object, use "."
 ** or bracket notation to separate layers. The parent must exist.
 */
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
/**
 * Log data to the background console.
 * Only available in debug mode.
 * @function
 * @param {string} log - The data to log.
 */
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
/**
 * setInterval() with benchmark.
 * Should only be used in debug mode, will be mapped to setInterval() in
 * developer mode, not available in production mode.
 * @function
 * @param {Special} func, delay, ...args - Arguments for setInterval(), the
 ** first parameter must be a function, cannot be raw code.
 * @return {Token} Cancellation token, can be passed to clearInterval() to
 ** clear the interval.
 */
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
//@pragma-end-if
