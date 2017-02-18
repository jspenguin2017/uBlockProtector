//AdBlock Protector Core Library
"use strict";

//=====Declaration=====
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

//=====Configurations=====
a.config = {};
/**
 * Whether debug strings should be logged.
 * @var {bool}
 */
a.config.debugMode = true;
/**
 * Whether generic protectors should run.
 * This settings can be overwritten by a rule.
 * @var {bool}
 */
a.config.allowGeneric = true;

//=====Mods=====
/**
 * Apply all mods.
 * @function
 */
a.mod = function () {
    //Facebook mods
    if (a.domCmp(["facebook.com"], true)) {
        //Add Jump To Top button
        const addJumpToTop = function () {
            //Stop if the button already exist, this shouldn't be needed, but just to be sure
            if (a.$("#fbtools_jumptotop_btn").length > 0) {
                return;
            }
            //Check if the nav bar is there
            const navBar = a.$("div[role='navigation']");
            if (navBar) {
                //Present, insert button
                navBar.append(`<div class="_4kny _2s24" id="fbtools_jumptotop_btn"><div class="_4q39"><a class="_2s25" href="javascript: void(0);">Top</a></div></div>`);
                a.$("#fbtools_jumptotop_btn").click(function () {
                    a.win.scrollTo(a.win.scrollX, 0);
                });
            } else {
                //Wait a little bit for the window to load, for some reason load event isn't working
                a.win.setTimeout(addJumpToTop, 1000);
            }
        }
        //Hide People You May Know
        //Based on Facebook unsponsored by solskido
        //https://greasyfork.org/en/scripts/22210-facebook-unsponsored
        const hidePeopleYouMayKnow = function () {
            //If body is not loaded, we'll wait a bit, for some reason load event isn't working
            if (!a.$("body")) {
                a.win.setTimeout(hidePeopleYouMayKnow, 1000);
                return;
            }
            //Selector constants
            const streamSelector = "div[id^='topnews_main_stream']";
            const feedSelector = "div[id^='hyperfeed_story_id']";
            const badSelectors = ["a[href^='/friends/requests/']"];
            //Mutation handler
            const handler = function () {
                const stream = a.doc.querySelector(streamSelector);
                if (!stream) {
                    return;
                }
                const feed = stream.querySelectorAll(feedSelector);
                if (!feed.length) {
                    return;
                }
                for (let i = 0; i < feed.length; i++) {
                    remove(feed[i]);
                }
            };
            //Feed remover
            const remove = function (feed) {
                if (!feed) {
                    return;
                }
                for (let i = 0; i < badSelectors.length; i++) {
                    if (feed.querySelectorAll(badSelectors[i]).length) {
                        feed.remove();
                    }
                }
            };
            //Set up mutation observer
            const observer = new a.win.MutationObserver(handler);
            observer.observe(a.doc.querySelector("body"), {
                "childList": true,
                "subtree": true
            });
        };
        //Check configurations
        if (a.mod.Facebook_JumpToTop) {
            addJumpToTop();
        }
        if (a.mod.Facebook_HidePeopleYouMayKnow) {
            hidePeopleYouMayKnow();
        }
    }
    //Blogspot mods
    if (a.mod.Blogspot_AutoNCR && a.domInc(["blogspot"], true) && !a.domCmp(["blogspot.com"], true) && a.c.topFrame) {
        //Auto NCR (No Country Redirect)
        const name = a.dom.replace("www.", "").split(".")[0];
        const path = a.win.location.href.split("/").slice(3).join('/');
        a.win.location.href = "http://" + name + ".blogspot.com/ncr/" + path;
    }
};
/**
 * Whether Jump To Top button should be added to Facebook page.
 * @const {bool}
 */
a.mod.Facebook_JumpToTop = true;
/**
 * Whether People You May Know should be hidden from Facebook.
 * @const {bool}
 */
a.mod.Facebook_HidePeopleYouMayKnow = true;
/**
 * Whether blogspot blogs should be automatically redirected to NCR (No Country Redirect) version.
 * Does not work if the blog is not top frame.
 * @const {bool}
 */
a.mod.Blogspot_AutoNCR = true;

//=====Common Constants=====
/**
 * The unsafeWindow.
 * @const {Object}
 */
a.win = unsafeWindow;
/**
 * The document of unsafeWindow.
 * @const {Object}
 */
a.doc = a.win.document;
/**
 * The console of unsafeWindow.
 * @const {Object}
 */
a.out = a.win.console;
/**
 * The domain of current document.
 * @const {string}
 */
a.dom = a.doc.domain;
/**
 * jQuery, will be available after a.init() is called.
 * @const {Object}
 */
a.$ = "jQuery not initialized";

//=====Uncommon Constants=====
a.c = {};
/**
 * The home page of this project.
 * @const {boolean}
 */
a.c.homePage = "https://x01x012013.github.io/AdBlockProtector/";
/**
 * Whether this script is running on the top frame.
 * @const {boolean}
 */
a.c.topFrame = (function () {
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
    //Load jQuery
    a.$ = jQueryFactory(a.win, true);
    jQueryColorLoader(a.$);
};
