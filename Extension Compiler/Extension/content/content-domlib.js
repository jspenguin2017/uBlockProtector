//The DOM manipulation library for content rules
"use strict";

/**
 * Create a domlib object, shortcut for new $.Object(input).
 * @function
 * @param {string|DOMString} input - The input.
 */
var $ = (input) => {
    return new $.Object(input);
};

/**
 * domlib class.
 * @class
 */
$.Object = class {
    /**
     * Constructor.
     * @param {string|DOMString} input - The input.
     */
    constructor(input) {
        this.input = input;
        this.elem = null;
    }


};
