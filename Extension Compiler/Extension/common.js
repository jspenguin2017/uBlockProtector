//Constants, used by both background and content script
"use strict";

/**
 * The main namespace.
 * @const {Namespace}
 */
var a = {};

/**
 * Whether the extension is loaded in debug mode.
 * The compiler is responsible in hard coding this switch.
 * @const {boolean}
 */
a.debugMode = true; //@pragma-debug-switch
//Debug mode warning
a.debugMode && console.warn("uBlock Protector Extension is loaded in debug mode");
