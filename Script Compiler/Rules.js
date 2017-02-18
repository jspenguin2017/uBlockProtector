//AdBlock Protector Core Library
/**
 * Get a description string of this library.
 * @function
 * @returns {string} A description string of this library.
 */
const a = function () {
    return "AdBlock Protector Core Library " + a.VERSION;
};
/**
 * The version of this library.
 * @const {string}
 */
a.VERSION = "0.1";
//=====Common Constants=====
/**
 * The unsafeWindow.
 * @const {Object}
 */
a.win = unsafeWindow;
/**
 * The domain of current document.
 * @const {string}
 */
a.dom = a.win.document.domain;
/**
 * Whether this script is running on the top frame.
 * @const {boolean}
 */
a.topFrame = (function () {
    try {
        return a.win.self === a.win.top;
    } catch (err) {
        //a.win.top was not accessible due to security policies (means we are not top frame)
        return false;
    }
})();
//=====Initializers=====
/**
 * Initialize constants, protect functions, and activate mods.
 * @function
 */
a.init = function () {

};
/**
 * Initialize jQuery, it can be accessed with a.$ after calling this function.
 * @param {boolean} [createGlobal=false] - Whether or not identifier should be created to a.win.
 * @param {boolean} [reInit=false] - Whether or not jQuery should be re-initialized if it is already present.
 * @function
 */
a.init$ = function (createGlobal, reInit) {
    if (!a.$ || reInit) {
        a.$ = jQueryFactory(a.win, !createGlobak);
        //jQuery
    }
};
