//The content core library for content rules
"use strict";

//=====Control=====
/**
 * Initialization.
 * @function
 */
a.init = () => {
    console.log(`Domain: ${document.domain}`);
    //Home page installation test
    if (a.domCmp(["jspenguin2017.github.io"], true) && location.pathname.startsWith("/uBlockProtector/")) {
        a.inject(() => {
            "use strict";
            window.uBlock_Protector_Extension = true;
        });
    }
};
/**
 * Whether uBO-Extra should not run.
 * @var {boolean}
 */
a.uBOExtraExcluded = false;

//=====Utilities=====
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
        //Top frame not accessible due to security policy
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
 * Run function that is passed in on document-start, document-idle, and document-end.
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
 * @param {string} [name=undefined] - The name of the uBlock Origin detector.
 */
a.err = (name) => {
    if (name) {
        console.error(`Uncaught Error: ${name} uBlock Origin detector is not allowed on this device!`);
    } else {
        console.error("Uncaught Error: uBlock Origin detectors are not allowed on this device!");
    }
};
/**
 * Do a cross origin request.
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
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domCmp = (domList, noErr) => {
    for (let i = 0; i < domList.length; i++) {
        if (document.domain.endsWith(domList[i]) &&
            (document.domain.length === domList[i].length ||
                document.domain.charAt(document.domain.length - domList[i].length - 1) === '.')) {
            !noErr && a.err();
            return true;
        }
    }
    return false;
};
/**
 * Same as a.domCmp(), but only compare one domain.
 * @function
 * @param {string} dom - The domain to compare.
 */
/*
//Does not make a difference
a.domCmpOnce = (dom, noErr) => {
    if (document.domain.endsWith(dom) &&
        (document.domain.length === dom.length ||
            document.domain.charAt(document.domain.length - dom.length - 1) === '.')) {
        !noErr && a.err();
        return true;
    } else {
        return false;
    }
};
*/
/**
 * Check if current domain includes one of the strings that is in the list.
 * "example" will match domains that matches /(^|.*\.)example\.[^\.]*$/.
 * "git.example" will match domains that matches /(^|.*\.)git\.example\.[^\.]*$/.
 * @function
 * @param {Array.<string>} domList - The list of strings to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domInc = (domList, noErr) => {
    for (let i = 0; i < domList.length; i++) {
        let index = document.domain.lastIndexOf(domList[i] + ".");
        //Make sure the character before, if exists, is "."
        if (index > 0 && document.domain.charAt(index - 1) !== '.') {
            continue;
        }
        if (index > -1) {
            if (!document.domain.substring(index + domList[i].length + 1).includes(".")) {
                !noErr && a.err();
                return true;
            }
        }
    }
    return false;
};
/**
 * Same as a.domInc(), but only compare one domain.
 * @function
 * @param {string} dom - The domain to compare.
 */
/*
//Does not make a difference
a.domIncOnce = (dom, noErr) => {
    let index = document.domain.lastIndexOf(dom + ".");
    //Make sure the character before, if exists, is "."
    if (index > 0 && document.domain.charAt(index - 1) !== '.') {
        return false;
    }
    if (index > -1) {
        if (!document.domain.substring(index + dom.length + 1).includes(".")) {
            !noErr && a.err();
            return true;
        }
    }
    return false;
};
*/
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
     * Partial string match. Result in match if one of the arguments contains the filter.
     * @param {string} filter - The filter.
     */
    string: 1,
    /**
     * Exact string match. Result in match if one of the arguments is exactly the filter.
     * @param {string} filter - The filter.
     */
    stringExact: 2,
    /**
     * Regular expression based matching, filter.test() will be used to apply matching.
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
 * @param {undefined|null|string|RegExp|Function} filter - An appropriate filter.
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
            //Match all
            return `() => true`;
    }
};
/**
 * Inject a standalone script to the page.
 * @function
 * @param {string|Function} payload - The script to inject.
 * @param {boolean} [isReady=false] - Set this to true if the payload does not need a execution wrapper.
 */
