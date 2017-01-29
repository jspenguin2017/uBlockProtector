// ==UserScript==
// @name AdBlock Protector Script Dropper
// @description This is a dropper as a workaround for Greasemonkey
// @author X01X012013
// @version 1.0.3
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant none
// @run-at document-start
// @homepage https://x01x012013.github.io/AdBlockProtector/
// @supportURL https://github.com/X01X012013/AdBlockProtector/issues
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.Dropper.user.js
// ==/UserScript==

//Load script
var request = new XMLHttpRequest();
request.open('GET', 'https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js', false);
request.send(null);
//Check load state and drop script
if (request.status === 200) {
    eval(request.responseText.replace("(function () {", "(function () { var unsafeWindow = window;"));
} else {
    alert('Could not load AdBlock Protector. ');
}
