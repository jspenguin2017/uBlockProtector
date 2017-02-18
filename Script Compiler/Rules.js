//Init, pass in excluded domains
"use strict";
a.init(["360.cn", "apple.com", "ask.com", "baidu.com", "bing.com", "bufferapp.com", "chatango.com",
"chromeactions.com", "easyinplay.net", "ebay.com", "facebook.com", "flattr.com", "flickr.com", "ghacks.net",
"imdb.com", "imgbox.com", "imgur.com", "instagram.com", "jsbin.com", "jsfiddle.net", "linkedin.com", "live.com", "mail.ru",
"microsoft.com", "msn.com", "paypal.com", "pinterest.com", "preloaders.net", "qq.com", "reddit.com", "stackoverflow.com",
"tampermonkey.net", "twitter.com", "vimeo.com", "wikipedia.org", "w3schools.com", "yandex.ru", "youtu.be", "youtube.com",
"xemvtv.net", "vod.pl", "agar.io", "pandoon.info", "fsf.org", "adblockplus.org", "plnkr.co", "exacttarget.com", "dolldivine.com",
"popmech.ru", "calm.com"], ["google", "amazon", "yahoo"]);
//Start
if (a.domCmp(["blockadblock.com"])) {
    //Disable eval() and remove element with ID babasbmsgx on load
    a.filter("eval");
    a.on("load", function () {
        a.$("#babasbmsgx").remove();
    });
}
if (a.domCmp(["sc2casts.com"])) {
    //Lock scriptfailed() and disable setTimeout()
    a.readOnly("scriptfailed", function () { });
    a.filter("setTimeout");
}
if (a.domCmp(["jagranjunction.com"])) {
    //Lock canRunAds and isAdsDisplayed to true
    a.readOnly("canRunAds", true);
    a.readOnly("isAdsDisplayed", true);
}
if (a.domCmp(["usapoliticstoday.com"])) {
    //Disable eval()
    a.filter("eval");
}
if (a.domCmp(["ay.gy"])) {
    //Disable open() before page starts to load and set abgo to an empty function when the page loads
    a.readOnly("open", function () { });
    a.on("load", function () {
        a.win.abgo = function () { };
    });
    //Skip countdown
    const _setInterval = a.win.setInterval;
    a.win.setInterval = function (func) {
        return _setInterval(func, 10);
    };
}
if (a.domCmp(["jansatta.com", "financialexpress.com", "indianexpress.com"])) {
    //Lock RunAds to true
    a.readOnly("RunAds", true);
}
if (a.domCmp(["livemint.com"])) {
    //Lock canRun1 to true
    a.readOnly("canRun1", true);
}
if (a.domCmp(["userscloud.com"])) {
    //Show hidden div and remove block screen
    a.on("load", function () {
        a.$("#dl_link").show();
        a.$("#adblock_msg").remove();
    });
}
if (a.domCmp(["vidlox.tv"])) {
    //NSFW! Lock xRds to false and cRAds to true
    a.readOnly("xRds", false);
    a.readOnly("cRAds", true);
}
if (a.domCmp(["cwtv.com"])) {
    //Lock wallConfig to false - Thanks to szymon1118
    a.readOnly("wallConfig", false);
}
if (a.domCmp(["theinquirer.net"])) {
    //Lock _r3z to true
    a.readOnly("_r3z", true);
}
if (a.domCmp(["tweaktown.com"])) {
    //(Workaround) Apply important styles and remove block screen
    a.on("load", function () {
        //Force enable scrolling
        a.$("head").append("<style> html, body { overflow: scroll !important; } </style>");
        //Watch and remove block screen
        const blockScreenRemover = function () {
            if (a.$("body").children("div").last().text().indexOf("Ads slowing you down?") > -1) {
                a.$("body").children("div").last().remove();
                a.$("body").children("div").last().remove();
            } else {
                a.win.setTimeout(blockScreenRemover, 500);
            }
        };
        a.win.setTimeout(blockScreenRemover, 500);
    });
}
if (a.domCmp(["ratemyprofessors.com"])) {
    //Lock adBlocker to false and prevent listening resize event (window self-destroys on resize, bug or feature?)
    a.readOnly("adBlocker", false);
    a.filter("addEventListener", "/resize/i");
}
if (a.domCmp(["gamepedia.com"])) {
    //(Workaround) Remove element
    a.on("load", function () {
        $("#atflb").remove();
    });
}
if (a.domCmp(["cbox.ws"])) {
    //Lock koddostu_com_adblock_yok to true
    a.readOnly("koddostu_com_adblock_yok", true);
}
if (a.domCmp(["ahmedabadmirror.com"])) {
    //Filter keyword from document.addEventListener()
    a.filter("document.addEventListener", /function \_0x/);
    //document.addEventListener should not be native code, but they are expecting native code
    a.protectFunc.masks[1] = "function addEventListener() { [native code] }";
}
if (a.domCmp(["pinkrod.com", "wetplace.com"])) {
    //NSFW! Lock getAd and getUtm to an empty function
    a.readOnly("getAd", function () { });
    a.readOnly("getUtm", function () { });
}
if (a.domInc(["hackintosh"])) {
    //Undo BlockAdblock styles
    a.readOnly("eval", function () {
        var c = "babasbmsgx";
        document.getElementById(c).style.setProperty("visibility", "hidden", "important");
        document.getElementById(c).style.setProperty("display", "none", "important");
        document.getElementById(c).style.setProperty("opacity", "0", "important");
        document.getElementById(c).style.setProperty("animation", "none", "important");
        document.body.style.setProperty("visibility", "visible", "important");
    });
}
if (a.domCmp(["tvregionalna24.pl"])) {
    //Patch videojs to show YouTube iframe immediately - Thanks to F4z
    let text = [];
    a.readOnly("videojs", function (a, b, func) {
        let temp = "(" + func.toString().match(/var _ended=(.*);var _skipButton/)[1] + ")();";
        temp = temp.replace("player.dispose();", "");
        text.push(temp);
    });
    a.on("load", function replace() {
        if (text.length > 0 && $(".vjs-poster").length > 0) {
            for (let i = 0; i < text.length; i++) {
                a.win.eval(text[i]);
            }
        } else {
            a.win.setTimeout(replace, 1000);
        }
    });
}
if (a.domCmp(["tvn.pl", "tvnstyle.pl", "tvnturbo.pl"])) {
    //tvn.pl and related
    //(Workaround) Replace player - Thanks to mikhoul, szymon1118, and xxcriticxx
    //Potential related domains:  "tvnfabula.pl", "itvnextra.pl", "tvn24bis.pl", "ttv.pl", "player.pl", "x-news.pl", "tvn7.pl", "itvn.pl"
    const homePages = ["http://www.tvn.pl/", "http://www.tvn7.pl/", "http://www.tvnstyle.pl/", "http://www.tvnturbo.pl/"];
    //Homepages are partially fixed and are handled by List
    if (!homePages.includes(unsafeWindow.document.location.href)) {
        a.on("load", function () {
            a.$(".videoPlayer").parent().after(a.nativePlayer(a.$(".videoPlayer").data("src"))).remove();
        });
    }
}
if (a.domCmp(["abczdrowie.pl", "autokrata.pl", "autokult.pl", "biztok.pl", "gadzetomania.pl", "hotmoney.pl", "kafeteria.pl",
            "kafeteria.tv", "komediowo.pl", "komorkomania.pl", "money.pl", "pudelek.tv", "sfora.pl", "snobka.pl",
            "wawalove.pl", "wp.pl", "wp.tv", "wrzuta.pl", "pudelek.pl"])) {
    //Variables
    let mid; //Media ID of next video
    let midArray1 = []; //Media IDs method 1
    let midArray2 = []; //Media IDs method 2
    let url = null; //URL of the next video
    let replaceCounter = 0; //The number of video players that are replaced
    let loadCounter = 0; //The index of next item to load
    let networkBusy = false; //A flag to prevent sending a new request before the first one is done
    let networkErrorCounter = 0; //Will stop sending request if this is over 5
    let isInBackground = false; //A flag to prevent excessive CPU usage when the tab is in background
    const containerMatcher = domCmp(["wp.tv"], true) ? ".player__container" : ".wp-player-outer";
    //Main function
    const main = function () {
        //Do not tick when in background
        if (isInBackground) {
            return;
        }
        //Mid grabbing method 1
        if (a.win.WP.player.list.length > midArray1.length) {
            let thisMid;
            try {
                thisMid = a.win.WP.player.list[midArray1.length].p.url;
            } catch (err) {
                a.out.error("AdBlock Protector failed to find media ID with method 1! ");
            }
            if (thisMid) {
                midArray1.push(thisMid.split("=")[1]);
            }
        }
        //Mid grabbing method 2
        if (a.$(containerMatcher).length > 0) {
            const elem = a.$(".wp-player-outer").first().find(".titlecont a.title");
            let thisMid = elem.attr("href");
            //Check if we got the element
            if (thisMid) {
                midArray2.push(thisMid.match(/mid[=,]([0-9]+)/)[1].toString());
                //We will destroy the player anyway, we can just remove this so we don't grab it twice
                elem.remove();
            }
        }
        //See if we need to load next URL
        if (loadCounter === replaceCounter) {
            //Check flag and error counter
            if (networkBusy || networkErrorCounter > 5) {
                return;
            }
            //Get media ID
            let mid;
            let midArray = (midArray1.length > midArray2.length) ? midArray1 : midArray2;
            if (midArray.length > loadCounter) {
                mid = midArray[loadCounter];
            } else {
                return;
            }
            //Get media JSON, we don't need to check if mid is found since the function will return if it is not
            networkBusy = true;
            a.$.get("http://wp.tv/player/mid," + mid + ",embed.json").done(function (response) {
                //Try to find media URL
                try {
                    for (let i = 0; i < response.clip.url.length; i++) {
                        let item = response.clip.url[i];
                        if (item.quality === "HQ" && item.type.startsWith("mp4")) {
                            url = item.url;
                            break;
                        }
                    }
                    //Check if we found the URL
                    if (!url) {
                        throw "Media URL Not Found";
                    }
                    //Update counter
                    loadCounter++;
                    //Reset error counter
                    networkErrorCounter = 0;
                } catch (err) {
                    a.out.error("AdBlock Protector failed to find media URL! ");
                    networkErrorCounter += 1;
                }
            }).fail(function () {
                a.out.error("AdBlock Protector failed to load media JSON! ");
                networkErrorCounter += 0.5;
            }).always(function () {
                //Update flag
                networkBusy = false;
            });
        } else {
            //Patch player
            if (a.$(containerMatcher).length > 0) {
                a.$(containerMatcher).first().after(a.nativePlayer(url)).remove();
                //Update variables and counter
                url = null;
                replaceCounter++;
            }
        }
    };
    //Init
    onEvent("load", function () {
        //This function is quite light weight, we should be fine
        a.win.setInterval(main, 1000);
    });
    //Update is in background flag
    a.on("focus", function () {
        isInBackground = false;
    });
    a.on("blur", function () {
        isInBackground = true;
    });
}
if (a.domCmp(["thewindowsclub.com"])) {
    //Inject syntax breaker to "(function(a,b,c,d,e){e=a.createElement(b);"
    a.crashScript("(function(a,b,c,d,e){e=a.createElement(b);");
}
if (a.domCmp(["foxvalleyfoodie.com"])) {
    //Only allow certain includes
    a.patchHTML(function (html) {
        return html.replace(/<script.*\/wp-includes\/js\/(?!jquery|comment|wp-embed).*<\/script>/g, "<script>console.error('Uncaught AdBlock Error: Admiral is not allowed on this device! ');</script>");
    });
}
if (a.domCmp(["mid-day.com", "happytrips.com"])) {
    //Lock canRun to true
    a.readOnly("canRun", true);
}
if (a.domCmp(["ewallstreeter.com"])) {
    //Lock OAS_rdl to 1
    a.readOnly("OAS_rdl", 1);
}
if (a.domCmp(["megogo.net"])) {
    //Lock adBlock to false and showAdBlockMessage to an empty function
    a.readOnly("adBlock", false);
    a.readOnly("showAdBlockMessage", function () { });
}
if (a.domCmp(["elektroda.pl"])) {
    //Filter keywords from setTimeout()
    a.filter("setTimeout", /adBlockTest\.offsetHeight/);
}
if (a.domCmp(["anandabazar.com"])) {
    //Lock canRunAds to false and exclude this domain from generic protectors
    a.readOnly("canRunAds", false);
    a.config.allowGeneric = false;
}
if (a.domCmp(["wtkplay.pl"])) {
    //Lock can_run_ads to true
    a.readOnly("can_run_ads", true);
}
if (a.domCmp(["betterdocs.net"])) {
    //Filter keywords from eval()
    a.filter("eval", /eval\(function\(p\,a\,c\,k\,e\,d\)/);
}
if (a.domCmp(["webqc.org"])) {
    //Filter keywords from setTimeout()
    a.filter("setTimeout", /function\(\)\{R\(e\)\}/);
}
if (a.domCmp(["wired.com"])) {
    //Lock google_onload_fired to true and include this domain from generic protectors
    a.readOnly("google_onload_fired", true);
    a.config.allowGeneric = true;
}
if (a.domInc(["knowlet3389.blogspot"])) {
    //Filter keywords from setTimeout
    a.filter("setTimeout", /\$\(\"\#gAds\"\)\.height\(\)/);
}
//Generic, excluded domain check is built in
a.generic();