a.inject = (payload, isReady) => {
    let s = document.createElement("script");
    s.textContent = isReady ? payload : `(${payload})();`;
    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("uBlock Protector failed to inject a standalone script!");
        a.debugMode && console.log(s.textContent);
    }
};
/**
 * Similar to a.inject(), but the injected code is enclosed in a wrapper that have some rumtime functions.
 * Must be called on document-start to ensure security.
 * @function
 * @param {string|Function} payload - The script to inject.
 * @param {boolean} [isReady=false] - Set this to true if the payload does not need a execution wrapper.
 * @runtime dispatchEvent, CustomEvent
 ** The real dispatchEvent and CustomEvent, useful when you need custom messaging.
 * @runtime execute
 ** Run code ignoring Content Security Policy.
 ** @function
 ** @param {string} code - The code to execute, must already have execution wrapper if it needs one.
 *** The execution will be done on the next tick, which makes it not truly synchronous.
 */
a.injectWithRuntime = (payload, isReady) => {
    //Set up event listener
    const magic = a.uid();
    addEventListener(magic, (e) => {
        //dispatchEvent and CustomEvent are cached by runtime, this is safe
        a.inject(e.detail, true);
    });
    //Process payload
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
    //Inject payload
    let s = document.createElement("script");
    s.textContent = runtime;
    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("uBlock Protector failed to inject a runtime wrapped standalone script!");
        a.debugMode && console.log(s.textContent);
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
 ** @param {MutationObserver} e - The observer object, call disconnect on it to stop observing.
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
 ** @param {MutationObserver} e - The observer object, call disconnect on it to stop observing.
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
 ** @param {HTMLScriptElement} script - The script that is about to be executed, it may not have its final textContent.
 ** @param {HTMLElement} parent - The parent node of this script.
 ** @param {MutationObserver} e - The observer object, call disconnect on it to stop observing.
 */
a.onBeforeScriptExecute = (handler) => {
    a.onInsert((node, target, observer) => {
        if (node.tagName === "SCRIPT") {
            handler(node, target, observer);
        }
    });
};

//=====Solutions=====
/**
 * Inject CSS, "!important" will be added automatically.
 * @function
 * @param {string} code - The CSS to inject.
 * @param {boolean} [stealthy=false] - Whether the style should only be injected from background page only, this will
 ** not carete a style element, but the injected style have a lower priority. The injection from background is asynchronous.
 */
a.css = (() => {
    const reMatcher = /;/g;
    return (code, stealthy) => {
        const payload = code.replace(reMatcher, " !important;");
        //Add from background page
        chrome.runtime.sendMessage({
            cmd: "inject css",
            data: payload,
        });
        if (!stealthy) {
            //Add directly
            let s = document.createElement("style");
            s.textContent = payload;
            document.documentElement.append(s);
        }
    };
})();
/**
 * Add a bait element, this sometimes has a side effect that adds an empty bar on top of the page.
 * Sometimes the height of the bait element is checked, so I cannot make it 0 height.
 * @function
 * @param {string} type - The type of the element, example: div.
 * @param {string} identifier - The class or id, example: .test (class), #test (id).
 * @param {boolean} [hidden=false] - Whether the element should be hidden.
 */
a.bait = (type, identifier, hidden) => {
    //Create element
    let elem = document.createElement(type);
    //Add identifier
    switch (identifier.charAt(0)) {
        case '#':
            elem.id = identifier.substring(1);
            break;
        case '.':
            elem.className = identifier.substring(1);
            break;
    }
    //Hide element if needed
    if (hidden) {
        elem.style.display = "none";
    }
    //Add content and prepend to HTML
    elem.innerHTML = "<br>";
    document.documentElement.prepend(elem);
};
/**
 * Filter a function, should be called on document-start.
 * @function
 * @param {string} name - The name of the function.
 * @param {Enumeration} [method=a.matchMethod.matchAll] - An option from a.matchMethods, omit or pass null defaults
 ** to match all.
 * @param {Many} filter - The filter to apply, this must be appropriate for the method.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** The parent must exist.
 */
a.filter = (name, method, filter, parent = "window") => {
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const matcher = ${a.getMatcher(method, filter)};
        //Cache console functions as some web pages do change them
        const log = window.console.log.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);
        //The original funciton, will be set later
        let parent, original;
        //The replacement function with filters
        const newFunc = (...args) => {
            //Call log
            if (${a.debugMode}) {
                warn("${strParent}.${name} is called with these arguments:");
                for (let i = 0; i < args.length; i++) {
                    log(String(args[i]));
                }
            }
            //Apply filter
            if (matcher(args)) {
                //Not allowed log
                error("Uncaught Error: uBlock Origin detectors are not allowed on this device!");
            } else {
                //Allowed log
                log("Tests passed.");
                return original.apply(parent, args);
            }
        };
        //Try to replace the function
        try {
            parent = ${parent};
            original = ${parent}["${name}"];
            //Replace
            ${parent}["${name}"] = newFunc;
            //Activate log
            log("Filter activated on ${strParent}.${name}");
        } catch (err) {
            //Failed to activate
            error("uBlock Protector failed to activate filter on ${strParent}.${name}!");
        }
    })();`, true);
};
/**
 * Filter assignment of innerHTML, innerText, or textContent. Should be called on document-start.
 * @function
 * @param {string} name - The name of the property to filter, can be "innerHTML", "innerText", or "textContent".
 * @param {Function} filter - The filter function. Use closure and self execution if you need to initialize.
 ** @param {HTMLElement} elem - The target element.
 ** @param {string} val - The value that is set.
 ** @return {boolean} True to block the assignment, false to allow.
 */
a.antiCollapse = (name, filter) => {
    a.inject(`(() => {
        "use strict";
        const handler = ${filter};
        const log = window.console.log.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);
        const String = window.String.bind(window);
        try {
            //Get setter and getter
            const descriptor = window.Object.getOwnPropertyDescriptor(window.Element.prototype, "${name}");
            const _set = descriptor.set;
            const _get = descriptor.get;
            window.Object.defineProperty(window.Element.prototype, "${name}", {
                configurable: false,
                set(val) {
                    if (${a.debugMode}) {
                        warn("${name} of an element is being assigned to:");
                        log(val);
                    }
                    if (handler(this, String(val))) {
                        error("Uncaught Error: uBlock Origin detectors are not allowed on this device!");
                    } else {
                        log("Tests passed.");
                        _set.call(this, val);
                    }
                },
                get() {
                    return _get.call(this);
                },
            });
            window.console.log("Element collapse defuser activated on ${name}");
        } catch (err) {
            //Failed to activate
            error("uBlock Protector failed to activate element collapse defuser on ${name}!");
        }
    })();`, true);
};
/**
 * Change the execution delay for setTimeout or setInterval, should be called on document-start.
 * @function
 * @param {string} timer - The name of the timer to patch, can be "setTimeout" or "setInterval".
 * @param {Enumeration} [method=method=a.matchMethod.matchAll] - An option from a.matchMethods, omit or pass null defaults
 ** to match all.
 * @param {Many} filter - The filter to apply, this must be appropriate for the method.
 * @param {float} [ratio=0.02] - The boost ratio, between 0 and 1 for speed up, larger than 1 for slow down, defaults to
 ** speed up 50 times.
 */
a.timewarp = (timer, method, filter, ratio = 0.02) => {
    a.inject(`(() => {
        "use strict";
        const matcher = ${a.getMatcher(method, filter)};
        //Cache console functions as some web pages do change them
        const log = window.console.log.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);
        //The original funciton, will be set later
        let original;
        //The replacement function with filters
        const newFunc = (...args) => {
            //Call log
            if (${a.debugMode}) {
                warn("window.${timer} is called with these arguments:");
                for (let i = 0; i < args.length; i++) {
                    log(String(args[i]));
                }
            }
            //Apply filter
            if (matcher(args)) {
                error("Timewarped.");
                args[1] *= ${ratio};
            } else {
                log("Not timewarped.");
            }
            return original.apply(window, args);
        };
        //Try to replace the function
        try {
            original = window.${timer};
            //Replace
            window.${timer} = newFunc;
            //Activate log
            log("Timewarp activated on window.${timer}");
        } catch (err) {
            //Failed to activate
            error("uBlock Protector failed to activate filter on window.${timer}!");
        }
    })();`, true);
};
/**
 * Defines a read-only property, should be called on document-start.
 * May not be able to lock the property's own properties.
 * @function
 * @param {string} name - The name of the property to define.
 * @param {Any} val - The value to set, must have extra quotes if it is a literal string. If it is a funciton,
 ** it will lose its scope, if it is an object, you are responsible in making it into a string.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** The parent must exist.
 */
a.readOnly = (name, val, parent = "window") => {
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const val = ${val};
        //This is synchronous so I do not need to cache the reference of the console functions
        try {
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set() { },
                get() {
                    return val;
                },
            });
            if (${a.debugMode}) {
                window.console.log("Defined read-only property ${strParent}.${name}");
            }
        } catch (err) {
            window.console.error("uBlock Protector failed to define read-only property ${strParent}.${name}!");
        }
    })();`, true);
};
/**
 * Defines a non-accessible property, should be called on document-start.
 * @function
 * @param {string} name - The name of the property to define.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** The parent must exist.
 */
