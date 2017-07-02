//The DOM manipulation library for content rules, this library behaves differently than jQuery
"use strict";

//=====Shortcuts=====
/**
 * Shortcut for new $.Selection(input).
 * @function
 * @param {string} input - The selector.
 * @return {$.Selection} The Selection object.
 */
var $ = (input) => new $.Selection(input);

//=====Main=====
/**
 * Selection class.
 * Unless otherwise specified, all methods returns the keyword this.
 * @class
 */
$.Selection = class {
    /**
     * Constructor.
     * @param {string} selector - The selector.
     */
    constructor(selector) {
        this.selection = document.querySelectorAll(selector);
        this.length = this.selection.length;
    }

    //---CSS---
    /**
     * Set or update CSS to all selected elements.
     * @param {string} key - The key of the style, use "maxHeight" instead of "max-height" (same for all similar keys).
     * @param {string} val - The value of the style.
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
     * @param {string} [state="block"] - The style to apply, defaults to "block";
     */
    show(state = "block") {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style.display = state;
        }
        return this;
    }
    /**
     * Hide all selected elements. Current state will not be saved. Things may break if you try to show it again.
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
     * Remove classes from all selected elements.
     * @method
     * @param {string} ...args - Classes to remove
     */
    rmClass(...args) {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].classList.remove(...args);
        }
        return this;
    }

    //---Selection---
    /**
     * Update current selection, only keep the first selected element.
     * @method
     */
    first() {
        if (this.selection.length) {
            this.selection = [this.selection[0]];
            this.length = 1
        } //Ignore if nothing is selected
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
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, find immediate children that match the selector from first selected element.
     * @method
     * @param {string} selector - The selector.
     */
    children(selector) {
        if (this.selection.length) {
            this.selection = this.selection[0].querySelectorAll(`:scope > ${selector}`);
            this.length = this.selection.length;
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, find children that match the selector from first selected element.
     * @method
     * @param {string} selector - The selector.
     */
    find(selector) {
        if (this.selection.length) {
            this.selection = this.selection[0].querySelectorAll(selector);
            this.length = this.selection.length;
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, set it to the parent of the first selected element.
     * @method
     */
    parent() {
        if (this.selection.length) {
            const e = this.selection[0].parentNode;
            if (e) {
                this.selection = [e];
            } else {
                //The first node does not have a parent, set itself as the new selection
                this.selection = [this.selection[0]];
            }
            this.length = 1;
        } //Ignore if nothing is selected
        return this;
    }
    /**
     * Update current selection, set it to the first element that includes the matcher string.
     * @method
     * @param {string} matcher - The matcher.
     */
    includes(matcher) {
        let index = -1
        for (let i = 0; i < this.selection.length; i++) {
            if (this.selection[i].textContent.includes(matcher)) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            this.selection = [];
            this.length = 0;
        } else {
            this.selection = [this.selection[index]];
            this.length = 1;
        }
        return this;
    }
    /**
     * Update current selection, set it to the first element where its textContent is exactly the matcher string.
     * @method
     * @param {string} matcher - The matcher.
     */
    textIs(matcher) {
        let index = -1
        for (let i = 0; i < this.selection.length; i++) {
            if (this.selection[i].textContent === matcher) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            this.selection = [];
            this.length = 0;
        } else {
            this.selection = [this.selection[index]];
            this.length = 1;
        }
        return this;
    }

    //---Events---
    /**
     * Trigger a click to all selected elements.
     * @method
     */
    click() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].click();
        }
        return this;
    }

    //---Utilities---
    /**
     * Get or set textContent of first selected element.
     * @method
     * @param {string} [text=undefined] - The text to set, omit to get.
     * @return {this|string} The keyword this in set mode, string in get mode. An empty string will be returned
     ** if the textContent cannot be retrieved.
     */
    text(text) {
        if (text === undefined) {
            return this.selection.length ? this.selection[0].textContent : "";
        } else {
            if (this.selection.length) {
                this.selection[0].textContent = text;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Get or set innerHTML of first selected element.
     * @method
     * @param {DOMString} [html=undefined] - The DOM string to set, omit to get.
     * @return {this|DOMString} The keyword this in set mode, DOM string in get mode. An empty string will be returned
     ** if the innerHTML cannot be retrieved.
     */
    html(html) {
        if (html === undefined) {
            return this.selection.length ? this.selection[0].innerHTML : "";
        } else {
            if (this.selection.length) {
                this.selection[0].innerHTML = html;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Get or set data property, only affect the first selected element.
     * @method
     * @param {string} name - The name of the data entry.
     * @param {string} [val=undefined] - The value to set, omit to get.
     * @return {this|string|undefined} The keyword this in set mode, string in get mode. Undefined will be returned
     ** if the data cannot be retrieved.
     */
    data(name, val) {
        if (val === undefined) {
            return this.selection.length ? this.selection[0].dataset[name] : undefined;
        } else {
            if (this.selection.length) {
                this.selection[0].dataset[name] = val;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Get, set, or delete an attribute, only affect the first selected element.
     * @method
     * @param {string} name - The name of the attribute.
     * @param {string} [val=undefined] - The value to set, omit to get.
     * @param {boolean} [del=false] - Whether this attribute should be deleted.
     * @return {this|Any} The keyword this in set and delete mode, anything appropriate in get mode. Undefined will be returned
     ** if the attribute cannot be retrieved.
     */
    attr(name, val, del) {
        if (val === undefined && !del) {
            return this.selection.length ? this.selection[0][name] : undefined;
        } else {
            if (this.selection.length) {
                if (del) {
                    this.selection[0].removeAttribute(name);
                } else {
                    this.selection[0].setAttribute(name, val);
                }
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Insert HTML before the beginning of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    before(input) {
        if (this.selection.length && this.selection[0].parentNode) {
            this.selection[0].insertAdjacentHTML("beforebegin", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Insert HTML after the beginning of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    prepend(input) {
        if (this.selection.length) {
            this.selection[0].insertAdjacentHTML("afterbegin", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Insert HTML before the end of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    append(input) {
        if (this.selection.length) {
            this.selection[0].insertAdjacentHTML("beforeend", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Insert HTML after the end of the first selected element.
     * @method
     * @param {DOMString} input - The DOM string to insert.
     */
    after(input) {
        if (this.selection.length && this.selection[0].parentNode) {
            this.selection[0].insertAdjacentHTML("afterend", input);
        } //Ignore if cannot insert
        return this;
    }
    /**
     * Get offsetWidth of first selected element
     * @method
     * @return {integer} The offsetWidth, or -1 if the offsetWidth cannot be retrieved.
     */
    width() {
        return this.selection.length ? this.selection[0].offsetWidth : -1;
    }
    /**
     * Get offsetHeight of first selected element
     * @method
     * @return {integer} The offsetHeight, or -1 if the offsetHeight cannot be retrieved.
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
        for (let i = 0; i < this.selection.length; i++) {
            func(this.selection[i]);
        }
        return this;
    }
};

//=====Utilities=====
/**
 * Same as a.request(), but request directly in the content script.
 * @function
 */
$.request = (details, onload, onerror) => {
    let req = new XMLHttpRequest();
    //Event handler
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            if (req.responseText === null) {
                onerror();
            } else {
                onload(req.responseText);
            }
        }
    };
    //Create request
    req.open(details.method, details.url);
    //Set headers
    if (details.headers) {
        for (let key in details.headers) {
            req.setRequestHeader(key, details.headers[key]);
        }
    }
    //Send request
    req.send(details.payload || null);
};
