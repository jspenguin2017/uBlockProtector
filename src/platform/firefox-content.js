/**
 * Special content script for Firefox.
 */
"use strict";

{
    // Simply removing the node does not prevent execution of the script
    const _remove = Element.prototype.remove;
    const remove = function () {
        if (this.tagName === "SCRIPT") {
            this.textContent = "";
        }
        _remove.call(this);
    };
    Element.prototype.remove = remove;
}
