//Init, pass in excluded domains
"use strict";
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
    //(Workaround) Inject CSS and remove block screen
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
    //Lock adBlocker to false and prevent listening resize event (window self-destroys on resize, bug or feature?)
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
    //Potential related domains:  "tvnfabula.pl", "itvnextra.pl", "tvn24bis.pl", "ttv.pl", "player.pl",
    //"x-news.pl", "tvn7.pl", "itvn.pl"
    const homePages = ["http://www.tvn.pl/", "http://www.tvn7.pl/", "http://www.tvnstyle.pl/",
"http://www.tvnturbo.pl/"];
    //Homepages are partially fixed and are handled by List
    if (!homePages.includes(unsafeWindow.document.location.href)) {
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
    //Lock google_onload_fired to true and include this domain from generic protectors
    a.readOnly("google_onload_fired", true);
    a.config.allowGeneric = true;
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
if (a.domCmp(["pinoy1tv."])) {
    //Lock allowads to 1
    a.readOnly("allowads", 1);
}
if (a.domCmp(["business-standard.com"])) {
    //Lock adsLoaded to 1 and set a cookie
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
    //Set a cookie
    a.cookie("jot_viewer", "3");
}
if (a.domCmp(["cubeupload.com"])) {
    //Filter document.write
    a.filter("document.write", /Please consider removing adblock to help us pay our bills/);
}
if (a.domCmp(["neodrive.co"])) {
    //Redirect to the real video
    a.on("load", function () {
        if (a.$(".player2").length > 0) {
            a.win.prompt("AdBlock Protector says: \nThis should be the real link, we could not redirect " +
"you automatically, please copy it and paste it into address bar manually: ", a.$(".player2").attr("href")
.split("'")[1]);
        }
    });
}
if (a.domCmp(["hentaihaven.org"])) {
    //NSFW! Set cookies
    a.always(function () {
        a.cookie("hh_ppndr1", 1);
        a.cookie("hh_ppndr2", 1);
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
    a.cookie("genera", false);
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
    //Disable open() then lock config to an empty object and adb_remind to false
    a.filter("open");
    a.readOnly("config", {});
    a.readOnly("adb_remind", false);
}
if (a.domCmp(["infojobs.com.br"])) {
    //Set a read-only properly, this has 3 layers and a.readOnly() can't handle it
    a.win.webUI = {};
    a.win.webUI.Utils = {};
    Object.defineProperty(a.win.webUI.Utils, "StopAdBlock", {
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
    //Lock adblock_status to a funciton that always returns false
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
    //Set stopAdBlock to an empty object
    a.always(function () {
        a.win.stopAdBlock = {};
    });
}
if (a.domCmp(["diarioinformacion.com"])) {
    //Lock pr_okvalida to true
    a.readOnly("pr_okvalida", true);
}
//Generic, excluded domain check is built in
a.generic();