a.noAccess = (name, parent = "window") => {
    name = a.strEscape(name);
    const strParent = a.strEscape(parent);
    a.inject(`(() => {
        "use strict";
        const err = new window.Error("This property may not be accessed!");
        try {
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set() {
                    throw err;
                },
                get() {
                    throw err;
                },
            });
            if (${a.debugMode}) {
                window.console.log("Defined non-accessible property ${strParent}.${name}");
            }
        } catch (err) {
            window.console.error("uBlock Protector failed to define non-accessible property ${strParent}.${name}!");
        }
    })();`, true);
};
/**
 * Similar to a.noAccess(), but with a more complicated property looping algorithm.
 * @function
 * @param {string} chain - The property chain, use "." to separate layers. Do not include "window".
 */
a.noAccessExt = (chain) => {
    chain = a.strEscape(chain);
    a.inject(`(() => {
        //Based on uAssets
        //License: https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE
        "use strict";
        //Prepare
        const error = window.console.error.bind(window.console);
        const err = new window.Error("This property may not be accessed!");
        const Object = window.Object.bind(window);
        const descriptor = window.Object.getOwnPropertyDescriptor.bind(window.Object);
        const define = window.Object.defineProperty.bind(window.Object);
        //Setters and getters
        const throwErr = () => {
            throw err;
        };
        let trustedSetters = {};
        //Property chain patcher
        const proxy = (parent, chain) => {
            const i = chain.indexOf(".");
            if (i === -1) {
                //Last property in the chain, nuke whatever is present
                const current = descriptor(parent, chain);
                if (!current || current.set !== throwErr || current.get !== throwErr) {
                    define(parent, chain, {
                        configurable: false,
                        set: throwErr,
                        get: throwErr,
                    });
                }
            } else {
                //Process current property name
                const name = chain.slice(0, i);
                let val = parent[name];
                chain = chain.substring(i + 1);
                //Patch current property
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
                                    error("uBlock Protector failed to refresh non-accessible property ${chain}!");
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
            window.console.log("Defined non-accessible property ${chain}");
        } catch (err) {
            error("uBlock Protector failed to define non-accessible property ${chain}!");
        }
    })();`, true);
};
/**
 * Set or get a cookie.
 * @function
 * @param {string} key - The key of the cookie.
 * @param {string} [val=undefined] - The value to set, omit this to get the cookie.
 * @param {integer} [time=31536000000] - In how many milliseconds will it expire, defaults to 1 year.
 * @param {string} [path="/"] - The path to set.
 * @return {string|null|undefined} The value of the cookie, null will be returned if the cookie does not exist, and undefined
 ** will be returned in set mode.
 */
