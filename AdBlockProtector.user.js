// ==UserScript==
// @name AdBlock Protector Script
// @description Ultimage solution against AdBlock detectors
// @author X01X012013
// @version 6.26
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @connect *
// @run-at document-start
// @homepage https://x01x012013.github.io/AdBlockProtector/
// @supportURL https://github.com/X01X012013/AdBlockProtector/issues
// @downloadURL https://github.com/X01X012013/AdBlockProtector/raw/master/AdBlockProtector.user.js
// @require https://github.com/X01X012013/AdBlockProtector/raw/master/jQuery/Core.Factory.3.1.1.min.js
// @require https://github.com/X01X012013/AdBlockProtector/raw/master/jQuery/Color.Loader.2.1.2.min.js
// @require https://github.com/X01X012013/AdBlockProtector/raw/master/Script%20Compiler/Core.js
// ==/UserScript==
"use strict";
//Init, pass in excluded domains
a.init(["360.cn", "apple.com", "ask.com", "baidu.com", "bing.com", "bufferapp.com", "chatango.com",
"chromeactions.com", "easyinplay.net", "ebay.com", "facebook.com", "flattr.com", "flickr.com", "ghacks.net",
"imdb.com", "imgbox.com", "imgur.com", "instagram.com", "jsbin.com", "jsfiddle.net", "linkedin.com", "live.com",
"mail.ru", "microsoft.com", "msn.com", "paypal.com", "pinterest.com", "preloaders.net", "qq.com", "reddit.com",
"stackoverflow.com", "tampermonkey.net", "twitter.com", "vimeo.com", "wikipedia.org", "w3schools.com",
"yandex.ru", "youtu.be", "youtube.com", "xemvtv.net", "vod.pl", "agar.io", "pandoon.info", "fsf.org",
"adblockplus.org", "plnkr.co", "exacttarget.com", "dolldivine.com", "popmech.ru", "calm.com"],
["google", "amazon", "yahoo"]);
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
    //Inject CSS and remove block screen
    a.on("load", function () {
        //Force enable scrolling
        a.css("html, body { overflow: scroll; }");
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
    //Lock adBlocker to false and filter keywords from addEventListener()
    a.readOnly("adBlocker", false);
    a.filter("addEventListener", "/resize/i");
}
if (a.domCmp(["gamepedia.com"])) {
    //(Workaround) Remove element on load
    a.on("load", function () {
        a.$("#atflb").remove();
    });
}
if (a.domCmp(["cbox.ws"])) {
    //Lock koddostu_com_adblock_yok to true
    a.readOnly("koddostu_com_adblock_yok", true);
}
if (a.domCmp(["ahmedabadmirror.com"])) {
    //Filter keywords from document.addEventListener()
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
        if (text.length > 0 && a.$(".vjs-poster").length > 0) {
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
    //Replace player - Thanks to mikhoul, szymon1118, and xxcriticxx
    //Potential related domains: "tvnfabula.pl", "itvnextra.pl", "tvn24bis.pl", "ttv.pl", "player.pl",
    //"x-news.pl", "tvn7.pl", "itvn.pl"
    const homePages = ["http://www.tvn.pl/", "http://www.tvn7.pl/", "http://www.tvnstyle.pl/",
"http://www.tvnturbo.pl/"];
    //Homepages are partially fixed and are handled by List
    if (!homePages.includes(a.doc.location.href)) {
        a.on("load", function () {
            a.$(".videoPlayer").parent().after(a.nativePlayer(a.$(".videoPlayer").data("src"))).remove();
        });
    }
}
if (a.domCmp(["abczdrowie.pl", "autokrata.pl", "autokult.pl", "biztok.pl", "gadzetomania.pl", "hotmoney.pl",
"kafeteria.pl", "kafeteria.tv", "komediowo.pl", "komorkomania.pl", "money.pl", "pudelek.tv", "sfora.pl",
"snobka.pl", "wawalove.pl", "wp.pl", "wp.tv", "wrzuta.pl", "pudelek.pl"])) {
    //wp.pl and related
    //Set a cookie to prevent block screen
    a.cookie("ABCABC", "true");
    //Replace player - Thanks to szymon1118
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
    const containerMatcher = a.domCmp(["wp.tv"], true) ? ".player__container" : ".wp-player-outer";
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
    a.on("load", function () {
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
    //Crash script by keywords
    a.crashScript("(function(a,b,c,d,e){e=a.createElement(b);");
}
if (a.domCmp(["foxvalleyfoodie.com"])) {
    //Only allow certain script includes
    a.patchHTML(function (html) {
        return html.replace(/<script.*\/wp-includes\/js\/(?!jquery|comment|wp-embed).*<\/script>/g,
"<script>console.error('Uncaught AdBlock Error: Admiral is not allowed on this device! ');</script>");
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
    //Lock google_onload_fired to true and the rest will be taken care by generic protectors
    a.readOnly("google_onload_fired", true);
}
if (a.domInc(["knowlet3389.blogspot"])) {
    //(Could be redundant) Filter keywords from setTimeout()
    a.filter("setTimeout", /\$\(\"\#gAds\"\)\.height\(\)/);
}
if (a.domCmp(["freegameserverhost.com"])) {
    //Inject CSS
    a.css("#fab13 { height: 11px; }");
}
if (a.domCmp(["elahmad.com"])) {
    //Inject CSS
    a.css("#adblock { height: 1px; }");
}
if (a.domCmp(["mrtzcmp3.net"])) {
    //Inject CSS
    a.css(".rtm_ad { height: 1px; }");
}
if (a.domCmp(["bknime.com", "go4up.com", "debrido.com"])) {
    //Inject CSS
    a.css(".myTestAd { height: 1px; }");
}
if (a.domCmp(["debridfast.com", "getdebrid.com", "debrid.us", "leecher.us"])) {
    //Inject CSS and edit HTML on idle
    a.css(".myTestAd, .my24Ad, .nabil { height: 1px; }");
    a.on("DOMContentLoaded", function () {
        a.$("#simpleAd").html(`<p style="display:none;">debridfast.com</p>`);
    })
}
if (a.domCmp(["bg-gledai.tv"])) {
    //Inject CSS
    a.css(".myAd { height: 1px; }");
}
if (a.domCmp(["thepcspy.com"])) {
    //Inject CSS and remove element on idle
    a.css(".myTestAd { height: 1px; }");
    a.css(".blocked { display: none; }");
    a.on("DOMContentLoaded", function () {
        a.$(".blocked").remove();
    })
}
if (a.domCmp(["vg.no", "e24.no"])) {
    //Inject CSS
    a.css(".ad { display: none; }");
}
if (a.domCmp(["automobile-sportive.com"])) {
    //Inject CSS
    a.css(".myTestAd { height: 51px; display: none; }");
}
if (a.domCmp(["snsw.us"])) {
    //Inject CSS
    a.css("#ad_1 { height: 1px; }");
}
if (a.domCmp(["urlchecker.net"])) {
    //Inject CSS
    a.css("#adchecker { height: 20px; }");
}
if (a.domCmp(["skiplimite.tv"])) {
    //Inject CSS
    a.css("div.addthis_native_toolbox + div[id] { height: 12px; }");
}
if (a.domCmp(["filecore.co.nz"])) {
    //Inject CSS
    a.css(".adsense { height: 5px; }");
}
if (a.domCmp(["thomas-n-ruth.com"])) {
    //Inject CSS
    a.css(".Google { height: 5px; }");
}
if (a.domCmp(["interfans.org"])) {
    //Inject CSS
    a.css(".ad_global_header { height: 1px; display: none; }");
}
if (a.domCmp(["maxdebrideur.com"])) {
    //Inject CSS
    a.css(".clear + div[id] { height: 12px; }");
}
if (a.domCmp(["topzone.lt"])) {
    //Inject CSS
    a.css(".forumAd { height: 1px; display: none; }");
}
if (a.domInc(["nana10"])) {
    //Inject CSS
    a.css("#advert-tracker { height: 1px; }");
}
if (a.domCmp(["plej.tv"])) {
    //Inject CSS
    a.css(".advert_box { height: 1px; }");
}
if (a.domCmp(["mangamint.com"])) {
    //Inject CSS
    a.css(".ad728 { height: 31px; }");
}
if (a.domCmp(["debrideurstream.fr"])) {
    //Inject CSS
    a.css("#content div[id][align=center] { height: 12px; }");
}
if (a.domCmp(["preemlinks.com"])) {
    //Inject CSS
    a.css("#divads { height: 1px; }");
}
if (a.domCmp(["hentai.to"])) {
    //Inject CSS
    a.css("#hentaito123 { height: 11px; }");
}
if (a.domCmp(["prototurk.com"])) {
    //Inject CSS
    a.css("#reklam { height: 1px; }");
}
if (a.domCmp(["mufa.de"])) {
    //Inject CSS
    a.css("#leaderboard { height: 5px; }");
    a.css("#large-rectangle { height: 5px; }");
    a.css("#ad-header-468x60 { height: 5px; }");
}
if (a.domCmp(["watcharab.com"])) {
    //Inject CSS
    a.css("#adblock { height: 5px; }");
}
if (a.domCmp(["freedom-ip.com"])) {
    //Inject CSS
    a.css(".pub_vertical ins, .pub_vertical div { height: 11px; }");
}
if (a.domCmp(["wakanim.tv"])) {
    //Inject CSS
    a.css("#detector { display: none; }");
    a.css("#nopub { display: block; }");
}
if (a.domCmp(["simply-debrid.com"])) {
    //Assign unsafeWindow.adsbygoogle.loaded to true
    a.win.adsbygoogle = {};
    a.win.adsbygoogle.loaded = true;
}
if (a.domCmp(["manga9.com", "mangabee.co"])) {
    //Inject CSS
    a.css(".adblock { height: 31px; }");
}
if (a.domCmp(["onemanga2.com"])) {
    //Inject CSS
    a.css(".afs_ads { height: 5px; }");
}
if (a.domCmp(["mangabird.com"])) {
    //Inject CSS
    a.css(".afs_ads { height: 5px; }");
}
if (a.domCmp(["kodilive.eu"])) {
    //Inject CSS
    a.css(".Ad { height: 5px; }");
}
if (a.domCmp(["backin.net"])) {
    //Inject CSS
    a.css("#divad { height: 31px; }");
}
if (a.domCmp(["mobile-tracker-free.com"])) {
    //Inject CSS
    a.css("#myAds { height: 1px; }");
}
if (a.domCmp(["workupload.com"])) {
    //Inject CSS
    a.always(function () {
        a.css(".adBlock, .adsbygoogle, #sad { height: 11px; }");
    });
}
if (a.domCmp(["intoday.in", "businesstoday.in"])) {
    //Inject style and lock openPopup to an empty function
    a.css("#adbocker_alt { display: none; }");
    a.readOnly("openPopup", function () { });
}
if (a.domCmp(["jc-mp.com"])) {
    //Inject CSS
    a.css(".adsense {width: 1px; height: 1px; visibility: hidden; display: block; position: absolute;}");
}
if (a.domCmp(["mariage-franco-marocain.net"])) {
    //Inject CSS
    a.css("#my_ad_div {height: 1px;}");
}
if (a.domCmp(["happy-hack.ru"])) {
    //Inject CSS
    a.css("#blockblockF4 {visibility:invisible;display:none;} #blockblockF4 td {visibility:invisible;display:" +
"none;} #blockblockF4 td p {visibility:invisible;display:none;} #blockblockD3 {visibility:visible;display:block;}");
}
if (a.domCmp(["forbes.com"])) {
    //Set cookies and skip daily block screen
    if (a.win.location.pathname.includes("/welcome")) {
        a.cookie("welcomeAd", "true", 86400000, "/");
        a.cookie("dailyWelcomeCookie", "true", 86400000, "/");
        a.win.location = cookie("toUrl") || "http://www.forbes.com/";
    }
}
if (a.domCmp(["bitcoinaliens.com"])) {
    //Add bait element
    a.bait("ins", ".adsbygoogle");
}
if (a.domCmp(["osoarcade.com", "d3brid4y0u.info", "fileice.net", "nosteam.ro", "openrunner.com", "easybillets.com",
"spox.fr", "yovoyages.com", "tv3.co.nz", "freeallmusic.info", "putlocker.com", "sockshare.com", "dramapassion.com",
"yooclick.com", "online.ua"])) {
    //Add bait element
    a.bait("div", "#tester");
}
if (a.domCmp(["filecom.net", "upshare.org", "skippyfile.com", "mwfiles.net", "up-flow.org"])) {
    //Add bait element
    a.bait("div", "#add");
}
if (a.domCmp(["leaguesecretary.com", "teknogods.com", "hellsmedia.com"])) {
    //Add bait element
    a.bait("div", "#adpbtest");
}
if (a.domCmp(["freesportsbet.com", "sportsplays.com"])) {
    //Add bait element
    a.bait("div", "#ad-tester");
}
if (a.domCmp(["tgo-tv.com"])) {
    //Add bait element and remove element on load
    a.css("#adb, #bannerad1, .load_stream { display: none; }");
    a.bait("div", "#tester");
    a.on("load", function () {
        a.win.threshold = 1000;
        a.$(".chat_frame").remove();
    })
}
if (a.domCmp(["freegamehosting.nl"])) {
    //Add bait element
    a.bait("div", "#adtest");
}
if (a.domCmp(["theweatherspace.com"])) {
    //Add bait element
    a.bait("div", "#ab-bl-advertisement");
}
if (a.domCmp(["cleodesktop.com"])) {
    //Add bait element
    a.bait("div", "#myTestAd");
}
if (a.domCmp(["imageraider.com"])) {
    //Add bait element
    a.bait("div", "#myGContainer");
}
if (a.domCmp(["voici.fr", "programme-tv.net"])) {
    //Add bait element
    a.bait("div", "#sas_script2");
}
if (a.domCmp(["mil.ink"])) {
    //Add bait element
    a.bait("div", "#ads_div");
}
if (a.domCmp(["stream4free.eu"])) {
    //Add bait element and lock jpayday_alert to 1
    a.bait("div", "#jpayday");
    a.readOnly("jpayday_alert", 1);
}
if (a.domCmp(["lg-firmware-rom.com"])) {
    //Lock killads to true
    a.readOnly("killads", true);
}
if (a.domCmp(["badtv.it", "badtaste.it", "badgames.it", "badcomics.it"])) {
    //Set cookie
    a.cookie("adBlockChecked", "disattivo");
}
if (a.domCmp(["independent.co.uk"])) {
    //Set cookie
    a.cookie("adblock_detected", "ignored");
}
if (a.domCmp(["8muses.com"])) {
    //Crash script by keywords
    a.crashScript("typeof exo");
}
if (a.domCmp(["3dnews.ru"])) {
    //Do a few things
    a.cookie("adblockwarn", "1");
    a.css("#earAds { width: 401px; }");
    a.bait("div", "#earAds");
    a.readOnly("__AT_detected", true);
}
if (a.domCmp(["esmas.com"])) {
    //Lock opened_adbblock to false
    a.readOnly("opened_adbblock", false);
}
if (a.domInc(["pinoy1tv"])) {
    //Lock allowads to 1
    a.readOnly("allowads", 1);
}
if (a.domCmp(["business-standard.com"])) {
    //Lock adsLoaded to 1 and set cookie
    a.readOnly("adsLoaded", 1);
    a.cookie("_pw", "t");
}
if (a.domCmp(["indiatimes.com", "samayam.com", "bangaloremirror.com"])) {
    //Patch HTML
    a.patchHTML(function (html) {
        html = html.replace("\\\\x61\\\\x64\\\\x62", a.c.syntaxBreaker);
        html = html.replace("function initBlock", a.c.syntaxBreaker);
        return html;
    })
}
if (a.domCmp(["thechive.com"])) {
    //Lock stephaneDetector to an object
    a.readOnly("stephaneDetector", {
        hook: function (cb) {
            cb(false);
        },
        init: function () { },
        broadcastResult: function () { }
    });
}
if (a.domCmp(["richonrails.com"])) {
    //Load a JS on idle
    a.on("DOMContentLoaded", function () {
        const adsByGoogleHtml = `"<ins+id="aswift_0_expand"+style="display:inline-table;border:none;height:90px;` +
`margin:0;padding:0;position:relative;visibility:visible;width:750px;background-color:transparent"><ins+id="aswi` +
`ft_0_anchor"+style="display:block;border:none;height:90px;margin:0;padding:0;position:relative;visibility:visib` +
`le;width:750px;background-color:transparent"><iframe+marginwidth="0"+marginheight="0"+vspace="0"+hspace="0"+all` +
`owtransparency="true"+scrolling="no"+allowfullscreen="true"+onload="var+i=this.id,s=window.google_iframe_oncopy` +
`,H=s&amp;&amp;s.handlers,h=H&amp;&amp;H[i],w=this.contentWindow,d;try{d=w.document}catch(e){}if(h&amp;&amp;d&am` +
`p;&amp;(!d.body||!d.body.firstChild)){if(h.call){setTimeout(h,0)}else+if(h.match){try{h=s.upd(h,i)}catch(e){}w.` +
`location.replace(h)}}"+id="aswift_0"+name="aswift_0"+style="left:0;position:absolute;top:0;"+width="750"+frameb` +
`order="0"+height="90"></iframe></ins></ins>"`;
        a.$.ajax({
            url: a.$(".article-content").data("url"),
            dataType: "script",
            method: "post",
            data: {
                html: adsByGoogleHtml
            },
            success: function (result) {
                const exec = result.replace("$('.article-content')", "$('.article-content-2')");
                a.win.eval(exec);
            }
        });
        a.$(".article-content").after(`<div class="article-content-2"></div>`).remove();
    });
}
if (a.domCmp(["rmprepusb.com"])) {
    //Set cookie
    a.cookie("jot_viewer", "3");
}
if (a.domCmp(["cubeupload.com"])) {
    //Filter keywords from document.write()
    a.filter("document.write", /Please consider removing adblock to help us pay our bills/);
}
if (a.config.allowExperimental && a.domCmp(["neodrive.co"])) {
    //(Experimenal) Show the real video URL to the user
    a.on("load", function () {
        if (a.$(".player2").length > 0) {
            a.win.prompt("AdBlock Protector says: \nThis *might* be the real link, we could not redirect " +
"you automatically, please copy it and paste it into address bar manually: ", a.$(".player2").attr("href")
.split("'")[1]);
        }
    });
}
if (a.domCmp(["hentaihaven.org"])) {
    //NSFW! Set cookies
    a.always(function () {
        a.cookie("hh_ppndr1", "1");
        a.cookie("hh_ppndr2", "1");
    });
}
if (a.domCmp(["primeshare.tv"])) {
    //Add bait element
    a.bait("div", "#adblock");
}
if (a.domCmp(["debridnet.com", "livedebrid.com"])) {
    //Inject CSS and add bait element
    a.css(".myTestAd2 { height: 5px; }");
    a.bait("div", ".myTestAd2");
}
if (a.domCmp(["bluesatoshi.com"])) {
    //Inject CSS and add bait element
    a.css("#test { height: 280px; }");
    a.bait("div", "#test");
}
if (a.domCmp(["razercrypt.com"])) {
    //Inject CSS and add bait element
    a.css("#test { height: 250px; }");
    a.bait("div", "#test");
}
if (a.domCmp(["satoshiempire.com"])) {
    //Inject CSS and add bait element
    a.css("#test { height: 250px; }");
    a.bait("div", "#test");
}
if (a.domCmp(["oneadfaucet.com"])) {
    //Inject CSS and add bait element
    a.css("#test { height: 250px; }");
    a.bait("div", "#test");
}
if (a.domCmp(["jkanime.net"])) {
    //Add bait element
    a.bait("div", "#reco");
}
if (a.domCmp(["720pmkv.com"])) {
    //Add bait element
    a.bait("div", "#advert");
}
if (a.domCmp(["paidverts.com"])) {
    //Add bait element
    a.bait("div", ".afs_ads");
}
if (a.domCmp(["italiatv.org"])) {
    //Add bait element
    a.bait("div", "#fab13");
}
if (a.domCmp(["eventhubs.com"])) {
    //Add bait element
    a.bait("div", "#blahyblaci1");
}
if (a.domCmp(["superanimes.com"])) {
    //Add bait element
    a.bait("div", "#bannerLoja");
}
if (a.domCmp(["forum.pac-rom.com"])) {
    //Add bait element
    a.bait("div", ".banner_ads");
}
if (a.domCmp(["litv.tv"])) {
    //Add bait element
    a.bait("div", ".player_mask");
}
if (a.domCmp(["leveldown.fr"])) {
    //Add bait elements
    a.bait("div", "#adblock");
    a.bait("div", "#adblocktest");
}
if (a.domCmp(["globeslot.com"])) {
    //Add bait elements
    a.bait("div", "#add");
    a.bait("div", "#add1");
}
if (a.domCmp(["antennesport.com", "serverhd.eu"])) {
    //Skip to player
    a.on("DOMContentLoaded", function () {
        a.$("#pub .pubclose").remove();
        a.$("#pub .embed iframe").attr("src", "/embed/embed.php");
    });
}
if (a.domCmp(["drivearabia.com", "putlocker.com", "doatoolsita.altervista.org", "sockshare.com",
"free-movie-home.com", "pc.online143.com", "kooora.com", "str3amtv.co.nr", "str3amtv.altervista.org",
"str3am.altervista.org", "filecom.net", "pipocas.tv", "generatupremium.biz", "mega-debrid.eu",
"premiumst0re.blogspot.com", "dl-protect.com", "newsinlevels.com", "vipracing.biz", "businesstoday.in"])) {
    //Disable alert()
    a.filter("alert");
}
if (a.domCmp(["generatupremium.biz"])) {
    //Set cookie
    a.cookie("genera", "false");
}
if (a.domCmp(["newstatesman.com"])) {
    //Set cookie
    a.cookie("donationPopup", "hide");
}
if (a.domCmp(["yes.fm"])) {
    //Lock com_adswizz_synchro_initialize to an empty function
    a.readOnly("com_adswizz_synchro_initialize", function () { });
}
if (a.domCmp(["tek.no", "gamer.no", "teknofil.no", "insidetelecom.no", "prisguide.no", "diskusjon.no",
"teknojobb.no", "akam.no", "hardware.no", "amobil.no"])) {
    //Add element to body
    a.on("DOMContentLoaded", function () {
        a.$("<div>").attr("id", "google_ads_iframe_").html("<p></p>").appendTo("body");
    });
}
if (a.domInc(["planetatvonlinehd.blogspot"]) || a.domCmp(["planetatvonlinehd.com"])) {
    //Inject CSS
    a.css(".adsantilok { height: 1px; }");
}
if (a.domCmp(["beta.speedtest.net"])) {
    //Lock adsOoklaComReachable to true and scriptsLoaded to an empty function
    a.readOnly("adsOoklaComReachable", true);
    a.readOnly("scriptsLoaded", function () { });
}
if (a.domCmp(["binbucks.com"])) {
    //Lock testJuicyPay and testSensePay to true
    a.readOnly("testJuicyPay", true);
    a.readOnly("testSensePay", true);
}
if (a.domCmp(["whiskyprijzen.com", "whiskyprices.co.uk", "whiskypreise.com", "whiskyprix.fr"])) {
    //Lock OA_show to true
    a.readOnly("OA_show", true);
}
if (a.domCmp(["di.se"])) {
    //Remove elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("#header_overlay").remove();
        a.$("#message_modal").remove();
    });
}
if (a.domCmp(["libertaddigital.com"])) {
    //Lock ad_already_played and puedeMostrarAds to true
    a.readOnly("ad_already_played", true);
    a.readOnly("puedeMostrarAds", true);
}
if (a.domCmp(["folha.uol.com.br"])) {
    //Lock paywall_access and folha_ads to true
    a.readOnly("paywall_access", true);
    a.readOnly("folha_ads", true);
}
if (a.domCmp(["gamer.com.tw"])) {
    //Lock AntiAd to null
    a.readOnly("AntiAd", null);
};
if (a.domCmp(["armorgames.com"])) {
    //Lock ga_detect to null
    a.readOnly("ga_detect", null);
}
if (a.domCmp(["mangahost.com"])) {
    //Lock testDisplay to false
    a.readOnly("testDisplay", false);
}
if (a.domCmp(["videowood.tv"])) {
    //Disable open() and lock adb_remind to false
    a.filter("open");
    a.win.config = {};
    a.readOnly("adb_remind", false);
}
if (a.domCmp(["infojobs.com.br"])) {
    //Set properly webUI, this has 3 layers and a.readOnly() can't handle it
    a.win.webUI = {};
    a.win.webUI.Utils = {};
    a.win.Object.defineProperty(a.win.webUI.Utils, "StopAdBlock", {
        configurable: false,
        set: function () { },
        get: function () {
            return function () { };
        }
    });
}
if (a.domCmp(["cloudwebcopy.com"])) {
    //Disable setTimeout()
    a.filter("setTimeout");
}
if (a.domCmp(["narkive.com"])) {
    //Lock adblock_status to a funciton that always return false
    a.readOnly("adblock_status", function () {
        return false;
    });
}
if (a.domCmp(["pregen.net"])) {
    //Set cookie
    a.cookie("pgn", "1");
}
if (a.domCmp(["phys.org"])) {
    //Lock chkAB to an empty funciton
    a.readOnly("chkAB", function () { });
}
if (a.domCmp(["onvasortir.com"])) {
    //Lock JeBloque to an empty function
    a.readOnly("JeBloque", function () { });
}
if (a.domCmp(["fullhdzevki.com"])) {
    //Lock check to an empty function
    a.readOnly("check", function () { });
}
if (a.domCmp(["freecoins4.me"])) {
    //Lock check to a function that always return false
    a.readOnly("check", function () {
        return false;
    });
}
if (a.domCmp(["ville-ideale.com"])) {
    //Lock execsp to an empty function
    a.readOnly("execsp", function () { });
}
if (a.domCmp(["notre-planete.info"])) {
    //Lock pubpop to an empty function
    a.readOnly("pubpop", function () { });
}
if (a.domCmp(["apkmirror.com"])) {
    //Lock doCheck to an empty function
    a.readOnly("doCheck", function () { });
}
if (a.domCmp(["mtlblog.com"])) {
    //Lock puabs to an empty function
    a.readOnly("puabs", function () { });
}
if (a.domCmp(["15min.lt"])) {
    //Crash script by keywords
    a.crashScript("window.__adblock_config");
}
if (a.domCmp(["anizm.com"])) {
    //Set property stopAdBlock to an empty object
    a.always(function () {
        a.win.stopAdBlock = {};
    });
}
if (a.domCmp(["diarioinformacion.com"])) {
    //Lock pr_okvalida to true
    a.readOnly("pr_okvalida", true);
}
if (a.domCmp(["cnbeta.com"])) {
    //Lock JB to an empty function
    a.readOnly("JB", function () { });
}
if (a.domCmp(["themarker.com", "haaretz.co.il"])) {
    //Set property AdBlockUtil to an empty object
    a.win.AdBlockUtil = {};
}
if (a.domCmp(["pipocas.tv"])) {
    //Set cookie
    a.cookie("popup_user_login", "yes");
}
if (a.domCmp(["sc2casts.com"])) {
    //Set property _gaq then lock showdialog and showPopup2 to empty functions
    a.win._gaq = { push: function () { } }
    a.readOnly("showdialog", function () { });
    a.readOnly("showPopup2", function () { });
}
if (a.domCmp(["vgunetwork.com"])) {
    //Set cookie and click on close button on idle
    a.on("DOMContentLoaded", function () {
        a.cookie("stopIt", "1");
        a.$("#some_ad_block_key_close").click()
    });
}
if (a.domCmp(["eventosppv.me"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        a.$("#nf37").remove();
    });
}
if (a.domCmp(["bolor-toli.com"])) {
    //Edit elements on load
    a.on("load", function () {
        a.$(".banner").html("<br>").css("height", "1px");
    });
}
if (a.domCmp(["vivo.sx"])) {
    //Remove block elements
    a.on("load", function aa() {
        a.$("#alert-throttle").remove();
        a.$("button#access").removeAttr("id").removeAttr("disabled").html("Continue To Video");
        a.win.setTimeout(function () {
            a.$("input[name='throttle']").remove();
        }, 1000);
    });
}
if (a.domCmp(["luxyad.com"])) {
    //Skip to real URL
    a.on("DOMContentLoaded", function () {
        if (a.win.location.pathname === "/Information.php") {
            const href = location.href;
            a.win.location.href = href.substr(href.indexOf("url=") + 4, href.length);
        }
    });
}
if (a.domCmp(["mrpiracy.xyz", "mrpiracy.club"])) {
    //Crash script by keywords
    a.crashScript("Desativa o AdBlock para continuar");
}
if (a.domCmp(["dbplanet.net"])) {
    //Set cookie
    a.cookie("newnoMoreAdsNow", "1");
}
if (a.domCmp(["aidemu.fr"])) {
    //Set cookie
    a.cookie("adblockPopup", "true");
}
if (a.domCmp(["eami.in"])) {
    //Set cookie
    a.always(function () {
        a.cookie("ad_locked", "1");
    });
}
if (a.domCmp(["bigdownloader.com"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        a.$("#anti_adblock").remove();
    });
}
if (a.domCmp(["freeskier.com"])) {
    //Edit elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("#adb-not-enabled").css("display", "");
        a.$("#videoContainer").css("display", "");
    });
}
if (a.domCmp(["gametrailers.com"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        a.$("#ad_blocking").remove();
    });
}
if (a.domCmp(["scan-mx.com", "onepiece-mx.net", "naruto-mx.net"])) {
    //Lock ad_block_test to an empty function and edit element on idle
    a.readOnly("ad_block_test", function () { });
    a.on("DOMContentLoaded", function () {
        a.$("#yop").attr("id", "");
    });
}
if (a.domCmp(["freebitcoins.nx.tc", "getbitcoins.nx.tc"])) {
    //Lock ad_block_test to a function that always return false
    a.readOnly("ad_block_test", function () {
        return false;
    });
}
if (a.domCmp(["bitcoinker.com"])) {
    //Lock claim to a function that always return true and remove element on idle
    a.readOnly("claim", function () {
        return true;
    });
    a.on("DOMContentLoaded", function () {
        a.$("#E33FCCcX2fW").remove();
    });
}
if (a.domCmp(["moondoge.co.in", "moonliteco.in", "moonbit.co.in", "bitcoinzebra.com"])) {
    //Remove elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("#AB, #E442Dv, #eCC5h").remove();
    });
}
if (a.domCmp(["bitcoiner.net", "litecoiner.net"])) {
    //Add bait elements
    a.bait("div", "#tester");
    a.bait("div", "#ad-top");
}
if (a.domCmp(["torrent-tv.ru"])) {
    //Lock c_Oo_Advert_Shown to true
    a.readOnly("c_Oo_Advert_Shown", true);
}
if (a.domCmp(["cwtv.com"])) {
    //Lock CWTVIsAdBlocking to undefined
    a.readOnly("CWTVIsAdBlocking", undefined);
}
if (a.domCmp(["inn.co.il"])) {
    //Set property TRC
    a.win.TRC = {};
    a.win.TRC.blocker = {
        states: {
            ABP_DETECTION_DISABLED: -2,
            ABP_NOT_DETECTED: 0,
            ABP_DETECTED: 1
        },
        createBlockDetectionDiv: function () {
            return a.doc.createElement("div");
        },
        isBlockDetectedOnDiv: function () {
            return 0;
        },
        isBlockDetectedOnClassNames: function () {
            return 0;
        },
        getBlockedState: function () {
            return 0;
        }
    };
}
if (a.domCmp(["bhaskar.com", "divyabhaskar.co.in"])) {
    //Lock openPopUpForBreakPage to an empty funciton then canABP and canCheckAds to true
    a.readOnly("openPopUpForBreakPage", function () { });
    a.readOnly("canABP", true);
    a.readOnly("canCheckAds", true);
}
if (a.domCmp(["turkanime.tv"])) {
    //Set properties
    a.always(function () {
        a.win.adblockblock = function () { };
        a.win.BlokKontrol = {};
    });
}
if (a.domCmp(["wtfbit.ch"])) {
    //Lock writeHTMLasJS to an empty function
    a.readOnly("writeHTMLasJS", function () { });
}
if (a.domCmp(["aranzulla.it"])) {
    //Crash script by keyworkds and inject style
    a.crashScript("navigator.userAgent||navigator.vendor||window.opera");
    a.css("#abt1 + STYLE + div[id][class] {display:none;}");
}
if (a.domCmp(["ndtv.com"])) {
    //Lock ___p__p to 1 and getNoTopLatestNews to an empty function
    a.readOnly("___p__p", 1);
    a.readOnly("getNoTopLatestNews", function () { });
}
if (a.domCmp(["lesechos.fr", "lesechos.com"])) {
    //Lock checkAdBlock and aywall_adblock_article to empty functions then call_Ad to 1
    a.readOnly("checkAdBlock", function () { });
    a.readOnly("paywall_adblock_article", function () { });
    a.readOnly("call_Ad", 1);
}
if (a.domCmp(["bitvisits.com"])) {
    //Lock blockAdblockUser to an empty function
    a.readOnly("blockAdblockUser", function () { });
}
if (a.domCmp(["exrapidleech.info"])) {
    //Set cookies, style, read only variables, disable open(), and create an element
    let tomorrow = new a.win.Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    //Cookies
    a.cookie("popcashpuCap", "1");
    a.cookie("popcashpu", "1");
    a.cookie("nopopatall", tomorrow.getTime().toString());
    a.cookie("noadvtday", "0");
    //Style
    a.css("div.alert.alert-danger.lead {opacity:0;}");
    //Read only variables
    a.readOnly("bdvbnr_pid", []);
    a.readOnly("PopAds", 1);
    //Filter open()
    a.filter("open");
    //Create element
    a.$("<iframe>").attr("src", "http://bdfrm.bidvertiser.com/BidVertiser.dbm?pid=383865&bid=1737418&RD=")
.attr("id", "bdvi").css("display", "none").appendTo("html");
}
if (a.domCmp(["vipleague.is", "vipleague.ws", "vipleague.tv", "vipleague.se", "vipleague.tv", "vipleague.me",
"vipleague.mobi", "vipleague.co", "vipleague.sx", "vipleague.ch", "vipbox.tv", "vipbox.co", "vipbox.biz",
"vipbox.sx", "vipbox.eu", "vipbox.so", "vipbox.nu", "vipboxsa.co", "strikeout.co", "strikeout.me",
"homerun.re", "vipboxtv.co", "vipapp.me"])) {
    //Set read only variable, cookie, and styles
    a.readOnly("iExist", true);
    a.cookie("xclsvip", "1");
    a.css(".vip_052x003 { height: 250px; }");
    a.css(".vip_09x827 { height: 26px; }");
    a.css("#overlay { display: none; }");
}
if (a.domCmp(["zoomtv.me"])) {
    //Lock iaxpEnabled to true
    a.readOnly("iaxpEnabled", true);
}
if (a.domCmp(["vg.no", "e24.no"])) {
    //Lock __AB__ to an empty function
    a.readOnly("__AB__", function () { });
}
if (a.domCmp(["pornve.com"])) {
    //NSFW! Lock adxjwupdate to 1
    a.readOnly("adxjwupdate", 1);
}
if (a.domCmp(["lol.moa.tw"])) {
    //Set property MoaObj on idle
    a.on("DOMContentLoaded", function () {
        a.win.MoaObj = a.win.MoaObj || {};
        a.win.MoaObj.ad = a.win.MoaObj.ad || {};
        a.win.MoaObj.ad.hasAdblock = function () {
            return false;
        };
        a.win.MoaObj.ad.checkABP = function () {
            return false;
        };
    });
}
if (a.domCmp(["multiup.org"])) {
    //Set cookie and set hi to an empty function
    a.cookie("visit", "1");
    a.readOnly("hi", function () { });
}
if (a.domCmp(["dailybitcoins.org"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        a.$(".ad-img").remove();
    });
}
if (a.domCmp(["kozaczek.pl", "zeberka.pl"])) {
    //Set cookies
    a.cookie("ablc", "1");
    a.cookie("cookie_policy", "1");
}
if (a.domCmp(["spankwire.com", "keezmovies.com", "extremetube.com", "mofosex.com"])) {
    //Set cookies
    a.cookie("abClosed", "true");
    a.cookie("hide_ad_msg", "1");
}
if (a.domCmp(["youporn.com", "youporngay.com"])) {
    //Set cookie
    a.cookie("adblock_message", "closed");
}
if (a.domCmp(["citationmachine.net"])) {
    //Set cookie
    a.cookie("sbm_cm_citations", "0");
}
if (a.domCmp(["psarips.com"])) {
    //Add bait element
    a.bait("div", "#advert");
}
if (a.domCmp(["extratorrent.cc", "extratorrent.com"])) {
    //Set cookies
    a.cookie("ppu_delay", "1");
    a.cookie("ppu_main", "1");
    a.cookie("ppu_sub", "1");
    a.cookie("ppu_show_on", "1");
}
if (a.domCmp(["tny.cz", "pasted.co"])) {
    //Set cookies
    a.cookie("__.popunderCap", "1");
    a.cookie("__.popunder", "1");
}
if (a.domCmp(["clubedohardware.com.br"])) {
    //Add style and bait element then call functions and remove element on idle
    if (a.win.location.host.includes("forum")) {
        a.css("#banner, script { height: 51px; }");
        a.bait("div", "#banner");
    } else {
        a.bait("div", ".banner_topo");
    }
    a.on("DOMContentLoaded", function () {
        if (a.win.location.host.includes("forum")) {
            a.win.addBlocking.hide();
            a.win.addBlocking.kill();
        } else {
            a.doc.body.id = "";
            a.$(".adblock").remove();
        }
    });
}
if (a.domCmp(["debrastagi.com"])) {
    //Remove elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("#stp-main").remove();
        a.$("#stp-bg").remove();
    });
}
if (a.domCmp(["ddlfrench.org"])) {
    //Edit elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("#dle-content .d-content").removeClass();
        a.$("#content").attr("id", "");
    });
}
if (a.domCmp(["mega-debrid.eu"])) {
    //Edit element on load
    a.on("load", function () {
        const elem = a.$(".realbutton")[0];
        elem.setAttribute("onclick", "");
        elem.setAttribute("type", "submit");
    });
}
if (a.domInc(["slideplayer"])) {
    //Set property force_remove_ads and skip share to download on load
    a.on("load", function () {
        a.win.force_remove_ads = true;
        const slide_id = a.win.get_current_slide_id();
        const slide_srv = a.doc.getElementById("player_frame").src.split("/")[3];
        const time = 86400 + a.win.Math.floor(a.win.Date.now() / 1000);
        const secret = a.win.encodeURIComponent(a.win.strtr(a.win.MD5.base64("secret_preved slideplayer never solved " +
time + slide_id + ".ppt"), "+/", "- "));
        const url = "http://player.slideplayer.org/download/" + slide_srv + "/" + slide_id + "/" + secret + "/" +
time + "/" + slide_id + ".ppt";
        let links = a.doc.querySelectorAll("a.download_link");
        for (let i = 0; i < links.length; i++) {
            let events = a.win.$._data(links[i]).events.click;
            events.splice(0, events.length);
            links[i].href = url;
        }
    });
}
if (a.domCmp(["bokepspot.com"])) {
    //Set cookie and remove element on idle
    a.cookie("hideDialog", "hide");
    a.on("DOMContentLoaded", function () {
        a.$("#tupiklan").remove();
    });
}
if (a.domCmp(["picload.org"])) {
    //Set cookie then set properties and remove element on idle
    a.cookie("pl_adblocker", "false");
    a.on("DOMContentLoaded", function () {
        a.win.ads_loaded = true;
        a.win.imageAds = false;
        a.$("div[oncontextmenu='return false;']").remove();
    });
}
if (a.domCmp(["freezedownload.com"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        if (a.win.location.href.includes("freezedownload.com/download/")) {
            a.$("body > div[id]").remove();
        }
    });
}
if (a.domCmp(["monnsutogatya.com"])) {
    //Inject style and remove element on idle
    a.on("DOMContentLoaded", function () {
        a.css("#site-box {display:block;}");
        a.$("#for-ad-blocker").remove();
    });
}
if (a.domCmp(["rapid8.com"])) {
    //Remove elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("div.backk + #blcokMzg").remove();
        a.$("div.backk").remove();
    });
}
if (a.domCmp(["turkdown.com"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        a.$("#duyuru").remove();
    });
}
if (a.domCmp(["privateinsta.com"])) {
    //Set property dont_scroll and remove elements on idle
    a.on("DOMContentLoaded", function () {
        a.win.dont_scroll = false;
        a.$("#overlay_div").remove();
        a.$("#overlay_main_div").remove();
    });
}
if (a.domCmp(["oneplaylist.eu.pn"])) {
    //Lock makePopunder to false
    a.readOnly("makePopunder", false);
}
if (a.domCmp(["onmeda.de"])) {
    //Lock $ADP to true then sas_callAd and sas_callAds to empty functions
    a.readOnly("$ADP", true);
    a.readOnly("sas_callAd", function () { });
    a.readOnly("sas_callAds", function () { });
}
if (a.domCmp(["rockfile.eu"])) {
    //Add element on idle
    a.on("DOMContentLoaded", function () {
        a.$("<iframe>").attr("src", "about:blank").css("visibility", "hidden").appendTo("body");
    });
}
if (a.domCmp(["referencemega.com", "fpabd.com", "crackacc.com"])) {
    //Set cookie
    a.cookie("_lbGatePassed", "true");
}
if (a.domCmp(["link.tl"])) {
    //Inject CSS and lock adblocker to false
    a.css(".adblock { height:1px; }");
    a.readOnly("adblocker", false);
}
if (a.domCmp(["wstream.video"])) {
    //Inject CSS
    a.css("#adiv { height:4px; }");
}
if (a.domCmp(["4shared.com"])) {
    //Edit element on idle
    a.on("DOMContentLoaded", function () {
        a.$("body").removeClass("jsBlockDetect");
    });
}
if (a.domCmp(["pro-zik.ws", "pro-tect.ws", "pro-ddl.ws", "pro-sport.ws"])) {
    //Set cookies
    a.cookie("visitedf", "true");
    a.cookie("visitedh", "true");
}
if (a.domCmp(["comptoir-hardware.com"])) {
    //Lock adblock to non
    a.readOnly("adblock", "non");
}
if (a.domCmp(["bakersfield.com"])) {
    //Lock AD_SLOT_RENDERED to true
    a.readOnly("AD_SLOT_RENDERED", true);
}
if (a.domCmp(["ekstrabladet.dk", "eb.dk"])) {
    //Set property ADTECH
    a.always(function () {
        a.win.ADTECH = {};
    });
}
if (a.domCmp(["pcgames-download.net"])) {
    //Set cookie and property mgCanLoad30547
    a.always(function () {
        a.cookie("noAdblockNiceMessage", "1");
        a.win.mgCanLoad30547 = true;
    });
}
if (a.domCmp(["lachainemeteo.com"])) {
    //Lock js_loaded to true
    a.readOnly("js_loaded", true);
}
if (a.domCmp(["mac4ever.com"])) {
    //Lock coquinou to an empty function
    a.readOnly("coquinou", function () { });
}
if (a.domCmp(["5278bbs.com"])) {
    //Lock myaabpfun12 to an empty function
    a.readOnly("myaabpfun12", function () { });
}
if (a.domCmp(["thesimsresource.com"])) {
    //Lock gadsize and iHaveLoadedAds to true
    a.readOnly("gadsize", true);
    a.readOnly("iHaveLoadedAds", true);
}
if (a.domCmp(["yellowbridge.com"])) {
    //Lock finalizePage to an empty function
    a.readOnly("finalizePage", function () { });
}
if (a.domCmp(["game-debate.com"])) {
    //Lock ad_block_test to an empty function
    a.readOnly("ad_block_test", function () { });
}
if (a.domCmp(["kissanime.com", "kissanime.to", "kissanime.ru"])) {
    //Inject CSS and remove block screen on idle
    a.css("iframe[id^='adsIfrme'], .divCloseBut { display:none; }");
    a.on("DOMContentLoaded", function () {
        const divContentVideo = a.doc.querySelector("#divContentVideo");
        if (a.win.DoDetect2) {
            a.win.DoDetect2 = null;
            a.win.CheckAdImage = null;
        } else if (divContentVideo) {
            const divDownload = a.doc.querySelector("#divDownload").cloneNode(true);
            a.win.setTimeout(function () {
                divContentVideo.innerHTML = "";
                a.win.DoHideFake();
                divContentVideo.appendChild(divDownload);
                a.$("iframe[id^='adsIfrme'], .divCloseBut").remove();
            }, 5500);
        }
    });
}
if (a.domCmp(["kisscartoon.me", "kisscartoon.se"])) {
    //Lock xaZlE to an empty function and remove element on idle
    a.readOnly("xaZlE", function () { });
    a.on("DOMContentLoaded", function () {
        a.$("iframe[id^='adsIfrme']").remove();
    });
}
if (a.domCmp(["openload.co", "openload.io", "openload.tv"])) {
    //Lock adblock and adblock2 to false then popAdsLoaded to true
    a.readOnly("adblock", false);
    a.readOnly("adblock2", false);
    a.readOnly("popAdsLoaded", true);
}
if (a.domCmp(["youwatch.org", "chouhaa.info", "ahzahg6ohb.com", "ahzahg6ohb.com"])) {
    //Lock adsShowPopup1 to 1 and remove element on idle
    a.readOnly("adsShowPopup1", 1);
    a.on("DOMContentLoaded", function () {
        a.$("#player_imj, #player_imj + div[id]").remove();
    });
}
if (a.domCmp(["exashare.com", "chefti.info", "bojem3a.info", "ajihezo.info", "yahmaib3ai.com",
"yahmaib3ai.com"])) {
    //Lock adsShowPopup1 to 1 and remove element on idle
    a.readOnly("adsShowPopup1", 1);
    a.on("DOMContentLoaded", function () {
        a.$("#player_gaz, #player_gaz + div[id]").remove();
    });
}
if (a.domCmp(["an1me.se"])) {
    //Lock isBlockAds2 to false
    a.readOnly("isBlockAds2", false);
}
if (a.domCmp(["hqq.tv"])) {
    //Submit a form on idle
    a.on("DOMContentLoaded", function () {
        if (a.win.location.pathname === "/player/embed_player.php") {
            a.$("form[id^='form-']").submit();
        }
    });
}
if (a.domCmp(["koscian.net"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        a.$(".ban").remove();
    });
}
if (a.domCmp(["eclypsia.com"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock("MggAbd", "mggAbd");
}
if (a.domCmp(["gamingroom.tv"])) {
    //Lock a few variables to empty functions
    a.readOnly("adblock_detect", function () { });
    a.readOnly("GR_adblock_hide_video", function () { });
    a.readOnly("adblock_video_msg_start", function () { });
    a.readOnly("adblock_video_msg_stop", function () { });
    a.readOnly("disable_chat", function () { });
}
if (a.domCmp(["rtl.de"])) {
    //Replace player
    a.on("DOMContentLoaded", function () {
        a.$("div[data-widget='video']").each(function () {
            const url = a.$(this).data("playerLayerCfg").videoinfo.mp4url;
            a.$(this).after(a.nativePlayer(url));
            a.$(this).remove();
        });
    });
}
if (a.domCmp(["play.radio1.se", "play.bandit.se", "play.lugnafavoriter.com", "play.rixfm.se"])) {
    //Call a function
    a.on("load", function () {
        a.win.setTimeout(function () {
            a.win.player_load_live(a.win.stream_id);
        }, 1000);
    });
}
if (a.domCmp(["dplay.com", "dplay.dk", "dplay.se"])) {
    //Set cookie
    let date = new a.win.Date();
    date.setDate(date.getDate() + 365);
    const timestamp = date.getTime().toString();
    const value = JSON.stringify({
        "notificationSubmission": "submitted",
        "reportingExpiry": timestamp,
        "notificationExpiry": timestamp
    });
    a.cookie("dsc-adblock", value);
}
if (a.domCmp(["viafree.no", "viafree.dk", "viafree.se", "tvplay.skaties.lv", "play.tv3.lt", "tv3play.tv3.ee"])) {
    //(Experimental) Replace player on load
    const handler = function () {
        //Find player
        const elem = a.$("#video-player");
        if (elem.length === 0) {
            a.win.setTimeout(handler, 1000);
            return;
        }
        //Find ID
        let videoID = elem.attr("poster").split("/");
        videoID = videoID[videoID.length - 2];
        if (!videoID) {
            a.win.setTimeout(handler, 1000);
            return;
        }
        //Request data JSON
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://playapi.mtgx.tv/v3/videos/stream/" + videoID,
            onload: function (result) {
                parser(result.responseText);
            }
        });
    };
    const parser = function (data) {
        //Parse response
        let streams;
        try {
            const parsedData = JSON.parse(data);
            streams = parsedData.streams
        } catch (err) {
            a.out.err("AdBlock Protector failed to find video URL! ");
            //Activate hander again
            a.win.setTimeout(handler, 1000);
            return;
        }
        //Check source and type
        let sources = [], types = [];
        if (streams.high && streams.high !== "") {
            sources.push(streams.high);
            types.push("video/mp4");
        } else if (streams.hls && streams.hls !== "") {
            sources.push(streams.hls);
            types.push("application/x-mpegURL");
        } else if (streams.medium && streams.medium !== "") {
            sources.push(streams.medium);
            types.push(streams.medium.startsWith("rtmp") ? "rtmp/mp4" : "application/f4m+xml");
        } else {
            a.out.err("AdBlock Protector failed to find video URL! ");
            return;
        }
        //Replace player
        a.videoJS.init();
        const height = a.$("#video-player").height();
        const width = a.$("#video-player").width();
        a.$("#video-player").after(a.videoJS(sources, types, width, height)).remove();
        //Activate hander again
        a.win.setTimeout(handler, 1000);
    };
    if (a.config.allowExperimental && a.win.confirm("AdBlock Protector says: \nThis fix is experimental " +
"and might not work, would you want to try it anyway? ")) {
        //Can't seem to find real source of the stream, Geo Lock in my area?
        handler();
    }
}
if (a.domCmp(["firstrow.co", "firstrows.ru", "firstrows.tv", "firstrows.org", "firstrows.co",
"firstrows.biz", "firstrowus.eu", "firstrow1us.eu", "firstsrowsports.eu", "firstrowsportes.tv",
"firstrowsportes.com", "justfirstrowsports.com", "hahasport.me", "wiziwig.ru", "wiziwig.sx",
"wiziwig.to", "wiziwig.tv", "myp2p.biz", "myp2p.tv", "myp2p.la", "myp2p.ec", "myp2p.eu", "myp2p.sx",
"myp2p.ws", "myp2p.com", "atdhe.ru", "atdhe.se", "atdhe.bz", "atdhe.top", "atdhe.to", "atdhe.me",
"atdhe.mx", "atdhe.li", "atdhe.al"])) {
    //Set cookie, inject CSS, and disable open()
    a.filter("open");
    a.always(function () {
        a.cookie("adb", "1");
        a.css("#bannerInCenter, #hiddenBannerCanvas { display: none; }");
    });
}
if (a.domCmp(["buzina.xyz", "farmet.info", "rimladi.com", "kitorelo.com", "omnipola.com", "porosin.co.uk",
"rimleno.com", "simple4alls.com", "arsopo.com"])) {
    //Inject CSS and remove element on idle
    a.css("#adsframe { height: 151px; }");
    a.on("DOMContentLoaded", function () {
        a.$("#adsframe").remove();
        a.$("#remove-over").click();
    });
}
if (a.domCmp(["buzina.xyz"])) {
    //Inject CSS and edit elementon idle
    a.css("#adsframe { height: 151px; }");
    a.on("DOMContentLoaded", function () {
        const elem = a.$("iframe[src*='.php?hash=']");
        if (elem.length > 0) {
            let parts = elem.attr("src").split("/");
            parts[2] = "arsopo.com";
            elem.attr("src", parts.join("/"));
        }
    });
}
if (a.domCmp(["allmyvideos.net", "amvtv.net"])) {
    //Add cookie
    a.cookie("_favbt33", "1");
}
if (a.domCmp(["ilive.to", "streamlive.to"])) {
    //Call function on end
    a.on("load", function () {
        if (a.win.location.pathname.toLowerCase().startsWith("/embedplayer.php")) {
            a.win.setTimeout(function () {
                a.win.removeOverlayHTML();
            }, 1000);
        }
    });
}
if (a.domCmp(["micast.tv"])) {
    //Add cookies and call function on load
    a.cookie("vid_main", "true");
    a.cookie("vid_sub", "true");
    a.on("load", function () {
        if (a.win.removeOverlayHTML) {
            a.win.removeOverlayHTML();
        }
    })
}
if (a.domCmp(["pxstream.tv"])) {
    //Call function on load
    a.on("load", function () {
        if (a.win.location.pathname.startsWith("/embedrouter.php")) {
            a.win.setTimeout(function () {
                a.win.closeAd();
            }, 1000);
        }
    });
}
if (a.domCmp(["sawlive.tv"])) {
    //Set property and call function on idle
    a.on("DOMContentLoaded", function () {
        if (a.win.location.pathname.toLowerCase().startsWith("/embed/watch/")) {
            a.win.display = false;
            a.win.closeMyAd();
        }
    });
}
if (a.domCmp(["goodcast.co"])) {
    //Edit element on idle
    a.on("DOMContentLoaded", function () {
        if (a.win.location.pathname.startsWith("/stream.php")) {
            a.$(".advertisement").hide();
            a.$(".adsky iframe").attr("src", "about:blank");
        }
    });
}
if (a.domCmp(["showsport-tv.com"])) {
    //Remove element on idle
    a.on("DOMContentLoaded", function () {
        if (a.win.location.pathname.startsWith("/ch.php")) {
            a.$("#advertisement, .advertisement").remove();
        }
    });
}
if (a.domCmp(["sharecast.to"])) {
    //Set cookies and remove element on idle
    a.on("DOMContentLoaded", function () {
        if (a.win.location.pathname.startsWith("/embed.php")) {
            const token = a.win.setInterval(function () {
                a.cookie("vid_main", "true");
                a.cookie("vid_sub", "2");
                a.cookie("vid_delay", "true");
            }, 100);
            a.win.setTimeout(function () {
                a.win.clearInterval(token);
            }, 5000);
            a.$("#table1").remove();
        }
    });
}
if (a.domCmp(["cityam.com", "computerworlduk.com", "techworld.com", "v3.co.uk"])) {
    //Remove elements and set property on idle
    a.on("DOMContentLoaded", function () {
        a.$("#r3z-wait").remove();
        a.$(".r3z-hide").removeClass("r3z-hide");
        a.win._r3z = null;
    });
}
if (a.domCmp(["next-episode.net", "kingmaker.news", "gamespowerita.com", "todayidol.com", "receive-a-sms.com",
"wakeupcallme.com", "ringmycellphone.com", "faqmozilla.org", "thememypc.com"])) {
    //Set property
    a.always(function () {
        a.win.google_jobrunner = {};
    });
}
if (a.domCmp(["dawn.com"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock("DetectAdBlock", "detectAdBlock");
}
if (a.domCmp(["sports.fr"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock("FabInstance", "fabInstance");
}
if (a.domCmp(["europe1.fr"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock("FabInstance", "fabInstance");
}
if (a.domCmp(["newyorker.com"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock("SniffAdBlock", "sniffAdBlock");
}
if (a.domCmp(["mangasproject.com.br", "mangasproject.net.br", "mangas.zlx.com.br"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock(a.uid(), "mangasLeitorSlider");
}
if (a.domCmp(["qnimate.com"])) {
    //Lock adBlockDetected to an empty function
    a.readOnly("adBlockDetected", function () { });
}
if (a.domCmp(["eurotransport.de"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock(a.uid(), "antiAdBlock");
}
if (a.domCmp(["tzetze.it", "beppegrillo.it", "la-cosa.it"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock("CADetect", "cadetect");
}
if (a.domCmp(["agario.sx", "agarabi.com"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock(a.uid(), "agario_SX_ads");
}
if (a.domCmp(["filespace.com"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock(a.uid(), "fAB");
}
if (a.domCmp(["topserialy.sk"])) {
    //Call generic protector against FuckAdBlock
    a.generic.FuckAdBlock(a.uid(), "sratNaVas");
}
if (a.domCmp(["sport-show.fr", "vipflash.net", "2site.me"])) {
    //Inject CSS
    a.css("#blockblockA {visibility:invisible;display:none;} #blockblockA td {visibility:invisible;di" +
"splay:none;} #blockblockA td p {visibility:invisible;display:none;} #blockblockB {visibility:visible" +
";display:block;}");
}
if (a.domCmp(["gametransfers.com", "winandmac.com", "free-steam-giveaways.com", "canalwp.com",
"alphahistory.com", "nordpresse.be", "sospc.name", "baboo.com.br"])) {
    //Set cookie and property
    a.always(function () {
        a.cookie("anCookie", "true");
        a.win.anOptions = {};
    });
}
if (a.domCmp(["lewebtvbouquetfrancophone.overblog.com", "webtv.bloguez.com", "latelegratuite.blogspot.com",
"totaldebrid.org", "37.187.173.205", "tvgratuite.blogspot.com"])) {
    //Add bait element and lock jabbahud to an empty function
    a.bait("div", "#my_ad_div");
    a.readOnly("jabbahud", function () { });
}
if (a.domCmp(["mybank.pl", "rapidgrab.pl"])) {
    //Filter keywords from addEventListener()
    a.filter("addEventListener", /\.nextFunction\(\)\}/);
}
if (a.domCmp(["linkdrop.net", "revclouds.com", "leporno.org", "uploadshub.com", "dasolo.org",
"fullstuff.net", "zeusnews.it", "cheminots.net", "lolsy.tv", "animes-mangas-ddl.com",
"noticiasautomotivas.com.br", "darkstars.org", "corepacks.com", "naturalbd.com",
"coolsoft.altervista.org", "openload.us", "cda-online.pl", "urbanplanet.org", "mamahd.com",
"sadeempc.com", "avmoo.com", "thailande-fr.com", "btaia.com", "tusoft.org", "hisse.net",
"europeup.com", "nrj.fr", "srnk.co", "animmex.co", "socketloop.com", "crackhex.com",
"revealedtricks4u.com", "pizzamaking.com", "computerworm.net", "yourlifeupdated.net"])) {
    //Filter keywords from setTimeout()
    a.filter("setTimeout", /bab\_elementid/);
}
if (a.domCmp(["commentcamarche.net", "journaldesfemmes.com", "linternaute.com"])) {
    //Crash script by keywords
    a.crashScript("Asl.prototype.inject");
}
if (a.domCmp(["fourchette-et-bikini.fr", "meteocity.com"])) {
    //Lock adProtect to 1
    a.readOnly("adProtect", 1);
}
if (a.domCmp(["demo-phoenix.com", "dpstream.net", "gum-gum-streaming.com", "jeu.info", "sofoot.com",
"gaara-fr.com", "gaytube.com", "tuxboard.com", "xstory-fr.com", "hentaifr.net", "filmstreaming-hd.com",
"filmvf.net", "hentaihaven.org", "narutoshippudenvf.com", "thebadbuzz.com", "manga-news.com", "jeu.video",
"mangas-fr.com"])) {
    //Crash script by keywords and inject CSS
    a.crashScript("PHENV");
    a.css("body {visibility: visible;}");
}
if (a.domCmp(["tvspielfilm.de", "finanzen.ch"])) {
    //Crash script by keywords
    a.crashScript("UABPInject");
}
if (a.domCmp(["watchgeneration.fr", "turbo.fr", "24matins.fr", "foot01.com", "clubic.com", "macg.co",
"begeek.fr", "igen.fr", "gamestar.de", "focus.de", "stern.de", "fem.com", "wetter.com",
"wetteronline.de", "pcwelt.de", "boerse-online.de", "sportauto.de", "auto-motor-und-sport.de",
"motor-klassik.de", "4wheelfun.de", "autostrassenverkehr.de", "lustich.de", "spox.com", "shz.de",
"transfermarkt.de", "rp-online.de", "motorradonline.de", "20min.ch", "main-spitze.de",
"wormser-zeitung.de", "lampertheimer-zeitung.de", "wiesbdener-tagblatt.de", "buerstaedter-zeitung.de",
"wiesbdener-kurier.de", "rhein-main-presse.de", "allgemeine-zeitung.de", "ariva.de", "spiegel.de",
"brigitte.de", "dshini.net", "gala.de", "gamepro.de", "gamona.de", "pnn.de", "promobil.de", "sportal.de",
"webfail.com", "computerbild.de", "finanzen.net", "comunio.de", "medisite.fr"]) || a.domInc(["sat1",
"prosieben", "kabeleins", "sat1gold", "sixx", "prosiebenmaxx", "the-voice-of-germany"])) {
    //Crash script by keywords
    a.crashScript("uabInject");
}
if (a.domCmp(["emuparadise.me"])) {
    //Remove element
    a.always(function () {
        a.$("h2:contains('Bandwidth is expensive')").parent().remove();
    });
}
if (a.domCmp(["sapib.ca"])) {
    //Lock Abd_Detector to an empty function
    a.readOnly("Abd_Detector", function () { });
}
if (a.domCmp(["allmusic.com"])) {
    //Filter keywords from setTimeout()
    a.filter("setTimeout", /\_0x6176x12/);
}
if (a.domCmp(["wowhead.com"])) {
    //Remove elements on idle
    a.on("DOMContentLoaded", function () {
        a.$("div[id^='ad-']").parent().parent().parent().remove();
    });
}
if (a.domCmp(["cmacapps.com"])) {
    //Filter keywords from eval()
    a.filter("eval", /Place this code snippet near the footer of your page before the close of the/);
}
if (a.domCmp(["epiotrkow.pl"])) {
    //Add bait element
    a.bait("div", "#adboxx");
}
if (a.domCmp(["fox.com.tr"])) {
    //Lock adblockDetector to an object
    a.readOnly("adblockDetector", {
        init: function () { }
    });
}
if (a.domCmp(["thebatavian.com"])) {
    //Lock broadstreet to true
    a.readOnly("broadstreet", true);
}
if (a.domCmp(["zrabatowani.pl"])) {
    //Set cookie and the rest will be taken care by generic protectors
    a.cookie("adblockAlert", "yes");
}
if (a.domCmp(["fullmatchesandshows.com", "playwire.com"])) {
    //Modify property on read
    let val;
    a.win.Object.defineProperty(a.win, "Zeus", {
        configurable: false,
        set: function (v) {
            val = v;
        },
        get: function () {
            try {
                val._adBlockDetected = false;
            } catch (err) { }
            return val;
        }
    });
}
//Activate generic protectors, excluded domains check is handled inside
a.generic();
