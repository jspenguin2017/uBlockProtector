//The DOM manipulation library for content rules
"use strict";

//=====Shortcuts=====
/**
 * Create an appropriate object.
 * @function
 * @param {string|DOMString} input - The selector or DOM string.
 * @return {$.Selection|$.Element} The Selection or Element object.
 */
var $ = (input) => {
    return new (input.charAt(0) === '<' ? $.Element(input) : $.Selection(input));
};

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
     * Show an element.
     * @method
     * @param {string} [state="block"] - The style to apply, defaults to "block";
     */
    show(state = "block") {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].style.display = state;
        }
    }
    /**
     * Remove all selected elements from DOM.
     * @method
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
