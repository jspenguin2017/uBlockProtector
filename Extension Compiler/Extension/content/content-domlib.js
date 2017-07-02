//The DOM manipulation library for content rules
"use strict";

//=====Shortcuts=====
/**
 * Create an appropriate object.
 * @function
 * @param {string|DOMString} input - The selector or DOM string.
 * @return {$.Selection|$.Element} The Selection or Element object.
 */
var $ = (input) => input.charAt(0) === '<' ? new $.Element(input) : new $.Selection(input);

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
     * Set CSS to all selected elements.
     * @param {string} key - The name of the style.
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
     * Hide all selected elements.
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
     * Update current selection, apply new selector to the first selected element.
     * @method
     * @param {string} selector - The selector.
     */
    children(selector) {
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
     * Get or set data property.
     * @param {string} name - The name of the property.
     * @param {string} [val=undefined] - The value to set, omit to get.
     * @return {this|string|undefined} The keyword this in set mode, string in get mode. Undefined will be returned
     ** if the data cannot be retrieved.
     */
    data(name, val) {
        if (val === undefined) {
            if (this.selection.length) {
                return this.selection[0].dataset[name];
            } else {
                return undefined;
            }
        } else {
            if (this.selection.length) {
                this.selection[0].dataset[name] = val;
            } //Ignore if nothing is selected
            return this;
        }
    }
    /**
     * Insert HTML after the first selected element.
     * @param {DOMString} input - The DOM string to insert.
     */
    after(input) {
        if (this.selection.length && this.selection[0].parentNode) {
            this.selection[0].insertAdjacentHTML("afterend", input);
        } //Ignore if cannot insert
        return this;
    }
};
/**
 * Element class.
 * @class
 */
$.Element = class {
    /**
     * Constructor.
     * @param {DOMString} input - The DOM string.
     */
    constructor(input) {
        this.input = input;
    }
};
