// ==UserScript==
// @name uBlock Protector Script
// @description An anti-adblock defuser for uBlock Origin
// @author jspenguin2017
// @version 8.19
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_openInTab
// @grant window.close
// @grant GM_registerMenuCommand
// @connect foxvalleyfoodie.com
// @connect tvnplayer.pl
// @connect xmc.pl
// @connect wp.tv
// @connect sagkjeder.no
// @connect mtgx.tv
// @connect canal-plus.com
// @connect *
// @run-at document-start
// @homepage https://jspenguin2017.github.io/uBlockProtector/
// @supportURL https://github.com/jspenguin2017/uBlockProtector/issues
// @downloadURL https://github.com/jspenguin2017/uBlockProtector/raw/master/uBlockProtector.user.js
// @license GNU GPL v3
// ==/UserScript==
//
// ===== PLEASE READ =====
// This Userscript is intended to be used with uBlock Protector List.
// Visite our home page for more information: https://jspenguin2017.github.io/uBlockProtector/
// =======================
let a = {};