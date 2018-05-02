/**
 * A lightweight DOM manipulation library, will be expanded as needed.
 * Behaves quite differently than jQuery.
 */
"use strict";


/**
 * Shortcut for new $.Selection(input).
 * @function
 * @param {string} input - The query selector.
 * @return {$.Selection} The selection object.
 */
var $ = input => new $.Selection(input);

/**
 * Selection class.
 * Unless otherwise specified, all methods return the keyword this.
 * @class
 */
$.Selection = class {
    /**
     * Constructor.
     * @constructor
     * @param {string} selector - The query selector.
     * @param {Array.<DOMElement>} [override=undefined] - If this parameter
     ** is present, current selection will be set to it and the query selector
     ** will be ignored.
     */
    constructor(selector, override) {
        /**
         * The selected elements.
         * @member {Array.<DOMElement>}
         */
        this.selection = override ? override : Array.from(document.querySelectorAll(selector));
        /**
         * The amount of selected elements.
         * @member {integer}
         */
        this.length = this.selection.length;
    }


    /**
     * Set or update CSS of all selected elements.
     * @method
     * @param {string} key - The key of the style, use "maxHeight" instead of
     ** "max-height", similar for other keys with dashes in them.
     * @param {string} val - The value to set.
     */
    css(key, val) {
        for (let s of this.selection) {
            s.style[key] = val;
        }
        return this;
    }
    /**
     * Show all selected elements.
     * @method
     * @param {string} [state="block"] - The state to apply, defaults to
     ** "block".
     */
    show(state = "block") {
        return this.css("display", state);
    }
    /**
     * Hide all selected elements. Current display mode will not be saved.
     * Things may break if you try to show them again.
     * @method
     */
    hide() {
        return this.css("display", "none");
    }
    /**
     * Remove all selected elements from DOM.
     * @method
     */
    remove() {
        for (let s of this.selection) {
            s.remove();
        }
        return this;
    }
    /**
     * Add classes to all selected elements.
     * @method
     * @param {string} ...args - Classes to add.
     */
    addClass(...args) {
        for (let s of this.selection) {
            s.classList.add(...args);
        }
        return this;
    }
    /**
     * Remove classes from all selected elements.
     * @method
     * @param {string} [...args=[]] - Classes to remove, omit to remove all.
     */
    rmClass(...args) {
        if (args.length) {
            for (let s of this.selection) {
                s.classList.remove(...args);
            }
        } else {
            for (let s of this.selection) {
                s.className = "";
            }
        }
        return this;
    }


    /**
     * Copy current selection, this is useful when you do not want selection
     * methods to update current selection.
     * @method
     * @return {$.Selection} The new Selection object.
     */
    copy() {
        return new $.Selection(null, this.selection.slice());
    }
    /**
     * Update current selection, only keep the selected element with given
     * index.
     * Clear current selection if no selected element has that index.
     * @method
     * @param {integer} i - The index, give a negative number to count from
     ** end.
     */
    eq(i) {
        if (this.selection.length) {
            if (i < 0) {
                i += this.selection.length;
            }
            if (i >= 0 && i < this.selection.length) {
                this.selection = [this.selection[i]];
                this.length = 1;
            } else {
                this.selection = [];
                this.length = 0;
            }
        }
        return this;
    }
    /**
     * Update current selection, only keep the first selected element.
     * @method
     */
    first() {
        return this.eq(0);
    }
    /**
     * Update current selection, only keep the last selected element.
     * @method
     */
    last() {
        return this.eq(-1);
    }
    /**
     * Update current selection, set it to children of each selected elements
     * that match the new selector.
     * @method
     * @param {string} selector - The new query selector.
     */
    find(selector) {
        let newSelection = [];
        for (const s of this.selection) {
            const elems = s.querySelectorAll(selector);
            // newSelection = newSelection.concat(elems); also works, but this
            // creates a new array every time, so it may not be faster
            //
            // Note that the number of arguments is capped at around 30,000
            // depending on the browser, but there should not be that many
            // elements in the document
            newSelection.push(...elems);
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, set it to immediate children of each selected
     * elements that match the new selector.
     * @method
     * @param {string} selector - The new query selector.
     */
    children(selector) {
        return this.find(":scope > " + selector);
    }
    /**
     * Update current selection, set it to the parent of each selected
     * elements if exist.
     * Elements that do not have a parent will not be updated.
     * @method
     */
    parent() {
        for (let i = 0; i < this.selection.length; i++) {
            const elem = this.selection[i].parentNode;
            if (elem) {
                this.selection[i] = elem;
            }
        }
        return this;
    }
    /**
     * Update current selection, only keep elements that have children
     * matching a given selector.
     * @method
     * @param {string} selector - The query selector.
     * @param {boolean} [match=true] - Set to false to only keep elements
     ** that do not have children matching the selector.
     */
    filter(selector, match = true) {
        let newSelection = [];
        for (const s of this.selection) {
            if (match === Boolean(s.querySelector(selector))) {
                newSelection.push(s);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher
     * string in their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    includes(matcher) {
        let newSelection = [];
        for (const s of this.selection) {
            if (s.textContent.includes(matcher)) {
                newSelection.push(s);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher
     * string as the beginning of their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    startsWith(matcher) {
        let newSelection = [];
        for (const s of this.selection) {
            if (s.textContent.startsWith(matcher)) {
                newSelection.push(s);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher
     * string as the ending of their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    endsWith(matcher) {
        let newSelection = [];
        for (const s of this.selection) {
            if (s.textContent.endsWith(matcher)) {
                newSelection.push(s);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher
     * string as their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    textIs(matcher) {
        let newSelection = [];
        for (const s of this.selection) {
            if (matcher === s.textContent) {
                newSelection.push(s);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }


    /**
     * Add an event listener to all selected elements.
     * @param {string} ...args - Listener details
     ** @param {Event} e - The appropriate event object.
     */
    on(...args) {
        for (let s of this.selection) {
            s.addEventListener(...args);
        }
        return this;
    }
    /**
     * Trigger a click event to all selected elements.
     * @method
     */
    click() {
        for (let s of this.selection) {
            s.click();
        }
        return this;
    }


    /**
     * Get or set textContent. Affects only the first element on get mode,
     * but affects all selected elements in set mode.
     * @method
     * @param {string} [text=undefined] - The text to set, omit to get.
     * @return {string|this} String in get mode, the keyword this in set mode.
     ** An empty string will be returned if the textContent cannot be
     ** retrieved.
     */
    text(text) {
        if (text === undefined) {
            return this.selection.length ? this.selection[0].textContent : "";
        } else {
            for (let s of this.selection) {
                s.textContent = text;
            }
            return this;
        }
    }
    /**
     * Get or set innerHTML. Affects only the first element on get mode, but
     * affects all selected elements in set mode.
     * @method
     * @param {DOMString} [html=undefined] - The DOM string to set, omit to
     ** get.
     * @return {DOMString|this} DOM string in get mode, the keyword this in
     ** set mode. An empty string will be returned if the innerHTML cannot
     ** be retrieved.
     */
    html(html) {
        if (html === undefined) {
            return this.selection.length ? this.selection[0].innerHTML : "";
        } else {
            for (let s of this.selection) {
                s.innerHTML = html;
            }
            return this;
        }
    }
    /**
     * Get or set data. Affects only the first element on get mode, but
     * affects all selected elements in set mode.
     * @method
     * @param {string} name - The name of the data entry.
     * @param {string} [val=undefined] - The value to set, omit to get.
     * @return {Any|this} The data in get mode, the keyword this in set mode.
     ** Undefined will be returned if the data cannot be retrieved.
     */
    data(name, val) {
        if (val === undefined) {
            return this.selection.length ? this.selection[0].dataset[name] : undefined;
        } else {
            for (let s of this.selection) {
                s.dataset[name] = val;
            }
            return this;
        }
    }
    /**
     * Get or set attribute. Affect only the first element on get mode, but
     * affect all selected elements in set mode.
     * @method
     * @param {string} name - The name of the attribute.
     * @param {string} [val=undefined] - The value to set.
     * @return {Any|this} The data in get mode, the keyword this in set mode.
     ** Undefined will be returned if the data cannot be retrieved.
     */
    attr(name, val) {
        if (val === undefined) {
            return this.selection.length ? this.selection[0].getAttribute(name) : undefined;
        } else {
            for (let s of this.selection) {
                s.setAttribute(name, val);
            }
            return this;
        }
    }
    /**
     * Delete an attribute.
     * @method
     * @param {string} name - The name of the attribute.
     */
    rmAttr(name) {
        for (let s of this.selection) {
            s.removeAttribute(name);
        }
        return this;
    }


    /**
     * Insert HTML before the beginning of each selected elements if possible.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    before(input) {
        for (let s of this.selection) {
            // Must have parent node in this insert mode
            if (s.parentNode) {
                s.insertAdjacentHTML("beforebegin", input);
            }
        }
        return this;
    }
    /**
     * Insert HTML after the beginning of each selected elements.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    prepend(input) {
        for (let s of this.selection) {
            s.insertAdjacentHTML("afterbegin", input);
        }
        return this;
    }
    /**
     * Insert HTML before the end of each selected elements.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    append(input) {
        for (let s of this.selection) {
            s.insertAdjacentHTML("beforeend", input);
        }
        return this;
    }
    /**
     * Insert HTML after the end of each selected elements if possible.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    after(input) {
        for (let s of this.selection) {
            // Must have parent node in this insert mode
            if (s.parentNode) {
                s.insertAdjacentHTML("afterend", input);
            }
        }
        return this;
    }


    /**
     * Get offsetWidth of the first selected element.
     * @method
     * @return {integer} The offsetWidth, or -1 if the offsetWidth cannot be
     ** retrieved.
     */
    width() {
        return this.selection.length ? this.selection[0].offsetWidth : -1;
    }
    /**
     * Get offsetHeight of the first selected element.
     * @method
     * @return {integer} The offsetHeight, or -1 if the offsetHeight cannot be
     ** retrieved.
     */
    height() {
        return this.selection.length ? this.selection[0].offsetHeight : -1;
    }
    /**
     * Loop though each selected element.
     * @method
     * @param {Function} func - The handler.
     ** @param {DOMElement} elem - The current DOM element.
     */
    each(func) {
        for (let s of this.selection) {
            func(s);
        }
        return this;
    }
};


/**
 * Send a XMLHttpRequest.
 * @function
 * @param {Object} details - Details about this request.
 ** @param {string} method - The method of the request, usually "GET" or
 *** "POST".
 ** @param {string} url - The URL of the request.
 ** @param {Object|undefined} [headers=undefined] - The headers of the
 *** request.
 ** @param {string|null} [payload=null] - The payload of the request.
 * @param {Function} onload - The load event handler.
 ** @param {string} response - The response text.
 * @param {Function} onerror - The error event handler.
 */
$.request = (details, onload, onerror) => {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                onload(req.responseText);
            } else {
                onerror();
            }
        }
    };

    req.open(details.method, details.url);

    if (details.headers) {
        for (const key in details.headers) {
            if (details.headers.hasOwnProperty(key)) {
                req.setRequestHeader(key, details.headers[key]);
            }
        }
    }

    req.send(details.payload || null);
};
