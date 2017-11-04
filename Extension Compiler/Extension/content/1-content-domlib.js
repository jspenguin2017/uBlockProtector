//The DOM manipulation library for content core and rules, this library behaves differently than jQuery
"use strict";

/**
 * Shortcut for new $.Selection(input).
 * @function
 * @param {string} input - The query selector.
 * @return {$.Selection} The Selection object.
 */
var $ = (input) => new $.Selection(input);

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
     * @param {Array.<DOMElement>} [override=undefined] - If this parameter is present, current selection will be set to it
     ** and the query selector will be ignored.
     */
    constructor(selector, override) {
        /**
         * The selected elements.
         * @member {Array.<DOMElement>}
         */
        this.selection = override ? override : [...(document.querySelectorAll(selector))];
        /**
         * The amount of selected elements.
         * @member {integer}
         */
        this.length = this.selection.length;
    }

    //---CSS---
    /**
     * Set or update CSS of all selected elements.
     * @method
     * @param {string} key - The key of the style, use "maxHeight" instead of "max-height" (same for all other similar keys).
     * @param {string} val - The value to set.
     */
    css(key, val) {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style[key] = val;
        }
        return this;
    }
    /**
     * Show all selected elements.
     * @method
     * @param {string} [state="block"] - The state to apply, defaults to "block".
     */
    show(state = "block") {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style.display = state;
        }
        return this;
    }
    /**
     * Hide all selected elements. Current display mode will not be saved.
     * Things may break if you try to show them again.
     * @method
     */
    hide() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style.display = "none";
        }
        return this;
    }
    /**
     * Remove all selected elements from DOM.
     * @method
     */
    remove() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].remove();
        }
        return this;
    }
    /**
     * Add classes to all selected elements.
     * @method
     * @param {string} ...args - Classes to add.
     */
    addClass(...args) {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].classList.add(...args);
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
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].classList.remove(...args);
            }
        } else {
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].className = "";
            }
        }
        return this;
    }

    //---Selection---
    /**
     * Copy current selection, this is useful when you do not want selection methods to update current selection.
     * @method
     * @return {$.Selection} The new Selection object.
     */
    copy() {
        return new $.Selection(null, this.selection.slice());
    }
    /**
     * Update current selection, only keep the first selected element.
     * @method
     */
    first() {
        if (this.selection.length) {
            this.selection = [this.selection[0]];
            this.length = 1
        }
        return this;
    }
    /**
     * Update current selection, only keep the selected element with given index.
     * Clear current selection if no selected element has that index.
     * @method
     * @param {integer} i - The index, give a negative number to count from end.
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
     * Update current selection, only keep the last selected element.
     * @method
     */
    last() {
        if (this.selection.length) {
            this.selection = [this.selection[this.selection.length - 1]];
            this.length = 1
        }
        return this;
    }
    /**
     * Update current selection, set it to immediate children of each selected elements that match the new selector.
     * @method
     * @param {string} selector - The new query selector.
     */
    children(selector) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            newSelection.push(...(this.selection[i].querySelectorAll(`:scope > ${selector}`)));
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, set it to children of each selected elements that match the new selector.
     * @method
     * @param {string} selector - The new query selector.
     */
    find(selector) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            newSelection.push(...(this.selection[i].querySelectorAll(selector)));
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, unselect elements that do not have children matching the given selector.
     * @method
     * @param {string} selector - The selector.
     * @param {boolean} [match=false] - Set to true to unselect elements that do have childrem matching the
     ** given selector instead.
     */
    filter(selector, match = false) {
        for (let i = this.selection.length - 1; i >= 0; i--) {
            if (Boolean(this.selection[i].querySelector(selector)) === match) {
                this.selection.splice(i, 1);
            }
        }
        this.length = this.selection.length;
        return this;
    }
    /**
     * Update current selection, set it to the parent of each selected elements.
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
     * Update current selection, only keep elements that have the matcher string in their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    includes(matcher) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            if (this.selection[i].textContent.includes(matcher)) {
                newSelection.push(this.selection[i]);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher string as the beginning of their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    startsWith(matcher) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            if (this.selection[i].textContent.startsWith(matcher)) {
                newSelection.push(this.selection[i]);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher string as the ending of their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    endsWith(matcher) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            if (this.selection[i].textContent.endsWith(matcher)) {
                newSelection.push(this.selection[i]);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }
    /**
     * Update current selection, only keep elements that have the matcher string as their textContent.
     * @method
     * @param {string} matcher - The matcher string.
     */
    textIs(matcher) {
        let newSelection = [];
        for (let i = 0; i < this.selection.length; i++) {
            if (matcher === this.selection[i].textContent) {
                newSelection.push(this.selection[i]);
            }
        }
        this.selection = newSelection;
        this.length = newSelection.length;
        return this;
    }

    //---Events---
    /**
     * Add an event listener to all selected elements.
     * @param {string} event - The event name.
     * @param {Function} func - The event handler.
     ** @param {Event} e - The appropriate event object.
     */
    on(event, func) {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].addEventListener(event, func);
        }
        return this;
    }
    /**
     * Trigger a click event to all selected elements.
     * @method
     */
    click() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].click();
        }
        return this;
    }

    //---Get and Set---
    /**
     * Get or set textContent. Affects only the first element on get mode, but affects all selected elements in set mode.
     * @method
     * @param {string} [text=undefined] - The text to set, omit to get.
     * @return {string|this} String in get mode, the keyword this in set mode. An empty string will be returned
     ** if the textContent cannot be retrieved.
     */
    text(text) {
        if (text === undefined) {
            return this.selection.length ? this.selection[0].textContent : "";
        } else {
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].textContent = text;
            }
            return this;
        }
    }
    /**
     * Get or set innerHTML. Affects only the first element on get mode, but affects all selected elements in set mode.
     * @method
     * @param {DOMString} [html=undefined] - The DOM string to set, omit to get.
     * @return {DOMString|this} DOM string in get mode, the keyword this in set mode. An empty string will be returned
     ** if the innerHTML cannot be retrieved.
     */
    html(html) {
        if (html === undefined) {
            return this.selection.length ? this.selection[0].innerHTML : "";
        } else {
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].innerHTML = html;
            }
            return this;
        }
    }
    /**
     * Get or set data. Affects only the first element on get mode, but affects all selected elements in set mode.
     * @method
     * @param {string} name - The name of the data entry.
     * @param {string} [val=undefined] - The value to set, omit to get.
     * @return {Any|this} Something appropriate in get mode, the keyword this in set mode.
     */
    data(name, val) {
        if (val === undefined) {
            return this.selection.length ? this.selection[0].dataset[name] : undefined;
        } else {
            for (let i = 0; i < this.selection.length; i++) {
                this.selection[i].dataset[name] = val;
            }
            return this;
        }
    }
    /**
     * Get, set, or delete an attribute. Affect only the first element on get mode, but affect all selected
     * elements in set or delete mode.
     * Set del to true for delete mode, set val but not del for set mode, omit both val and del for get mode.
     * @method
     * @param {string} name - The name of the attribute.
     * @param {string} [val=undefined] - The value to set.
     * @param {boolean} [del=false] - Whether this attribute should be deleted.
     * @return {Any|this} Something appropriate in get mode, the keyword this in other modes.
     */
    attr(name, val, del) {
        if (val === undefined && !del) {
            return this.selection.length ? this.selection[0][name] : undefined;
        } else {
            if (del) {
                for (let i = 0; i < this.selection.length; i++) {
                    this.selection[i].removeAttribute(name);
                }
            } else {
                for (let i = 0; i < this.selection.length; i++) {
                    this.selection[i].setAttribute(name, val);
                }
            }
            return this;
        }
    }

    //---Insert---
    /**
     * Insert HTML before the beginning of each selected elements.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    before(input) {
        for (let i = 0; i < this.selection.length; i++) {
            //Must have parent node in this insert mode
            if (this.selection[i].parentNode) {
                this.selection[i].insertAdjacentHTML("beforebegin", input);
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
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].insertAdjacentHTML("afterbegin", input);
        }
        return this;
    }
    /**
     * Insert HTML before the end of each selected elements.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    append(input) {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].insertAdjacentHTML("beforeend", input);
        }
        return this;
    }
    /**
     * Insert HTML after the end of each selected elements.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    after(input) {
        for (let i = 0; i < this.selection.length; i++) {
            //Must have parent node in this insert mode
            if (this.selection[i].parentNode) {
                this.selection[i].insertAdjacentHTML("afterend", input);
            }
        }
        return this;
    }

    //---Other---
    /**
     * Get offsetWidth of the first selected element.
     * @method
     * @return {integer} The offsetWidth, or -1 if the offsetWidth cannot be retrieved.
     */
    width() {
        return (this.selection.length ? this.selection[0].offsetWidth : -1);
    }
    /**
     * Get offsetHeight of the first selected element.
     * @method
     * @return {integer} The offsetHeight, or -1 if the offsetHeight cannot be retrieved.
     */
    height() {
        return (this.selection.length ? this.selection[0].offsetHeight : -1);
    }
    /**
     * Loop though each selected element.
     * @method
     * @param {Function} func - The handler.
     ** @param {DOMElement} elem - The current DOM element.
     */
    each(func) {
        for (let i = 0; i < this.selection.length; i++) {
            func(this.selection[i]);
        }
        return this;
    }
};

/**
 * Same as a.request() of content-core except that the request is sent directly in the content script
 * scope and is not privileged.
 * @function
 */
$.request = (details, onload, onerror) => {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                onload(req.responseText);
            } else {
                onerror();
            }
        }
    };

    req.open(details.method, details.url);

    if (details.headers) {
        for (let key in details.headers) {
            req.setRequestHeader(key, details.headers[key]);
        }
    }

    req.send(details.payload || null);
};