a.cookie = (key, val, time = 31536000000, path = "/") => {
    if (val === undefined) {
        //Get mode
        const cookies = document.cookie;
        const i = cookies.indexOf(`${key}=`);
        const j = cookies.indexOf(";", i);
        if (i === -1) {
            //Not found
            return null;
        } else {
            if (j === -1) {
                //Goes to the end
                return cookies.substring(i + key.length + 1);
            } else {
                //Extract the value
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
 * Generate a native HTML5 player with controls but not autoplay.
 * Replacing player is not preferred, do not use this unless absolutely necessary.
 * @function
 * @param {string} source - The source of the video.
 * @param {string} [type=(Auto Detect)] - The type of the video, will be automatically detected if not supplied,
 ** defaults to MP4 if detection failed.
 * @param {string} [width="100%"] - The width of the player.
 * @param {string} [height="auto"] - The height of the player.
 * @return {string} An HTML string of the video player.
 */
a.nativePlayer = (source, type, width = "100%", height = "auto") => {
    //Detect type
    if (!type) {
        const i = source.lastIndexOf(".");
        let temp;
        if (i > -1) {
            temp = source.substring(i + 1);
        }
        switch (temp) {
            case "webm":
            case "mp4":
            case "ogg":
                type = "video/" + temp;
                break;
            default:
                //Defaults to MP4
                type = "video/mp4";
                break;
        }
    }
    //Construct HTML string
    return `<video width="${width}" height="${height}" controls><source src="${source}" type="${type}" /></video>`;
};
/**
 * Install XMLHttpRequest loopback engine. Should be called once on document-start if needed.
 * The request will always be sent so event handlers can be triggered. Depending on the website, a background redirect
 * may also be required.
 * @function
 * @param {Function} server - The loopback server.
 ** @param {Any} ...args - The arguments supplied to open.
 ** @return {string|null} Return a string to override the result of this request, return null to not interfere.
 */
a.loopback = (server) => {
    a.inject(`(() => {
        "use strict";
        const server = ${server};
        let original; //XMLHttpRequest
        const newXHR = function (...args) {
            const wrapped = new (window.Function.prototype.bind.apply(original, args));
            const _open = wrapped.open;
            wrapped.open = function (...args) {
                const data = server(...args);
                if (data !== null) {
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
            window.console.error("uBlock Protector failed to set up XMLHttpRequest loopback engine!");
        }
    })();`, true);
};
/**
 * Install XMLHttpRequest replace engine. Should be called once on document-start if needed.
 * @function
 * @param {Function} handler - The replace handler.
 * @runtime this, method, url, isAsync, user, passwd, ...rest
 ** Keyword this and arguments passed to XMLHttpRequest.prototype.open().
 * @runtime replace
 ** Replace payload.
 ** @function
 ** @param {This} that - The keyword this.
 ** @param {string} text - The new payload.
 */
a.replace = (handler) => {
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
            const _open = window.XMLHttpRequest.prototype.open
            window.XMLHttpRequest.prototype.open = function (method, url, isAsync, user, passwd, ...rest) {
                (${handler})();
                return _open.call(this, method, url, isAsync, user, passwd, ...rest);
            };
        } catch (err) {
            window.console.error("uBlock Protector failed to set up XMLHttpRequest replace engine!");
        }
    })();`, true);
};
/**
 * Forcefully close the current tab. This is asynchronous.
 * @function
 */
a.forceClose = () => {
    chrome.runtime.sendMessage({
        cmd: "remove tab",
    });
};

//=====Generic=====
/**
 * Apply generic solutions, call once on document-start if needed.
 * @function
 */
a.generic = () => {
    //Based on generic solutions of Anti-Adblock Killer, modified to fit my API
    //License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE
    //========================
    //=====Content Script=====
    //========================
    //---document-start---
    //FuckAdBlock
    a.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");
    a.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
    //ads.js v1
    a.readOnly("canRunAds", true);
    a.readOnly("canShowAds", true);
    a.readOnly("isAdBlockActive", false);
    //---document-idle---
    a.ready(() => {
        //AdBlock Alerter (WP)
        if ($("div.adb_overlay > div.adb_modal_img").length) {
            //Log
            a.err("AdBlock Alerter");
            //Remove alert and allow scrolling
            $("div.adb_overlay").remove();
            a.css("html, body { height:auto; overflow:auto; }");
        }
        //Generic block screens
        {
            const elem = document.getElementById("blockdiv");
            if (elem && elem.innerHTML === "disable ad blocking or use another browser without any adblocker when you visit") {
                //Log
                console.error("Uncaught Error: Generic block screens are not allowed on this device!");
                //Remove block screen
                elem.remove();
            }
        }
    });
    //---on-insert---
    //No-Adblock
    const re1 = /^[a-z0-9]*$/;
    //StopAdBlock
    const re2 = /^a[a-z0-9]*$/;
    //AntiAdblock (Packer)
    const reIframeId = /^(?:z|w)d$/;
    const reImgId = /^(?:x|g)d$/;
    const reImgSrc = /\/ads\/banner\.jpg/;
    const reIframeSrc = /\/adhandler\/|\/adimages\/|ad\.html/;
    //Handler
    const onInsertHandler = (insertedNode) => {
        //No-Adblock
        if (insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 4 &&
            re1.test(insertedNode.id) &&
            insertedNode.firstChild &&
            insertedNode.firstChild.id &&
            insertedNode.firstChild.id === insertedNode.id &&
            insertedNode.innerHTML.includes("no-adblock.com")) {
            //Log
            a.err("No-Adblock");
            //Remove element
            insertedNode.remove();
        }
        //StopAdblock
        if (insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 7 &&
            re2.test(insertedNode.id) &&
            insertedNode.parentNode &&
            insertedNode.parentNode.id &&
            insertedNode.parentNode.id === insertedNode.id + "2" &&
            insertedNode.innerHTML.includes("stopadblock.org")) {
            //Log
            a.err("StopAdblock");
            //Remove element
            insertedNode.remove();
        }
        //AntiAdblock (Packer)
        if (insertedNode.id &&
            reImgId.test(insertedNode.id) &&
            insertedNode.nodeName === "IMG" &&
            reImgSrc.test(insertedNode.src) ||
            insertedNode.id &&
            reIframeId.test(insertedNode.id) &&
            insertedNode.nodeName === "IFRAME" &&
            reIframeSrc.test(insertedNode.src)) {
            //Log
            a.err("AntiAdblock");
            //Remove element
            insertedNode.remove();
        }
    };
    a.onInsert(onInsertHandler);
    //==================
    //=====Injected=====
    //==================
    a.inject(() => {
        "use strict";
        //---Initialization---
        let data = {};
        const error = window.console.error.bind(window.console);
        const err = (name) => {
            error(`Uncaught Error: ${name} uBlock Origin detector is not allowed on this device!`);
        };
        //---document-start---
        //Playwire
        //Test link: http://support.playwire.com/article/adblock-detector-demo/
        try {
            const fakeTester = {
                check(f) {
                    err("Playwire");
                    f();
                },
            };
            //Since this is generic I cannot assign it to an object yet
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
            error("uBlock Protector failed to set up Playwire uBlock Origin detector defuser!");
        }
        //AdBlock Notify
        try {
            let val;
            let isEvil = false;
            const anErr = new window.Error("AdBlock Notify uBlock Origin detector is not allowed on this device!");
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
                            err("AdBlock Notify");
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
            error("uBlock Protector failed to set up AdBlock Notify uBlock Origin detector defuser!");
        }
        //---document-idle---
        window.addEventListener("DOMContentLoaded", () => {
            //AdBlock Detector (XenForo Rellect)
            if (window.XenForo && typeof window.XenForo.rellect === "object") {
                //Log
                err("XenForo");
                //Patch detector
                window.XenForo.rellect = {
                    AdBlockDetector: {
                        start() { },
                    },
                };
            }
            //Adbuddy
            if (typeof window.closeAdbuddy === "function") {
                //Log
                err("Adbuddy");
                //Disable
                window.closeAdbuddy();
            }
            //Antiblock.org v2
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
                                    //Log
                                    err("Antiblock.org v2");
                                    //Set data for future uses
                                    data.abo2 = id;
                                    break outmost;
                                }
                            }
                        }
                    }
                }
            } catch (err) { }
            //BetterStopAdblock, Antiblock.org v3, and BlockAdBlock
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
                            //BetterStopAdblock and Antiblock.org v3
                            if (method.deferExecution &&
                                method.displayMessage &&
                                method.getElementBy &&
                                method.getStyle &&
                                method.insert &&
                                method.nextFunction) {
                                if (method.toggle) {
                                    //Log
                                    err("BetterStopAdblock");
                                    //Set data for future uses
                                    data.bsa = prop;
                                } else {
                                    //Log
                                    err("Antiblock.org v3");
                                    //Set data for future uses
                                    data.abo3 = prop;
                                }
                                window[prop] = null;
                            }
                            //BlockAdBlock
                            if (window.Object.keys(method).length === 3) {
                                //Each key should be 10 character long, one of the 3 keys can be "bab"
                                let isBAB = true;
                                //Verify length
                                const keyLen = window.Object.keys(method).join("").length;
                                if (keyLen !== 30 && keyLen !== 23) {
                                    isBAB = false;
                                } else {
                                    for (let prop in method) {
                                        if (prop.length !== 10 && prop !== "bab") {
                                            isBAB = false;
                                            break;
                                        }
                                    }
                                }
                                if (isBAB) {
                                    //Log
                                    err("BlockAdBlock");
                                    //Remove property
                                    window[prop] = null;
                                }
                            }
                        }
                    } catch (err) { }
                }
            }
        });
        //---on-insert---
        //Antiblock.org (all version) and BetterStopAdblock
        const reMsgId = /^[a-z0-9]{4,10}$/i;
        const reTag1 = /^(?:div|span|b|i|font|strong|center)$/i;
        const reTag2 = /^(?:a|b|i|s|u|q|p|strong|center)$/i;
        const reWords1 = new window.RegExp("ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|" +
            "Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком", "i");
        const reWords2 = new window.RegExp("kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|" +
            "desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;" +
            "&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|" +
            "рекламе|verhindert|advert|kapatınız", "i");
        //Adunblock
        const reId = /^[a-z]{8}$/;
        const reClass = /^[a-z]{8} [a-z]{8}/;
        const reBg = /^[a-z]{8}-bg$/;
        const onInsertHandler = (insertedNode) => {
            //Antiblock.org (all version) and BetterStopAdblock
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
                    //Log
                    err("Antiblock.org");
                    //Stop audio message
                    audio.pause();
                    audio.remove();
                } else if ((data.abo2 && insertedNode.id === data.abo2) ||
                    (insertedNode.firstChild.hasChildNodes() &&
                        reWords1.test(insertedNode.firstChild.innerHTML) &&
                        reWords2.test(insertedNode.firstChild.innerHTML))) {
                    //Log
                    err("Antiblock.org v2");
                    //Defuse
                    insertedNode.remove();
                } else if ((data.abo3 && insertedNode.id === data.abo3) ||
                    (insertedNode.firstChild.hasChildNodes() &&
                        insertedNode.firstChild.firstChild.nodeName === "IMG" &&
                        insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64"))) {
                    //Log
                    err("Antiblock.org v3");
                    //Defuse
                    window[data.abo3] = null;
                    insertedNode.remove();
                } else if (data.bsa && insertedNode.id === data.bsa) {
                    //Log
                    err("BetterStopAdblock");
                    //Defuse
                    window[data.bsa] = null;
                    insertedNode.remove();
                }
            }
            //Adunblock
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
                    //Log
                    a.err("Adunblock Premium");
                    //Full Screen Message (Premium)
                    insertedNode.nextSibling.remove();
                    insertedNode.remove();
                } else if (insertedNode.nextSibling.id &&
                    reId.test(insertedNode.nextSibling.id) &&
                    insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")) {
                    //Log
                    a.err("Adunblock Free");
                    //Top bar Message (Free)
                    insertedNode.remove();
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
 * Create a non-overridable FuckAdBlock constructor and instance that always returns not detected.
 * @function
 * @param {string} constructorName - The name of the constructor.
 * @param {string} instanceName - The name of the instance.
 */
a.generic.FuckAdBlock = (constructorName, instanceName) => {
    a.inject(`(() => {
        const errMsg = "Uncaught Error: FuckAdBlock uBlock Origin detector is not allowed on this device!";
        const error = window.console.error.bind(window.console);
        const patchedFuckAdBlock = function () {
            //Based on FuckAdBlock
            //License: https://github.com/sitexw/FuckAdBlock/blob/master/LICENSE
            //===Init===
            //On not detected callbacks
            this._callbacks = [];
            //Add on load event
            window.addEventListener("load", () => {
                this.emitEvent();
            });
            //===v3 Methods===
            //Set options, do nothing
            this.setOption = () => {
                return this;
            };
            //Check, call on not detected callbacks
            this.check = () => {
                this.emitEvent();
                return true;
            };
            //Call on not detected callbacks
            this.emitEvent = () => {
                //Call callbacks
                for (let i = 0; i < this._callbacks.length; i++) {
                    this._callbacks[i]();
                }
                return this;
            };
            //Clear events, empty callback array
            this.clearEvent = () => {
                this._callbacks = [];
            };
            //Add event handler
            this.on = (detected, func) => {
                //Log
                error(errMsg);
                if (!detected) {
                    this._callbacks.push(func);
                }
                return this;
            };
            //Add on detected handler, do nothing
            this.onDetected = () => {
                //Log
                error(errMsg);
                return this;
            };
            //Add on not detected handler
            this.onNotDetected = (func) => {
                return this.on(false, func);
            };
            //===v4 Methods===
            this.debug = {};
            //Set debug state, do nothing
            this.debug.set = () => {
                return this;
            };
        };
        //Define properties
        try {
            window.Object.defineProperty(window, "${a.strEscape(constructorName)}", {
                configurable: false,
                set() { },
                get() {
                    return patchedFuckAdBlock;
                },
            });
            const instance = new patchedFuckAdBlock();
            window.Object.defineProperty(window, "${a.strEscape(instanceName)}", {
                configurable: false,
                set() { },
                get() {
                    return instance;
                },
            });
        } catch (err) {
            window.console.error("uBlock Protector failed to set up FuckAdBlock defuser!");
        }
    })();`, true);
};
/**
 * Setup generic Adfly bypasser, call once on document-start if needed.
 * @function
 */
a.generic.Adfly = () => {
    //Based on AdsBypasser
    //License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
    a.inject(() => {
        const handler = (encodedURL) => {
            if (window.document.body) {
                //This is not an Adfly page
                return;
            }
            //Some checking
            const index = encodedURL.indexOf("!HiTommy");
            if (index > -1) {
                encodedURL = encodedURL.substring(0, index);
            }
            //Decode URL
            let var1 = "", var2 = "";
            for (let i = 0; i < encodedURL.length; ++i) {
                if (i % 2 === 0) {
                    var1 = var1 + encodedURL.charAt(i);
                } else {
                    var2 = encodedURL.charAt(i) + var2;
                }
            }
            let decodedURL = window.atob(var1 + var2).substring(2);
            if (window.location.hash) {
                decodedURL += location.hash;
            }
            //Make sure the URL is not obviously bad
            if (decodedURL.length > 3 && decodedURL.includes(".")) {
                //Stop the window
                window.stop();
                //Redirect
                window.onbeforeunload = null;
                window.location.href = decodedURL;
            }
        };
        //Setup variable hijacker
        try {
            let val;
            //Prevent running multiple times
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
                    //In case this is not an Adfly page, this variable must be functional
                    val = value;
                },
                get() {
                    return val;
                },
            });
        } catch (err) {
            window.console.error("uBlock Protector failed to set up Adfly bypasser!");
        }
    });
};
/**
 * Set up ads.js v2 defuser, call once on document-start if needed.
 * This defuser may cause some websites to malfunction.
 * @function
 */
a.generic.adsjsV2 = () => {
    a.inject(() => {
        "use strict";
        const error = window.console.error.bind(window.console);
        const matcher = /[a-zA-Z0-9]{11,14}/;
        const err = new window.TypeError("Failed to execute 'getElementById' on 'Document': " +
            "1 argument required, but only 0 present.");
        let original; //document.getElementById
        const newFunc = (...args) => {
            if (args.length) {
                if (matcher.test(String(args[0]))) {
                    let elem = original.apply(window.document, args);
                    if (elem) {
                        return elem;
                    } else {
                        error("Uncaught Error: ads.js v2 uBlock Origin detector is not allowed on this device!");
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
            error("uBlock Protector failed to set up ads.js v2 uBlock Origin detector defuser!");
        }
    });
};
/**
 * Set up NoAdBlock defuser, call once on document-start if needed.
 * Many solutions enclosed here, change useSolution constant to set the one to activate.
 * @function
 */
a.generic.NoAdBlock = () => {
    a.inject(() => {
        "use strict";
        try {
            //Prevent the page from tampering this function
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
                                    if (key === "preview") {
                                        //Preview does not really matter, just hard code something that works for now
                                        window.document.body.insertAdjacentHTML("beforeend",
                                            "<style>html, body { overflow:scroll !important; } " +
                                            "cf-div { display:none !important; }</style>");
                                    } else {
                                        window.Object.defineProperty(installs[key], "URLPatterns", {
                                            configurable: false,
                                            set() { },
                                            get() {
                                                return ["$^"];
                                            },
                                        });
                                    }
                                    //Update flag and log
                                    needDefuse = false;
                                    error("Uncaught Error: NoAdBlock uBlock Origin detector is not allowed on this device!");
                                }
                            }
                        } catch (err) {
                            //window.console.log(err);
                        }
                    }
                    return installs;
                },
            });
        } catch (err) {
            window.console.error("uBlock Protector failed to set up NoAdBlock uBlock Origin detector defuser!");
        }
    });
};

//=====Debug Utilities=====
/**
 * Trace the access to a property, should be called on document-start.
 * Only available in debug mode.
 * @function
 * @param {string} name - The name of the property to define.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** The parent must exist.
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
                    trace("SET ${strParent}.${name}", v);
                    val = v;
                },
                get() {
                    trace("GET ${strParent}.${name}", val);
                    return val;
                },
            });
        } catch (err) {
            window.console.error("uBlock Protector failed to define traced property ${strParent}.${name}!");
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
 * Should only be used in debug mode, will be mapped to setInterval() in non-debug mode.
 * @function
 * @param {Special} func, delay, ...args - Arguments for setInterval(), the first parameter must
 ** be a function, cannot be raw code.
 * @return {Token} Cancellation token, can be passed to clearInterval() to clear the interval.
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
        console.log("Benchmarked Interval: Function " + func.name + " used " + (t1 - t0) + "ms");
    }, delay);
};
