//The DOM manipulation library for content rules
"use strict";

//=====Shortcuts=====
/**
 * Create a Selection object, shortcut for new $.Selection(selector).
 * @function
 * @param {string} selector - The selector.
 * @return {$.Selection} The Selection object.
 */
var $ = (selector) => new $.Selection(selector);
/**
 * Create an Element object, shortcut for new $.Element(input).
 * @function
 * @param {DOMString} input - The DOM string.
 * @return {$.Element} The Element object.
 */
$.parse = (input) => new $.Element(input);

//=====Main=====
/**
 * Selection class.
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
    /**
     * Remove all selected elements from DOM.
     * @function
     */
    remove() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].remove();
        }
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

//=====Other Utilities=====
/**
 * Remove element by ID.
 * @function
 * @param {string} id - The ID of the element to remove.
 */
$.rmID = (id) => {
    const elem = document.getElementById(id);
    elem && elem.remove();
};
