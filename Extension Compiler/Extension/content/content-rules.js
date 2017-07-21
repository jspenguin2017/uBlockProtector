//Content rules
//Solutions from Anti-Adblock Killer (originally by Reek) are modified to fit my Core API
//Anti-Adblock Killer Repository (contains original source code and license): https://github.com/reek/anti-adblock-killer
"use strict";

//=====Initialization=====
{
    //Initialize
    a.init();
    //White lists, ends with 1 means the list is for a.domCmp(), 2 for a.domInc()
    const genericWhitelist1 = [
        //Local network
        "localhost", "127.0.0.1",
        //Google
        "google.it.ao", "google.ne.jp", "google.off.ai", "youtu.be", "youtube.com",
        //Microsoft
        "microsoft.com", "msn.com", "live.com", "bing.com",
        //Other
        "apple.com", "ask.com", "reddit.com", "stackoverflow.com", "tampermonkey.net", "twitter.com",
        "360.cn", "baidu.com", "bufferapp.com", "chromeactions.com", "chatango.com", "calm.com",
        "easyinplay.net", "ebay.com", "facebook.com", "flattr.com", "flickr.com", "ghacks.net", "imdb.com",
        "imgbox.com", "imgur.com", "instagram.com", "jsbin.com", "jsfiddle.net", "linkedin.com", "mail.ru",
        "paypal.com", "pinterest.com", "preloaders.net", "qq.com", "vimeo.com", "wikipedia.org",
        "w3schools.com", "yandex.ru", "xemvtv.net", "spaste.com", "vod.pl", "agar.io", "popmech.ru",
        "pandoon.info", "fsf.org", "adblockplus.org", "plnkr.co", "exacttarget.com", "dolldivine.com",
        //Handled by specific rules
        "anandabazar.com",
        //Damage control
        "viasport.fi", "tv3sport.dk",
    ];
    const genericWhitelist2 = [
        //Local network
        "192.168.0", "192.168.1",
        //Google
        "google", "google.co", "google.com",
        //Other
        "amazon", "yahoo",
    ];
    //Apply generic solutions
    if (a.domCmp(genericWhitelist1, true) || a.domInc(genericWhitelist2, true)) {
        console.log("This domain is excluded from generic solutions.");
    } else {
        a.generic();
        //Adfly
        if (a.domCmp([], true)) {
            console.log("This domain is excluded from Adfly bypasser.");
        } else {
            a.generic.Adfly();
        }
        //ads.js v2
        if (a.domCmp(["gamersclub.com.br", "uploadboy.com", "vidoza.net", "videohelp.com",
            "passionea300allora.it", "memurlar.net", "palemoon.org"])) {
            a.generic.adsjsV2();
        }
        //NoAdBlock
        if (a.domCmp([], true)) {
            console.log("This domain is excluded from NoAdBlock primary defuser.");
        } else {
            a.generic.NoAdBlock1();
            //a.generic.NoAdBlock2();
        }
    }
    //uBO-Extra whitelist
    if (a.domCmp(["slickdeals.net", "appear.in"], true)) {
        //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/405
        //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/414
        a.uBOExtraExcluded = true;
        console.log("uBlock Protector excluded this domain from uBO-Extra.");
    }
}

//=====Common Specific Rules=====
//---a.filter---
if (a.domCmp(["usapoliticstoday.com", "vidlox.tv", "exrapidleech.info", "urle.co", "gsmarena.com",
    "darmowe-pornosy.pl"])) {
    a.filter("eval");
}
if (a.domCmp(["sc2casts.com", "webqc.org", "cloudwebcopy.com"])) {
    a.filter("setTimeout");
}
if (a.domCmp(["vidoza.net", "videowood.tv", "l2s.io", "adshort.co", "linksh.top", "adshorte.com",
    "coinb.ink", "1movies.tv", "katfile.com", "firstrow.co", "firstrows.ru", "firstrows.tv",
    "firstrows.org", "firstrows.co", "atdhe.mx", "atdhe.li", "atdhe.al", "atdhe.me", "atdhe.to",
    "firstrows.biz", "firstrowus.eu", "firstrow1us.eu", "firstsrowsports.eu", "firstrowsportes.tv",
    "firstrowsportes.com", "justfirstrowsports.com", "hahasport.me", "wiziwig.ru", "wiziwig.sx",
    "wiziwig.to", "wiziwig.tv", "myp2p.biz", "myp2p.tv", "myp2p.la", "myp2p.ec", "myp2p.eu", "myp2p.sx",
    "myp2p.ws", "myp2p.com", "atdhe.ru", "atdhe.se", "atdhe.bz", "atdhe.top"])) {
    a.filter("open");
}
if (a.domCmp(["drivearabia.com", "putlocker.com", "doatoolsita.altervista.org", "sockshare.com",
    "free-movie-home.com", "pc.online143.com", "kooora.com", "str3amtv.co.nr", "str3amtv.altervista.org",
    "str3am.altervista.org", "filecom.net", "pipocas.tv", "generatupremium.biz", "mega-debrid.eu",
    "premiumst0re.blogspot.com", "dl-protect.com", "newsinlevels.com", "vipracing.biz", "businesstoday.in",
    "dasolo.co"])) {
    a.filter("alert");
}
//---a.timewarp---
if (a.domCmp(["apkmirror.com", "freepdf-books.com", "bc.vc", "themeslide.com", "linkdrop.net",
    "l2s.io", "ally.sh", "al.ly", "croco.site", "urle.co", "ouo.io", "idlelivelink.blogspot.com",
    "lewat.id", "cutwin.com", "cut-urls.com", "adbull.me", "xess.pro", "clik.pw", "admove.co",
    "adshort.co", "linksh.top", "adshorte.com", "coinb.ink", "123link.top"])) {
    a.timewarp("setInterval", a.matchMethod.stringExact, "1000");
}
if (a.domCmp(["katfile.com"])) {
    a.timewarp("setTimeout", a.matchMethod.stringExact, "1000");
}
//---a.readOnly---
if (a.domCmp(["jansatta.com", "financialexpress.com", "indianexpress.com", "shink.in"])) {
    a.readOnly("RunAds", true);
}
if (a.domCmp(["jagranjunction.com", "nekopoi.bid"])) {
    a.readOnly("isAdsDisplayed", true);
}
if (a.domCmp(["ratemyprofessors.com"])) {
    a.readOnly("adBlocker", false);
}
if (a.domCmp(["link.tl"])) {
    a.readOnly("adblocker", false);
}
if (a.domCmp(["megogo.net"])) {
    a.readOnly("adBlock", false);
}
if (a.domCmp(["openload.co", "openload.io", "openload.tv", "nekopoi.bid", "translatica.pl",
    "angrybirdsnest.com"])) {
    a.readOnly("adblock", false);
}
if (a.domCmp(["mexashare.com", "kisshentai.net", "hanime.tv"])) {
    a.readOnly("BetterJsPop", () => { });
}
if (a.domCmp(["youwatch.to", "he2eini7ka.com", "shink.in"])) {
    a.readOnly("jsPopunder", () => { });
}
if (a.domCmp(["youwatch.org", "chouhaa.info", "ahzahg6ohb.com", "youwatch.to", "he2eini7ka.com", "exashare.com",
    "chefti.info", "bojem3a.info", "ajihezo.info", "yahmaib3ai.com"])) {
    a.readOnly("adsShowPopup1", 1);
}
if (a.domCmp(["game-debate.com", "scan-mx.com", "onepiece-mx.net", "naruto-mx.net"])) {
    a.readOnly("ad_block_test", () => { });
}
if (a.domCmp(["freebitcoins.nx.tc", "getbitcoins.nx.tc"])) {
    a.readOnly("ad_block_test", () => false);
}
if (a.domCmp(["vipleague.is", "vipleague.ws", "vipleague.tv", "vipleague.se", "vipleague.me", "vipapp.me",
    "vipleague.mobi", "vipleague.co", "vipleague.sx", "vipleague.ch", "vipbox.tv", "vipbox.co", "vipbox.biz",
    "vipbox.sx", "vipbox.eu", "vipbox.so", "vipbox.nu", "vipboxsa.co", "strikeout.co", "strikeout.me",
    "homerun.re", "vipboxtv.co", "securenetsystems.net"])) {
    a.readOnly("iExist", true);
}
if (a.domCmp(["kissanime.io", "1movies.tv"])) {
    a.readOnly("check_adblock", true);
}
if (a.domCmp(["fourchette-et-bikini.fr", "meteocity.com"])) {
    a.readOnly("adProtect", 1);
}
//---a.noAccess---
if (a.domCmp(["debridnet.com", "adshort.co", "linksh.top", "adshorte.com", "coinb.ink"])) {
    a.noAccess("_pop");
}
//---a.bait---
if (a.domCmp(["primeshare.tv", "leveldown.fr"])) {
    a.bait("div", "#adblock");
}
if (a.domCmp(["720pmkv.com", "psarips.com"])) {
    a.bait("div", "#advert");
}
if (a.domCmp(["osoarcade.com", "d3brid4y0u.info", "fileice.net", "nosteam.ro", "openrunner.com", "easybillets.com",
    "spox.fr", "yovoyages.com", "tv3.co.nz", "freeallmusic.info", "putlocker.com", "sockshare.com", "dramapassion.com",
    "yooclick.com", "online.ua", "tgo-tv.com", "bitcoiner.net", "litecoiner.net"])) {
    a.bait("div", "#tester");
}
if (a.domCmp(["cutwin.com", "cut-urls.com", "adbull.me", "xess.pro", "clik.pw", "admove.co", "urle.co",
    "adshort.co", "linksh.top", "adshorte.com", "coinb.ink", "l2s.io"])) {
    a.bait("div", "#test-block", true);
}
if (a.domCmp(["filecom.net", "upshare.org", "skippyfile.com", "mwfiles.net", "up-flow.org", "globeslot.com"])) {
    a.bait("div", "#add");
}
if (a.domCmp(["razercrypt.com", "satoshiempire.com", "oneadfaucet.com", "bluesatoshi.com"])) {
    a.bait("div", "#test");
}
if (a.domCmp(["bitcoinaliens.com", "door2windows.com"])) {
    a.bait("ins", ".adsbygoogle");
}
if (a.domCmp(["leaguesecretary.com", "teknogods.com", "hellsmedia.com"])) {
    a.bait("div", "#adpbtest");
}
if (a.domCmp(["freesportsbet.com", "sportsplays.com"])) {
    a.bait("div", "#ad-tester");
}
if (a.domCmp(["bitcoiner.net", "litecoiner.net"])) {
    a.bait("div", "#ad-top");
}

//=====Other Specific Rules=====
if (a.domCmp(["mid-day.com", "happytrips.com"])) {
    a.readOnly("canRun", true);
}
if (a.domCmp(["voici.fr", "programme-tv.net"])) {
    a.bait("div", "#sas_script2");
}
if (a.domCmp(["chip.de", "moviepilot.com", "nowloading.co", "champions.co"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/271
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/363
    a.noAccess("stop");
}
if (a.domCmp(["badtv.it", "badtaste.it", "badgames.it", "badcomics.it"])) {
    a.cookie("adBlockChecked", "disattivo");
}
if (a.domCmp(["bknime.com", "go4up.com", "debrido.com", "thepcspy.com"])) {
    a.css(".myTestAd { height:1px; }");
}
if (a.domCmp(["buzina.xyz", "farmet.info", "rimladi.com", "kitorelo.com", "omnipola.com", "porosin.co.uk",
    "rimleno.com", "simple4alls.com", "arsopo.com", "buzina.xyz"])) {
    a.css("#adsframe { height:151px; }");
}
if (a.domCmp(["manga9.com", "mangabee.co"])) {
    a.css(".adblock { height:31px; }");
}
if (a.domCmp(["mangabird.com", "onemanga2.com"])) {
    a.css(".afs_ads { height:5px; }");
}
if (a.domCmp(["sc2casts.com"])) {
    a.inject(() => {
        "use strict";
        window._gaq = { push() { } };
    });
    a.readOnly("scriptfailed", () => { });
    a.readOnly("showdialog", () => { });
    a.readOnly("showPopup2", () => { });
}
if (a.domCmp(["livemint.com"])) {
    a.readOnly("canRun1", true);
}
if (a.domCmp(["userscloud.com"])) {
    a.on("load", () => {
        $("#dl_link").show();
        $("#adblock_msg").remove();
    });
}
if (a.domCmp(["vidlox.tv", "vidoza.net", "dato.porn"])) {
    //NSFW!
    a.readOnly("xRds", false);
    a.readOnly("cRAds", true);
}
if (a.domCmp(["vidlox.tv"])) {
    a.readOnly("adb", 0);
}
if (a.domCmp(["cwtv.com"])) {
    //Thanks to szymon1118
    a.readOnly("wallConfig", false);
    a.readOnly("CWTVIsAdBlocking", undefined);
}
if (a.domCmp(["theinquirer.net"])) {
    a.readOnly("_r3z", true);
}
if (a.domCmp(["tweaktown.com"])) {
    a.on("load", () => {
        //Force enable scrolling
        a.css("html, body { overflow:scroll; }");
        //Watch and remove block screen
        const blockScreenRemover = () => {
            if ($("body").children("div").last().text().includes("Ads slowing you down?")) {
                $("body").children("div").last().remove();
                $("body").children("div").last().remove();
            } else {
                setTimeout(blockScreenRemover, 500);
            }
        };
        setTimeout(blockScreenRemover, 500);
    });
}
if (a.domCmp(["ratemyprofessors.com"])) {
    a.filter("addEventListener", a.matchMethod.RegExp, /^resize$/i);
}
if (a.domCmp(["gamepedia.com"])) {
    a.on("load", () => {
        $("#atflb").remove();
    });
}
if (a.domCmp(["cbox.ws"])) {
    a.readOnly("koddostu_com_adblock_yok", true);
}
if (a.domCmp(["pinkrod.com", "wetplace.com"])) {
    //NSFW!
    a.readOnly("getAd", () => { });
    a.readOnly("getUtm", () => { });
}
if (a.domCmp(["hackintosh.computer"])) {
    //Prevent article hidding
    a.noAccess("google_jobrunner");
}
if (a.domCmp(["tvregionalna24.pl"])) {
    a.inject(() => {
        "use strict";
        //Listen and extract functions
        let text = [];
        const matcher = /var _ended=(.*);var _skipButton/;
        const newFunc = (a, b, func) => {
            let temp = "(" + matcher.exec(String(func))[1] + ")();";
            temp = temp.replace("player.dispose();", "");
            text.push(temp);
        };
        window.Object.defineProperty(window, "videojs", {
            configurable: false,
            set() { },
            get() {
                return newFunc;
            },
        });
        //Dispatch extracted functions on load
        window.addEventListener("load", function replace() {
            if (text.length > 0 && window.document.getElementsByClassName("vjs-poster").length > 0) {
                for (let i = 0; i < text.length; i++) {
                    window.eval(text[i]);
                }
            } else {
                window.setTimeout(replace, 1000);
            }
        });
    });
}
if (a.domCmp(["tvn.pl", "tvnstyle.pl", "tvnturbo.pl", "kuchniaplus.pl", "miniminiplus.pl"])) {
    //Replace player - Thanks to szymon1118
    //Potential related domains:
    //["tvnfabula.pl", "itvnextra.pl", "tvn24bis.pl", "ttv.pl", "x-news.pl", "tvn7.pl", "itvn.pl", "tvn.pl", "tvn24.pl"]
    const homePages = ["http://www.tvn.pl/", "http://www.tvnstyle.pl/", "http://www.tvnturbo.pl/"];
    //Homepages are partially fixed and are handled by List
    if (!homePages.includes(location.href)) {
        const handler = () => {
            const elem = $(".videoPlayer");
            if (elem.length) {
                const src = elem.data("src");
                elem.parent().after(a.nativePlayer(src)).remove();
            }
        };
        setInterval(handler, 1500);
    }
}
if (a.domCmp(["player.pl"])) {
    const matcher = /[.,]/;
    a.on("load", () => {
        //Check element
        let elem = $("header.detailImage");
        if (elem.length === 0) {
            return;
        }
        //Get ID
        const parts = location.href.split(matcher);
        const id = parts[parts.length - 2];
        const params = {
            platform: "ConnectedTV",
            terminal: "Panasonic",
            format: "json",
            authKey: "064fda5ab26dc1dd936f5c6e84b7d3c2",
            v: "3.1",
            m: "getItem",
            id: id,
        };
        const api = "https://api.tvnplayer.pl/api/?" + a.serialize(params);
        const proxy = "http://www.proxy.xmc.pl/index.php?hl=3e5&q=";
        //Send request
        const requestURL = (a.cookie("tvn_location2") === "1") ? api : proxy + encodeURIComponent(api);
        a.request({
            method: "GET",
            url: requestURL,
        }, (result) => {
            //Find media url
            let url;
            try {
                let data = JSON.parse(result);
                let vidSources = data.item.videos.main.video_content;
                if (vidSources[1].url) {
                    //Native player
                    elem.html(a.nativePlayer(vidSources[1].url));
                    $("video").css("maxHeight", "540px");
                } else if (vidSources[0].src) {
                    //DRM protected
                    console.error("uBlock Protector will not replace this video player because it is DRM prtected.");
                }
            } catch (err) {
                console.error("uBlock Protector failed to find media URL!");
            }
        }, () => {
            console.error("uBlock Protector failed to find media URL!");
        });
    });
}
if (a.domCmp(["ewallstreeter.com"])) {
    a.readOnly("OAS_rdl", 1);
}
if (a.domCmp(["megogo.net"])) {
    a.readOnly("showAdBlockMessage", () => { });
}
if (a.domCmp(["elektroda.pl"])) {
    a.filter("setTimeout", a.matchMethod.string, "adBlockTest.offsetHeight");
}
if (a.domCmp(["anandabazar.com"])) {
    a.readOnly("canRunAds", false);
}
if (a.domCmp(["forbes.com"])) {
    if (location.pathname.includes("/welcome")) {
        a.cookie("welcomeAd", "true", 86400000, "/");
        a.cookie("dailyWelcomeCookie", "true", 86400000, "/");
        location.href = a.cookie("toUrl") || "https://www.forbes.com/";
    }
}
if (a.domCmp(["abczdrowie.pl", "autokrata.pl", "autokult.pl", "biztok.pl", "gadzetomania.pl", "hotmoney.pl",
    "kafeteria.pl", "kafeteria.tv", "komediowo.pl", "komorkomania.pl", "money.pl", "pudelek.tv", "sfora.pl",
    "snobka.pl", "wawalove.pl", "wp.pl", "wp.tv", "wrzuta.pl", "pudelek.pl", "fotoblogia.pl", "parenting.pl",
    "echirurgia.pl", "pudelekx.pl", "o2.pl", "kardiolo.pl"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/70
    a.cookie("ABCABC", "true");
    a.filter("addEventListener", a.matchMethod.stringExact, "advertisement");
    a.readOnly("hasSentinel", () => false);
    //}
    //Run the other solution unless it is known to cause problem, the solution above is not reliable
    //if (a.domCmp(["money.pl", "parenting.pl", "tech.wp.pl", "sportowefakty.wp.pl", "teleshow.wp.pl", "moto.wp.pl",
    //    "film.wp.pl", "gry.wp.pl", "wiadomosci.wp.pl", "portal.abczdrowie.pl", "o2.pl"])) {
    //Thanks to szymon1118
    if (document.domain !== "wp.tv" && document.domain !== "gry.wp.pl") {
        let mid; //Media ID of next video
        let midArray1 = []; //Media IDs from method 1
        let midArray2 = []; //Media IDs from method 2
        let url = null; //URL of the next video
        let replaceCounter = 0; //The number of video players that are replaced
        let loadCounter = 0; //The index of next item to load
        let networkBusy = false; //A flag to prevent sending a new request before the first one is done
        let networkErrorCounter = 0; //Will stop sending request if this is over 5
        let isInBackground = false; //A flag to prevent excessive CPU usage when the tab is in background
        //The player container matcher
        let containerMatcher = ".wp-player-outer, .player__container, .wp-player, .embed-container";
        const reMatcher = /mid[=,](\d+)/;
        const reMagicValidator = /^\d+$/;
        //Mid extracting method 1 magic listener
        const magic = a.uid();
        addEventListener(magic, (e) => {
            //Must verify as data from injected script cannot be trusted
            if (reMagicValidator.test(e.detail)) {
                midArray1.push(e.detail);
            }
        });
        //Main function
        const main = () => {
            //Do not tick when in background
            if (isInBackground) {
                return;
            }
            //Log media ID arrays
            a.debugMode && console.log(midArray1, midArray2);
            //Mid extracting method 1
            a.inject(`(() => {
                "use strict";
                try {
                    if (window.WP.player.list.length > ${midArray1.length}) {
                        let thisMid = window.WP.player.list[${midArray1.length}].p.url;
                        if (thisMid) {
                            thisMid = thisMid.substring(thisMid.lastIndexOf("=") + 1);
                        }
                        //Extra safety check
                        if (thisMid) {
                            window.dispatchEvent(new window.CustomEvent("${magic}", {
                                detail: thisMid,
                            }));
                        }
                    }
                } catch (err) { }
            })();`, true);
            //Mid extracting method 2
            {
                let selection = $(containerMatcher)
                if (selection.length) {
                    const elem = selection.find(".titlecont a.title");
                    let thisMid = elem.attr("href");
                    //Check if I got the element
                    if (thisMid) {
                        thisMid = reMatcher.exec(thisMid)[1].toString();
                        //I will destroy the player soon anyway, I will remove this now so I will not extract it twice
                        elem.remove();
                    }
                    //Extra safety check
                    if (thisMid) {
                        midArray2.push(thisMid);
                    }
                }
            }
            //See if I need to load next URL
            if (loadCounter === replaceCounter) {
                //Check flag and error counter
                if (networkBusy) {
                    return
                } else if (networkErrorCounter > 5) {
                    //Abort
                    clearInterval(timerToken);
                    return;
                }
                //Get media ID
                let mid;
                //Prefer media ID extracting method 2
                const midArray = (midArray1.length > midArray2.length) ? midArray1 : midArray2;
                if (midArray.length > loadCounter) {
                    mid = midArray[loadCounter];
                } else {
                    return;
                }
                //Get media JSON, I do not need to check if mid is found since the function will return if it is not
                networkBusy = true;
                a.request({
                    method: "GET",
                    url: `http://wp.tv/player/mid,${mid},embed.json`,
                }, (res) => {
                    //Try to find media URL
                    try {
                        const response = JSON.parse(res);
                        for (let i = 0; i < response.clip.url.length; i++) {
                            let item = response.clip.url[i];
                            if (item.quality === "HQ" && item.type.startsWith("mp4")) {
                                url = item.url;
                                break;
                            }
                        }
                        //Check if I found the URL
                        if (!url) {
                            throw "Media URL Not Found";
                        }
                        //Update counter
                        loadCounter++;
                        //Reset error counter
                        networkErrorCounter = 0;
                    } catch (err) {
                        console.error("uBlock Protector failed to find media URL!");
                        networkErrorCounter += 1;
                    }
                    //Update flag
                    networkBusy = false;
                }, () => {
                    console.error("uBlock Protector failed to load media JSON!");
                    networkErrorCounter += 0.5;
                    //Update flag
                    networkBusy = false;
                });
            } else if ($(containerMatcher).length) {
                //Log element to be replace
                if (a.debugMode) {
                    console.log("Replacing player...");
                    console.log($(containerMatcher).selection[0]);
                }
                //Replace player, need to remove class or it will be caught in anti-collapsing observer
                $(containerMatcher).after(a.nativePlayer(url)).rmClass().remove();
                //Update variables and counter
                url = null;
                replaceCounter++;
            }
        };
        //The function will not run if the page is in the background, once per second will be fine
        const timerToken = setInterval(main, 1000);
        a.on("focus", () => { isInBackground = false; });
        a.on("blur", () => { isInBackground = true; });
    }
    if (a.domCmp(["wiadomosci.wp.pl"])) {
        //Prevent the video player from collapsing
        a.onRemove((node, target) => {
            if ((node.querySelector && node.querySelector("video > source")) ||
                (node.classList && node.classList.contains("wp-player"))) {
                document.querySelector("article").appendChild(node);
            }
        });
    }
    if (a.domCmp(["portal.abczdrowie.pl"])) {
        a.css("figcaption { display:none; }");
        /*
        a.on("load", () => {
            const elems = document.querySelectorAll("figcaption");
            for (let i = 0; i < elems.length; i++) {
                if (elems[i].parentNode.querySelector("video")) {
                    elems[i].remove();
                }
            }
        });
        */
    }
}
if (a.domCmp(["wtkplay.pl"])) {
    a.readOnly("can_run_ads", true);
}
if (a.domCmp(["betterdocs.net"])) {
    a.filter("eval", a.matchMethod.string, "eval(function(p,a,c,k,e,d)");
}
if (a.domCmp(["wired.com"])) {
    a.readOnly("google_onload_fired", true);
}
if (a.domInc(["knowlet3389.blogspot"])) {
    a.filter("setTimeout", a.matchMethod.string, '$("#gAds").height()');
}
if (a.domCmp(["freegameserverhost.com"])) {
    a.css("#fab13 { height:11px; }");
}
if (a.domCmp(["elahmad.com"])) {
    a.css("#adblock { height:1px; }");
}
if (a.domCmp(["mrtzcmp3.net"])) {
    a.css(".rtm_ad { height:1px; }");
}
if (a.domCmp(["debridfast.com", "getdebrid.com", "debrid.us", "leecher.us"])) {
    a.css(".myTestAd, .my24Ad, .nabil { height:1px; }");
    a.ready(() => {
        $("#simpleAd").html(`<p style="display:none;">debridfast.com</p>`);
    });
}
if (a.domCmp(["bg-gledai.tv"])) {
    a.css(".myAd { height:1px; }");
}
if (a.domCmp(["thepcspy.com"])) {
    a.css(".blocked { display:none; }");
    a.ready(() => {
        $(".blocked").remove();
    });
}
if (a.domCmp(["vg.no", "e24.no"])) {
    a.css(".ad { display:none; }");
    a.readOnly("__AB__", () => { });
}
if (a.domCmp(["automobile-sportive.com"])) {
    a.css(".myTestAd { height:51px; display:none; }");
}
if (a.domCmp(["snsw.us"])) {
    a.css("#ad_1 { height:1px; }");
}
if (a.domCmp(["urlchecker.net"])) {
    a.css("#adchecker { height:20px; }");
}
if (a.domCmp(["skiplimite.tv"])) {
    a.css("div.addthis_native_toolbox + div[id] { height:12px; }");
}
if (a.domCmp(["filecore.co.nz"])) {
    a.css(".adsense { height:5px; }");
}
if (a.domCmp(["thomas-n-ruth.com"])) {
    a.css(".Google { height:5px; }");
}
if (a.domCmp(["interfans.org"])) {
    a.css(".ad_global_header { height:1px; display:none; }");
}
if (a.domCmp(["maxdebrideur.com"])) {
    a.css(".clear + div[id] { height:12px; }");
}
if (a.domCmp(["topzone.lt"])) {
    a.css(".forumAd { height: 1px; display:none; }");
}
if (a.domInc(["nana10"])) {
    a.css("#advert-tracker { height:1px; }");
}
if (a.domCmp(["plej.tv"])) {
    a.css(".advert_box { height:1px; }");
}
if (a.domCmp(["mangamint.com"])) {
    a.css(".ad728 { height:31px; }");
}
if (a.domCmp(["debrideurstream.fr"])) {
    a.css("#content div[id][align=center] { height:12px; }");
}
if (a.domCmp(["preemlinks.com"])) {
    a.css("#divads { height:1px; }");
}
if (a.domCmp(["hentai.to"])) {
    a.css("#hentaito123 { height:11px; }");
}
if (a.domCmp(["prototurk.com"])) {
    a.css("#reklam { height:1px; }");
}
if (a.domCmp(["mufa.de"])) {
    a.css("#leaderboard { height:5px; }");
    a.css("#large-rectangle { height:5px; }");
    a.css("#ad-header-468x60 { height:5px; }");
}
if (a.domCmp(["watcharab.com"])) {
    a.css("#adblock { height:5px; }");
}
if (a.domCmp(["freedom-ip.com"])) {
    a.css(".pub_vertical ins, .pub_vertical div { height:11px; }");
}
if (a.domCmp(["wakanim.tv"])) {
    a.css("#detector { display:none; }");
    a.css("#nopub { display:block; }");
}
if (a.domCmp(["simply-debrid.com"])) {
    a.inject(() => {
        "use strict";
        window.adsbygoogle = {};
        window.adsbygoogle.loaded = true;
    });
}
if (a.domCmp(["kodilive.eu"])) {
    a.css(".Ad { height:5px; }");
}
if (a.domCmp(["backin.net"])) {
    a.css("#divad { height:31px; }");
}
if (a.domCmp(["mobile-tracker-free.com"])) {
    a.css("#myAds { height:1px; }");
}
if (a.domCmp(["workupload.com"])) {
    a.always(() => {
        a.css(".adBlock, .adsbygoogle, #sad { height:11px; }");
    });
}
if (a.domCmp(["intoday.in", "businesstoday.in", "lovesutras.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/109
    a.css("#adbocker_alt { display:none; }");
    a.readOnly("openPopup", () => { });
}
if (a.domCmp(["jc-mp.com"])) {
    a.css(".adsense { width:1px; height:1px; visibility:hidden; display:block; position:absolute; }");
}
if (a.domCmp(["mariage-franco-marocain.net"])) {
    a.css("#my_ad_div { height:1px; }");
}
if (a.domCmp(["happy-hack.ru"])) {
    a.css("#blockblockF4 { visibility:invisible; display:none; } #blockblockF4 td {visibility:invisible; display:none; } " +
        "#blockblockF4 td p { visibility:invisible; display:none; } #blockblockD3 { visibility:visible; display:block; }");
}
if (a.domCmp(["tgo-tv.com"])) {
    a.css("#adb, #bannerad1, .load_stream { display:none; }");
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            window.threshold = 1000;
        });
        $(".chat_frame").remove();
    });
}
if (a.domCmp(["freegamehosting.nl"])) {
    a.bait("div", "#adtest");
}
if (a.domCmp(["theweatherspace.com"])) {
    a.bait("div", "#ab-bl-advertisement");
}
if (a.domCmp(["cleodesktop.com"])) {
    a.bait("div", "#myTestAd");
}
if (a.domCmp(["imageraider.com"])) {
    a.bait("div", "#myGContainer");
}
if (a.domCmp(["mil.ink"])) {
    a.bait("div", "#ads_div");
}
if (a.domCmp(["stream4free.eu"])) {
    a.bait("div", "#jpayday");
    a.readOnly("jpayday_alert", 1);
}
if (a.domCmp(["lg-firmware-rom.com"])) {
    a.readOnly("killads", true);
}
if (a.domCmp(["xmac.xyz"])) {
    a.readOnly("killAds", true);
}
if (a.domCmp(["independent.co.uk"])) {
    a.cookie("adblock_detected", "ignored");
}
if (a.domCmp(["3dnews.ru"])) {
    a.cookie("adblockwarn", "1");
    a.css("#earAds { width:401px; }");
    a.bait("div", "#earAds");
    a.readOnly("__AT_detected", true);
}
if (a.domCmp(["esmas.com"])) {
    a.readOnly("opened_adbblock", false);
}
if (a.domInc(["pinoy1tv"])) {
    a.readOnly("allowads", 1);
}
if (a.domCmp(["business-standard.com"])) {
    a.readOnly("adsLoaded", 1);
    a.cookie("_pw", "t");
}
if (a.domCmp(["thechive.com"])) {
    a.readOnly("stephaneDetector", `{
        hook(cb) { cb(false); },
        init() { },
        broadcastResult() { },
    }`);
}
if (a.domCmp(["richonrails.com"])) {
    a.ready(() => {
        $(".article-content").after(`<div class="article-content-2"></div>`).remove();
        const payload = `"<ins+id="aswift_0_expand"+style="display:inline-table;border:none;height:90px;` +
            `margin:0;padding:0;position:relative;visibility:visible;width:750px;background-color:transparent"><ins+id="aswi` +
            `ft_0_anchor"+style="display:block;border:none;height:90px;margin:0;padding:0;position:relative;visibility:visib` +
            `le;width:750px;background-color:transparent"><iframe+marginwidth="0"+marginheight="0"+vspace="0"+hspace="0"+all` +
            `owtransparency="true"+scrolling="no"+allowfullscreen="true"+onload="var+i=this.id,s=window.google_iframe_oncopy` +
            `,H=s&amp;&amp;s.handlers,h=H&amp;&amp;H[i],w=this.contentWindow,d;try{d=w.document}catch(e){}if(h&amp;&amp;d&am` +
            `p;&amp;(!d.body||!d.body.firstChild)){if(h.call){setTimeout(h,0)}else+if(h.match){try{h=s.upd(h,i)}catch(e){}w.` +
            `location.replace(h)}}"+id="aswift_0"+name="aswift_0"+style="left:0;position:absolute;top:0;"+width="750"+frameb` +
            `order="0"+height="90"></iframe></ins></ins>"`;
        $.request({
            method: "POST",
            url: $(".article-content").data("url"),
            headers: {
                "Accept": "text/javascript",
            },
            payload: a.serialize({
                html: payload,
            }),
        }, (result) => {
            const exec = result.replace("$('.article-content')", "$('.article-content-2')");
            a.inject(`(() => {
                "use strict";
                ${exec}
            })();`, true);
        }, () => { });
    });
}
if (a.domCmp(["rmprepusb.com"])) {
    a.cookie("jot_viewer", "3");
}
if (a.domCmp(["cubeupload.com"])) {
    a.filter("write", a.matchMethod.string, "Please consider removing adblock to help us pay our bills", "window.document");
}
if (a.domCmp(["hentaihaven.org"])) {
    //NSFW!
    //Thanks to uBlock-user
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/76
    a.noAccess("desktop_variants");
}
if (a.domCmp(["debridnet.com", "livedebrid.com"])) {
    //a.css(".myTestAd2 { height:5px; }");
    //a.bait("div", ".myTestAd2");
    a.filter("addEventListener", a.matchMethod.string, "jQuery.event.dispatch.apply");
}
if (a.domCmp(["bluesatoshi.com"])) {
    a.css("#test { height:280px; }");
}
if (a.domCmp(["razercrypt.com", "satoshiempire.com", "oneadfaucet.com"])) {
    a.css("#test { height:250px; }");
}
if (a.domCmp(["jkanime.net"])) {
    a.bait("div", "#reco");
}
if (a.domCmp(["paidverts.com"])) {
    a.bait("div", ".afs_ads");
}
if (a.domCmp(["italiatv.org"])) {
    a.bait("div", "#fab13");
}
if (a.domCmp(["eventhubs.com"])) {
    a.bait("div", "#blahyblaci1");
}
if (a.domCmp(["superanimes.com"])) {
    a.bait("div", "#bannerLoja");
}
if (a.domCmp(["forum.pac-rom.com"])) {
    a.bait("div", ".banner_ads");
}
if (a.domCmp(["litv.tv"])) {
    a.bait("div", ".player_mask");
}
if (a.domCmp(["leveldown.fr"])) {
    a.bait("div", "#adblocktest");
}
if (a.domCmp(["globeslot.com"])) {
    a.bait("div", "#add1");
}
if (a.domCmp(["antennesport.com", "serverhd.eu"])) {
    a.ready(() => {
        $("#pub .pubclose").remove();
        $("#pub .embed iframe").attr("src", "/embed/embed.php");
    });
}
if (a.domCmp(["generatupremium.biz"])) {
    a.cookie("genera", "false");
}
if (a.domCmp(["newstatesman.com"])) {
    a.cookie("donationPopup", "hide");
}
if (a.domCmp(["yes.fm"])) {
    a.readOnly("com_adswizz_synchro_initialize", () => { });
}
if (a.domCmp(["tek.no", "gamer.no", "teknofil.no", "insidetelecom.no", "prisguide.no", "diskusjon.no",
    "teknojobb.no", "akam.no", "hardware.no", "amobil.no"])) {
    a.ready(() => {
        $("body").append("<div id='google_ads_iframe_'><p></p></div>");
    });
}
if (a.domInc(["planetatvonlinehd.blogspot"]) || a.domCmp(["planetatvonlinehd.com"])) {
    a.css(".adsantilok { height:1px; }");
}
if (a.domCmp(["beta.speedtest.net"])) {
    a.readOnly("adsOoklaComReachable", true);
    a.readOnly("scriptsLoaded", () => { });
}
if (a.domCmp(["binbucks.com"])) {
    a.readOnly("testJuicyPay", true);
    a.readOnly("testSensePay", true);
}
if (a.domCmp(["whiskyprijzen.com", "whiskyprices.co.uk", "whiskypreise.com", "whiskyprix.fr"])) {
    a.readOnly("OA_show", true);
}
if (a.domCmp(["di.se"])) {
    a.ready(() => {
        $("#header_overlay").remove();
        $("#message_modal").remove();
    });
}
if (a.domCmp(["libertaddigital.com"])) {
    a.readOnly("ad_already_played", true);
    a.readOnly("puedeMostrarAds", true);
}
if (a.domCmp(["folha.uol.com.br"])) {
    a.readOnly("paywall_access", true);
    a.readOnly("folha_ads", true);
}
if (a.domCmp(["gamer.com.tw"])) {
    a.readOnly("AntiAd", null);
};
if (a.domCmp(["armorgames.com"])) {
    a.readOnly("ga_detect", null);
}
if (a.domCmp(["mangahost.com"])) {
    a.readOnly("testDisplay", false);
}
if (a.domCmp(["videowood.tv"])) {
    a.inject(() => {
        "use strict";
        window.config = {};
    });
    a.readOnly("adb_remind", false);
}
if (a.domCmp(["infojobs.com.br"])) {
    a.readOnly("adblock", 0);
}
if (a.domCmp(["jbzdy.pl"])) {
    a.inject(() => {
        "use strict";
        let val;
        window.Object.defineProperty(window, "App", {
            configurable: false,
            set(arg) {
                val = arg;
                try {
                    val.adb.init = () => { };
                } catch (err) { }
            },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["comptoir-hardware.com"])) {
    a.readOnly("adblock", `"non"`);
}
if (a.domCmp(["narkive.com"])) {
    a.readOnly("adblock_status", () => false);
}
if (a.domCmp(["pregen.net"])) {
    a.cookie("pgn", "1");
}
if (a.domCmp(["phys.org"])) {
    a.readOnly("chkAB", () => { });
}
if (a.domCmp(["onvasortir.com"])) {
    a.readOnly("JeBloque", () => { });
}
if (a.domCmp(["fullhdzevki.com"])) {
    a.readOnly("check", () => { });
}
if (a.domCmp(["freecoins4.me"])) {
    a.readOnly("check", () => false);
}
if (a.domCmp(["ville-ideale.com"])) {
    a.readOnly("execsp", () => { });
}
if (a.domCmp(["notre-planete.info"])) {
    a.readOnly("pubpop", () => { });
}
if (a.domCmp(["apkmirror.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/241
    //a.readOnly("doCheck", () => { });
    a.noAccess("ranTwice");
}
if (a.domCmp(["mtlblog.com"])) {
    a.readOnly("puabs", () => { });
}
if (a.domCmp(["15min.lt"])) {
    a.noAccess("__adblock_config");
}
if (a.domCmp(["anizm.com"])) {
    a.always(() => {
        a.inject(() => {
            "use strict";
            window.stopAdBlock = {};
        });
    });
}
if (a.domCmp(["diarioinformacion.com"])) {
    a.readOnly("pr_okvalida", true);
}
if (a.domCmp(["cnbeta.com"])) {
    a.readOnly("JB", () => { });
}
if (a.domCmp(["haaretz.co.il"])) {
    a.inject(() => {
        "use strict";
        window.AdBlockUtil = {};
    });
}
if (a.domCmp(["pipocas.tv"])) {
    a.cookie("popup_user_login", "yes");
}
if (a.domCmp(["vgunetwork.com"])) {
    a.ready(() => {
        a.cookie("stopIt", "1");
        $("#some_ad_block_key_close").click();
    });
}
if (a.domCmp(["eventosppv.me"])) {
    a.ready(() => {
        $("#nf37").remove();
    });
}
if (a.domCmp(["bolor-toli.com"])) {
    a.on("load", () => {
        $(".banner").html("<br>").css("height", "1px");
    });
}
if (a.domCmp(["vivo.sx"])) {
    a.on("load", () => {
        $("#alert-throttle").remove();
        $("button#access").attr("id", null, true).attr("disabled", null, true).html("Continue To Video");
        setTimeout(() => {
            $("input[name='throttle']").remove();
        }, 1000);
    });
}
if (a.domCmp(["luxyad.com"])) {
    a.ready(() => {
        if (location.pathname === "/Information.php") {
            const href = location.href;
            location.href = href.substr(href.indexOf("url=") + 4, href.length);
        }
    });
}
if (a.domCmp(["dbplanet.net"])) {
    a.cookie("newnoMoreAdsNow", "1");
}
if (a.domCmp(["aidemu.fr"])) {
    a.cookie("adblockPopup", "true");
}
if (a.domCmp(["eami.in"])) {
    a.always(() => {
        a.cookie("ad_locked", "1");
    });
}
if (a.domCmp(["bigdownloader.com"])) {
    a.ready(() => {
        $("#anti_adblock").remove();
    });
}
if (a.domCmp(["freeskier.com"])) {
    a.ready(() => {
        $("#adb-not-enabled").css("display", "");
        $("#videoContainer").css("display", "");
    });
}
if (a.domCmp(["gametrailers.com"])) {
    a.ready(() => {
        $("#ad_blocking").remove();
    });
}
if (a.domCmp(["scan-mx.com", "onepiece-mx.net", "naruto-mx.net"])) {
    a.ready(() => {
        $("#yop").attr("id", "");
    });
}
if (a.domCmp(["bitcoinker.com"])) {
    a.readOnly("claim", () => true);
    a.ready(() => {
        $("#E33FCCcX2fW").remove();
    });
}
if (a.domCmp(["moondoge.co.in", "moonliteco.in", "moonbit.co.in", "bitcoinzebra.com"])) {
    a.ready(() => {
        $("#AB, #E442Dv, #eCC5h").remove();
    });
}
if (a.domCmp(["torrent-tv.ru"])) {
    a.readOnly("c_Oo_Advert_Shown", true);
}
if (a.domCmp(["inn.co.il"])) {
    a.inject(() => {
        "use strict";
        window.TRC = {};
        window.TRC.blocker = {
            states: {
                ABP_DETECTION_DISABLED: -2,
                ABP_NOT_DETECTED: 0,
                ABP_DETECTED: 1,
            },
            createBlockDetectionDiv() { return window.document.createElement("div"); },
            isBlockDetectedOnDiv() { return 0; },
            isBlockDetectedOnClassNames() { return 0; },
            getBlockedState() { return 0; },
        };
    });
}
if (a.domCmp(["bhaskar.com", "divyabhaskar.co.in"])) {
    a.readOnly("openPopUpForBreakPage", () => { });
    a.readOnly("canABP", true);
    a.readOnly("canCheckAds", true);
}
if (a.domCmp(["turkanime.tv"])) {
    a.always(() => {
        a.inject(() => {
            "use strict";
            window.adblockblock = () => { };
            window.BlokKontrol = {};
        });
    });
}
if (a.domCmp(["wtfbit.ch"])) {
    a.readOnly("writeHTMLasJS", () => { });
}
if (a.domCmp(["ndtv.com"])) {
    a.readOnly("___p__p", 1);
    a.readOnly("getNoTopLatestNews", () => { });
}
if (a.domCmp(["lesechos.fr", "lesechos.com"])) {
    a.readOnly("checkAdBlock", () => { });
    a.readOnly("paywall_adblock_article", () => { });
    a.readOnly("call_Ad", 1);
}
if (a.domCmp(["bitvisits.com"])) {
    a.readOnly("blockAdblockUser", () => { });
}
if (a.domCmp(["vipleague.is", "vipleague.ws", "vipleague.tv", "vipleague.se", "vipleague.me", "vipapp.me",
    "vipleague.mobi", "vipleague.co", "vipleague.sx", "vipleague.ch", "vipbox.tv", "vipbox.co", "vipbox.biz",
    "vipbox.sx", "vipbox.eu", "vipbox.so", "vipbox.nu", "vipboxsa.co", "strikeout.co", "strikeout.me",
    "homerun.re", "vipboxtv.co"])) {
    a.cookie("xclsvip", "1");
    a.css(".vip_052x003 { height:250px; }");
    a.css(".vip_09x827 { height:26px; }");
    a.css("#overlay { display:none; }");
}
if (a.domCmp(["zoomtv.me"])) {
    a.readOnly("iaxpEnabled", true);
}
if (a.domCmp(["pornve.com"])) {
    //NSFW!
    a.readOnly("adxjwupdate", 1);
}
if (a.domCmp(["lol.moa.tw"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.MoaObj = window.MoaObj || {};
            window.MoaObj.ad = window.MoaObj.ad || {};
            window.MoaObj.ad.hasAdblock = () => false;
            window.MoaObj.ad.checkABP = () => false;
        });
    });
}
if (a.domCmp(["dailybitcoins.org"])) {
    a.ready(() => {
        $(".ad-img").remove();
    });
}
if (a.domCmp(["kozaczek.pl", "zeberka.pl"])) {
    a.cookie("ablc", "1");
    a.cookie("cookie_policy", "1");
}
if (a.domCmp(["spankwire.com", "keezmovies.com", "extremetube.com", "mofosex.com"])) {
    a.cookie("abClosed", "true");
    a.cookie("hide_ad_msg", "1");
}
if (a.domCmp(["youporn.com", "youporngay.com"])) {
    a.cookie("adblock_message", "closed");
}
if (a.domCmp(["citationmachine.net"])) {
    a.cookie("sbm_cm_citations", "0");
}
if (a.domCmp(["psarips.com"])) {
    a.noAccess("open");
}
if (a.domCmp(["extratorrent.cc", "extratorrent.com"])) {
    a.cookie("ppu_delay", "1");
    a.cookie("ppu_main", "1");
    a.cookie("ppu_sub", "1");
    a.cookie("ppu_show_on", "1");
}
if (a.domCmp(["tny.cz", "pasted.co"])) {
    a.cookie("__.popunderCap", "1");
    a.cookie("__.popunder", "1");
}
if (a.domCmp(["debrastagi.com"])) {
    a.ready(() => {
        $("#stp-main").remove();
        $("#stp-bg").remove();
    });
}
if (a.domCmp(["ddlfrench.org"])) {
    a.ready(() => {
        $("#dle-content .d-content").rmClass();
        $("#content").attr("id", "");
    });
}
if (a.domCmp(["mega-debrid.eu"])) {
    a.on("load", () => {
        $(".realbutton").attr("onclick", "").attr("type", "submit");
    });
}
if (a.domInc(["slideplayer"])) {
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            window.force_remove_ads = true;
            const slide_id = window.get_current_slide_id();
            const slide_srv = window.document.getElementById("player_frame").src.split("/")[3];
            const time = 86400 + window.Math.floor(window.Date.now() / 1000);
            const secret = window.encodeURIComponent(window.strtr(window.MD5.base64("secret_preved slideplayer never solved " +
                time + slide_id + ".ppt"), "+/", "- "));
            const url = `http://player.slideplayer.org/download/${slide_srv}/${slide_id}/${secret}/${time}/${slide_id}.ppt`;
            let links = window.document.querySelectorAll("a.download_link");
            for (let i = 0; i < links.length; i++) {
                let events = window.$._data(links[i]).events.click;
                events.splice(0, events.length);
                links[i].href = url;
            }
        });
    });
}
if (a.domCmp(["bokepspot.com"])) {
    a.cookie("hideDialog", "hide");
    a.ready(() => {
        $("#tupiklan").remove();
    });
}
if (a.domCmp(["picload.org"])) {
    a.cookie("pl_adblocker", "false");
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.ads_loaded = true;
            window.imageAds = false;
        });
        $("div[oncontextmenu='return false;']").remove();
    });
}
if (a.domCmp(["freezedownload.com"])) {
    a.ready(() => {
        if (location.pathname.startsWith("/download/")) {
            $("body > div[id]").remove();
        }
    });
}
if (a.domCmp(["monnsutogatya.com"])) {
    a.ready(() => {
        a.css("#site-box { display:block; }");
        $("#for-ad-blocker").remove();
    });
}
if (a.domCmp(["rapid8.com"])) {
    a.ready(() => {
        $("div.backk + #blcokMzg").remove();
        $("div.backk").remove();
    });
}
if (a.domCmp(["turkdown.com"])) {
    a.ready(() => {
        $("#duyuru").remove();
    });
}
if (a.domCmp(["privateinsta.com"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.dont_scroll = false;
        });
        $("#overlay_div").remove();
        $("#overlay_main_div").remove();
    });
}
if (a.domCmp(["oneplaylist.eu.pn"])) {
    a.readOnly("makePopunder", false);
}
if (a.domCmp(["onmeda.de"])) {
    a.readOnly("$ADP", true);
    a.readOnly("sas_callAd", () => { });
    a.readOnly("sas_callAds", () => { });
}
if (a.domCmp(["rockfile.eu"])) {
    a.ready(() => {
        $("body").append(`<iframe src="about:blank" style="visibility:hidden;"></iframe>`);
    });
}
if (a.domCmp(["referencemega.com", "fpabd.com", "crackacc.com"])) {
    a.cookie("_lbGatePassed", "true");
}
if (a.domCmp(["link.tl"])) {
    a.css(".adblock { height:1px; }");
    a.timewarp("setInterval", a.matchMethod.stringExact, "1800");
}
if (a.domCmp(["wstream.video"])) {
    a.css("#adiv { height:4px; }");
}
if (a.domCmp(["4shared.com"])) {
    a.ready(() => {
        document.body.classList.remove("jsBlockDetect");
    });
}
if (a.domCmp(["pro-zik.ws", "pro-tect.ws", "pro-ddl.ws", "pro-sport.ws"])) {
    a.cookie("visitedf", "true");
    a.cookie("visitedh", "true");
}
if (a.domCmp(["bakersfield.com"])) {
    a.readOnly("AD_SLOT_RENDERED", true);
}
if (a.domCmp(["ekstrabladet.dk", "eb.dk"])) {
    a.noAccess("eb");
}
if (a.domCmp(["pcgames-download.net"])) {
    a.always(() => {
        a.cookie("noAdblockNiceMessage", "1");
        a.inject(() => {
            "use strict";
            window.mgCanLoad30547 = true;
        });
    });
}
if (a.domCmp(["lachainemeteo.com"])) {
    a.readOnly("js_loaded", true);
}
if (a.domCmp(["mac4ever.com"])) {
    a.readOnly("coquinou", () => { });
}
if (a.domCmp(["5278bbs.com"])) {
    a.readOnly("myaabpfun12", () => { });
}
if (a.domCmp(["thesimsresource.com"])) {
    a.readOnly("gadsize", true);
    a.readOnly("iHaveLoadedAds", true);
}
if (a.domCmp(["yellowbridge.com"])) {
    a.readOnly("finalizePage", () => { });
}
if (a.domCmp(["kissanime.com", "kissanime.to", "kissanime.ru"])) {
    a.css("iframe[id^='adsIfrme'], .divCloseBut { display:none; }");
    const magic = a.uid();
    addEventListener(magic, () => {
        $("iframe[id^='adsIfrme'], .divCloseBut").remove();
    });
    a.ready(() => {
        a.inject(`(() => {
            "use strict";
            const divContentVideo = window.document.getElementById("divContentVideo");
            if (window.DoDetect2) {
                window.DoDetect2 = null;
                window.CheckAdImage = null;
            } else if (divContentVideo) {
                const divDownload = window.document.getElementById("divDownload").cloneNode(true);
                window.setTimeout(() => {
                    divContentVideo.innerHTML = "";
                    window.DoHideFake();
                    divContentVideo.appendChild(divDownload);
                    window.dispatchEvent(new window.CustomEvent("${magic}"));
                }, 5500);
            }
        })();`, true);
    });
}
if (a.domCmp(["kisscartoon.me", "kisscartoon.se"])) {
    a.readOnly("xaZlE", () => { });
    a.ready(() => {
        $("iframe[id^='adsIfrme']").remove();
    });
}
if (a.domCmp(["openload.co", "openload.io", "openload.tv"])) {
    a.readOnly("adblock2", false);
    a.readOnly("popAdsLoaded", true);
}
if (a.domCmp(["youwatch.org", "chouhaa.info", "ahzahg6ohb.com"])) {
    a.ready(() => {
        $("#player_imj, #player_imj + div[id]").remove();
    });
}
if (a.domCmp(["youwatch.to", "he2eini7ka.com"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            let tries = 0;
            const check = () => {
                if (window.closeOnPlayerBanner) {
                    window.closeOnPlayerBanner();
                } else {
                    if (tries++ < 20) {
                        window.setTimeout(check, 500);
                    }
                }
            };
            check();
        });
    });
}
if (a.domCmp(["exashare.com", "chefti.info", "bojem3a.info", "ajihezo.info", "yahmaib3ai.com"])) {
    a.ready(() => {
        $("#player_gaz, #player_gaz + div[id]").remove();
    });
}
if (a.domCmp(["an1me.se"])) {
    a.readOnly("isBlockAds2", false);
}
if (a.domCmp(["hqq.tv"])) {
    a.ready(() => {
        if (location.pathname === "/player/embed_player.php") {
            $("form[id^='form-']").submit();
        }
    });
}
if (a.domCmp(["koscian.net"])) {
    a.ready(() => {
        $(".ban").remove();
    });
}
if (a.domCmp(["eclypsia.com"])) {
    a.generic.FuckAdBlock("MggAbd", "mggAbd");
}
if (a.domCmp(["gamingroom.tv"])) {
    a.readOnly("adblock_detect", () => { });
    a.readOnly("GR_adblock_hide_video", () => { });
    a.readOnly("adblock_video_msg_start", () => { });
    a.readOnly("adblock_video_msg_stop", () => { });
    a.readOnly("disable_chat", () => { });
}
if (a.domCmp(["rtl.de"])) {
    a.ready(() => {
        $("div[data-widget='video']").each((elem) => {
            try {
                const url = elem.dataset.playerLayerCfg.videoinfo.mp4url;
                elem.insertAdjacentHTML("afterend", a.nativePlayer(url));
                elem.remove();
            } catch (err) { }
        });
    });
}
if (a.domCmp(["play.radio1.se", "play.bandit.se", "play.lugnafavoriter.com", "play.rixfm.se"])) {
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            window.setTimeout(() => {
                window.player_load_live(window.stream_id);
            }, 1000);
        });
    });
}
if (a.domCmp(["dplay.com", "dplay.dk", "dplay.se"])) {
    let date = new Date();
    date.setDate(date.getDate() + 365);
    const timestamp = date.getTime().toString();
    const value = JSON.stringify({
        notificationSubmission: "submitted",
        reportingExpiry: timestamp,
        notificationExpiry: timestamp,
    });
    a.cookie("dsc-adblock", value);
}
if (a.domCmp(["viafree.no", "viafree.dk", "viafree.se", "tvplay.skaties.lv", "play.tv3.lt", "tv3play.tv3.ee"])) {
    //Thanks to szymon1118
    let isInBackground = false;
    const reMatcher = /\/(\d+)/;
    const reMagicValidator = /^\d+$/;
    let videoID;
    const findIDFlag = a.domCmp(["tvplay.skaties.lv", "play.tv3.lt", "tv3play.tv3.ee"], true);
    const magic = a.uid();
    addEventListener(magic, (e) => {
        if (reMagicValidator.test(e.detail)) {
            videoID = e.detail;
        };
    });
    const videoJS = (source, type, width, height) => {
        return `<iframe srcdoc='<html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.10.5/al` +
            `t/video-js-cdn.min.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/video.j` +
            `s/5.10.5/video.min.js"><\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib` +
            `-hls/3.1.0/videojs-contrib-hls.min.js"><\/script><style type="text/css">html, body{padding:0; margin` +
            `:0;}.vjs-default-skin{color:#eee}.vjs-default-skin .vjs-play-progress,.vjs-default-skin .vjs-volume-` +
            `level{background-color:#eee}.vjs-default-skin .vjs-big-play-button,.vjs-default-skin .vjs-control-ba` +
            `r{background:rgba(0,0,0,.2)}.vjs-default-skin .vjs-slider{background:rgba(0,0,0,.3)}</style></head><` +
            `body><video id="uBlock_Protector_Video_Player" class="video-js vjs-default-skin" controls preload="a` +
            `uto" width="${width}" height="${height}"><source src="${source}" type="${type}"></video><script>vide` +
            `ojs("uBlock_Protector_Video_Player")<\/script></body></html>' width="${width}" height="${height}" fr` +
            `ameborder="0" scrolling="no" allowfullscreen="true"></iframe>`;
    };
    const handler = () => {
        if (isInBackground) {
            setTimeout(handler, 1000);
            return;
        }
        //Check player existance
        if (!document.getElementById("video-player")) {
            setTimeout(handler, 1000);
            return;
        }
        //Find ID
        if (findIDFlag) {
            let tmp = reMatcher.exec(location.href);
            if (tmp) {
                videoID = tmp[1];
            }
        } else {
            a.inject(`(() => {
                "use strict";
                try {
                    if (window.vfAvodpConfig.videoId) {
                        window.dispatchEvent(new window.CustomEvent("${magic}"), {
                            detail: window.vfAvodpConfig.videoId,
                        });
                    }
                } catch (err) { }
            })();`, true);
        }
        //Assume failed if no event dispatched in 1 second
        setTimeout(() => {
            if (!videoID) {
                setTimeout(handler, 1000);
                return;
            }
            //Request data JSON
            //The proxy does not seem work anymore
            //const proxy = "http://www.sagkjeder.no/p/browse.php?u=";
            a.request({
                method: "GET",
                url: `http://playapi.mtgx.tv/v3/videos/stream/${videoID}`,
            }, (result) => {
                if (a.debugMode) {
                    console.log("Response received:");
                    console.log(result);
                }
                parser(result);
            }, () => {
                console.error("uBlock Protector failed to find media URL!");
            });
        }, 1000);
    };
    const parser = (data) => {
        //Parse response
        let streams;
        try {
            const parsedData = JSON.parse(data);
            streams = parsedData.streams;
            if (!streams) {
                throw "Media URL Not Found";
            }
        } catch (err) {
            console.error("uBlock Protector failed to find media URL!");
            return;
        }
        //Check source and type
        let source, type;
        if (streams.high && streams.high !== "") {
            source = streams.high;
            type = "video/mp4";
        } else if (streams.hls && streams.hls !== "") {
            source = streams.hls;
            type = "application/x-mpegURL";
        } else if (streams.medium && streams.medium !== "") {
            source = streams.medium;
            type = streams.medium.startsWith("rtmp") ? "rtmp/mp4" : "application/f4m+xml";
        } else {
            console.error("uBlock Protector failed to find media URL!");
            return;
        }
        if (a.debugMode) {
            console.log("Potential media URLs:");
            console.log([streams.high, streams.hls, streams.medium]);
            console.log("Used media URL:");
            console.log(source);
        }
        //Replace player
        const player = $("#video-player");
        const width = player.width();
        const height = player.height();
        player.after(videoJS(source, type, width, height)).remove();
        //Watch for more video players
        videoID = null;
        //I think it will only have one player, and I need a way to prevent replacing the same player over and over
        //handler();
    };
    //Start
    handler();
    a.on("focus", () => { isInBackground = false; });
    a.on("blur", () => { isInBackground = true; });
}
if (a.domCmp(["firstrow.co", "firstrows.ru", "firstrows.tv", "firstrows.org", "firstrows.co",
    "firstrows.biz", "firstrowus.eu", "firstrow1us.eu", "firstsrowsports.eu", "firstrowsportes.tv",
    "firstrowsportes.com", "justfirstrowsports.com", "hahasport.me", "wiziwig.ru", "wiziwig.sx",
    "wiziwig.to", "wiziwig.tv", "myp2p.biz", "myp2p.tv", "myp2p.la", "myp2p.ec", "myp2p.eu", "myp2p.sx",
    "myp2p.ws", "myp2p.com", "atdhe.ru", "atdhe.se", "atdhe.bz", "atdhe.top", "atdhe.to", "atdhe.me",
    "atdhe.mx", "atdhe.li", "atdhe.al"])) {
    a.always(() => {
        a.cookie("adb", "1");
        a.css("#bannerInCenter, #hiddenBannerCanvas { display:none; }");
    });
}
if (a.domCmp(["buzina.xyz", "farmet.info", "rimladi.com", "kitorelo.com", "omnipola.com", "porosin.co.uk",
    "rimleno.com", "simple4alls.com", "arsopo.com"])) {
    a.ready(() => {
        $("#adsframe").remove();
        $("#remove-over").click();
    });
}
if (a.domCmp(["buzina.xyz"])) {
    a.ready(() => {
        const elem = $("iframe[src*='.php?hash=']");
        if (elem.length) {
            let parts = elem.attr("src").split("/");
            parts[2] = "arsopo.com";
            elem.attr("src", parts.join("/"));
        }
    });
}
if (a.domCmp(["allmyvideos.net", "amvtv.net"])) {
    a.cookie("_favbt33", "1");
}
if (a.domCmp(["ilive.to", "streamlive.to"])) {
    a.on("load", () => {
        if (location.pathname.toLowerCase().startsWith("/embedplayer.php")) {
            setTimeout(() => {
                a.inject(() => {
                    "use strict";
                    window.removeOverlayHTML();
                });
            }, 1000);
        }
    });
}
if (a.domCmp(["micast.tv"])) {
    a.cookie("vid_main", "true");
    a.cookie("vid_sub", "true");
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            if (window.removeOverlayHTML) {
                window.removeOverlayHTML();
            }
        });
    });
}
if (a.domCmp(["sharecast.to"])) {
    a.ready(() => {
        if (location.pathname.startsWith("/embed.php")) {
            const token = setInterval(() => {
                a.cookie("vid_main", "true");
                a.cookie("vid_sub", "2");
                a.cookie("vid_delay", "true");
            }, 100);
            setTimeout(() => {
                clearInterval(token);
            }, 5000);
            $("#table1").remove();
        }
    });
}
if (a.domCmp(["pxstream.tv"])) {
    a.on("load", () => {
        if (location.pathname.startsWith("/embedrouter.php")) {
            setTimeout(() => {
                a.inject(() => {
                    "use strict";
                    window.closeAd();
                });
            }, 1000);
        }
    });
}
if (a.domCmp(["sawlive.tv"])) {
    a.ready(() => {
        if (location.pathname.toLowerCase().startsWith("/embed/watch/")) {
            a.inject(() => {
                "use strict";
                window.display = false;
                window.closeAd();
            });
        }
    });
}
if (a.domCmp(["goodcast.co"])) {
    a.ready(() => {
        if (location.pathname.startsWith("/stream.php")) {
            $(".advertisement").hide();
            $(".adsky iframe").attr("src", "about:blank");
        }
    });
}
if (a.domCmp(["showsport-tv.com"])) {
    a.ready(() => {
        if (location.pathname.startsWith("/ch.php")) {
            $("#advertisement, .advertisement").remove();
        }
    });
}
if (a.domCmp(["cityam.com", "computerworlduk.com", "techworld.com", "v3.co.uk"])) {
    a.ready(() => {
        $("#r3z-wait").remove();
        $(".r3z-hide").rmClass("r3z-hide");
        a.inject(() => {
            "use strict";
            window._r3z = null;
        });
    });
}
if (a.domCmp(["next-episode.net", "kingmaker.news", "gamespowerita.com", "todayidol.com", "receive-a-sms.com",
    "wakeupcallme.com", "ringmycellphone.com", "faqmozilla.org", "thememypc.com"])) {
    a.always(() => {
        a.inject(() => {
            "use strict";
            window.google_jobrunner = {};
        });
    });
}
if (a.domCmp(["dawn.com"])) {
    a.generic.FuckAdBlock("DetectAdBlock", "detectAdBlock");
}
if (a.domCmp(["sports.fr", "europe1.fr"])) {
    a.generic.FuckAdBlock("FabInstance", "fabInstance");
}
if (a.domCmp(["newyorker.com"])) {
    a.generic.FuckAdBlock("SniffAdBlock", "sniffAdBlock");
}
if (a.domCmp(["mangasproject.com.br", "mangasproject.net.br", "mangas.zlx.com.br"])) {
    a.generic.FuckAdBlock(a.uid(), "mangasLeitorSlider");
}
if (a.domCmp(["qnimate.com"])) {
    a.readOnly("adBlockDetected", () => { });
}
if (a.domCmp(["eurotransport.de"])) {
    a.generic.FuckAdBlock(a.uid(), "antiAdBlock");
}
if (a.domCmp(["tzetze.it", "beppegrillo.it", "la-cosa.it"])) {
    a.generic.FuckAdBlock("CADetect", "cadetect");
}
if (a.domCmp(["agario.sx", "agarabi.com"])) {
    a.generic.FuckAdBlock(a.uid(), "agario_SX_ads");
}
if (a.domCmp(["filespace.com"])) {
    a.generic.FuckAdBlock(a.uid(), "fAB");
}
if (a.domCmp(["topserialy.to"])) {
    a.bait("div", "#ad-etarget", true);
    a.generic.FuckAdBlock("LoL", "loL");
}
if (a.domCmp(["sport-show.fr", "vipflash.net", "2site.me"])) {
    a.css("#blockblockA { visibility:invisible; display:none; } #blockblockA td { visibility:invisible; " +
        "display:none; } #blockblockA td p { visibility:invisible; display:none; } #blockblockB " +
        "{ visibility:visible; display:block; }");
}
if (a.domCmp(["gametransfers.com", "winandmac.com", "free-steam-giveaways.com", "canalwp.com",
    "alphahistory.com", "nordpresse.be", "sospc.name", "baboo.com.br", "nflix.pl"])) {
    a.always(() => {
        a.cookie("anCookie", "true");
        a.inject(() => {
            "use strict";
            window.anOptions = {};
        });
    });
}
if (a.domCmp(["lewebtvbouquetfrancophone.overblog.com", "webtv.bloguez.com", "latelegratuite.blogspot.com",
    "totaldebrid.org", "37.187.173.205", "tvgratuite.blogspot.com"])) {
    a.bait("div", "#my_ad_div");
    a.readOnly("jabbahud", () => { });
}
if (a.domCmp(["mybank.pl", "rapidgrab.pl"])) {
    a.filter("addEventListener", a.matchMethod.string, ".nextFunction()}");
}
if (a.domCmp(["linkdrop.net", "revclouds.com", "leporno.org", "uploadshub.com", "dasolo.org",
    "fullstuff.net", "zeusnews.it", "cheminots.net", "lolsy.tv", "animes-mangas-ddl.com",
    "darkstars.org", "corepacks.com", "naturalbd.com", "yourlifeupdated.net", "computerworm.net",
    "coolsoft.altervista.org", "openload.us", "cda-online.pl", "urbanplanet.org", "mamahd.com",
    "sadeempc.com", "avmoo.com", "thailande-fr.com", "btaia.com", "tusoft.org", "hisse.net",
    "europeup.com", "nrj.fr", "srnk.co", "animmex.co", "crackhex.com", "revealedtricks4u.com",
    "pizzamaking.com"])) {
    a.filter("setTimeout", a.matchMethod.string, "bab_elementid");
}
if (a.domCmp(["demo-phoenix.com", "dpstream.net", "gum-gum-streaming.com", "jeu.info", "sofoot.com",
    "gaara-fr.com", "gaytube.com", "tuxboard.com", "xstory-fr.com", "hentaifr.net", "filmstreaming-hd.com",
    "filmvf.net", "hentaihaven.org", "narutoshippudenvf.com", "thebadbuzz.com", "manga-news.com", "jeu.video",
    "mangas-fr.com"])) {
    a.css("body { visibility:visible; }");
}
if (a.domCmp(["emuparadise.me"])) {
    a.always(() => {
        $("h2").includes("Bandwidth is expensive").parent().remove();
    });
}
if (a.domCmp(["sapib.ca"])) {
    a.readOnly("Abd_Detector", () => { });
}
if (a.domCmp(["wowhead.com"])) {
    a.ready(() => {
        $("div[id^='ad-']").parent().parent().parent().remove();
    });
}
if (a.domCmp(["epiotrkow.pl"])) {
    a.bait("div", "#adboxx");
}
if (a.domCmp(["fox.com.tr"])) {
    a.readOnly("adblockDetector", `{
        init() { }
    }`);
}
if (a.domCmp(["thebatavian.com"])) {
    a.readOnly("broadstreet", true);
}
if (a.domCmp(["zrabatowani.pl"])) {
    a.cookie("adblockAlert", "yes");
}
if (a.domCmp(["hanime.tv"])) {
    //NSFW!
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/76
    const magic = a.uid();
    addEventListener(magic, () => {
        a.forceClose();
    });
    a.inject(`(() => {
        "use strict";
        const _open = window.open;
        window.open = (...args) => {
            _open.apply(window, args);
            window.dispatchEvent(new window.CustomEvent("${magic}"));
        };
    })();`, true);
}
if (a.domCmp(["firstonetv.eu"])) {
    a.readOnly("blocked", () => { });
    a.readOnly("adFuckBlock", () => { });
}
if (a.domCmp(["whosampled.com"])) {
    a.readOnly("showAdBlockerOverlay", () => { });
}
if (a.domCmp(["pornhub.com", "redtube.com", "youporn.com", "tube8.com", "pornmd.com",
    "thumbzilla.com", "xtube.com", "peeperz.com", "czechhq.net", "29443kmq.video"])) {
    //NSFW!
    //29443kmq.video is the iframe of czechhq.net, other domains are part of Porthub Network
    a.inject(() => {
        "use strict";
        window.open = (arg) => {
            if (arg.includes(window.document.domain)) {
                window.location.href = arg;
            }
        };
    });
}
if (a.domCmp(["pastebin.com"])) {
    a.readOnly("abdd", `""`);
}
if (a.domCmp(["xnxx.com", "xvideos.com", "xvideos.works"])) {
    a.cookie("wpn-popupunder", "1");
    a.readOnly("openpop", () => { });
}
if (a.domCmp(["burning-feed.com"])) {
    //Thanks to uBlock-user
    //a.readOnly("testab", `"1"`);
    //a.readOnly("ads_enable", `"true"`);
    a.readOnly("ads_enable", () => { });
}
if (a.domCmp(["ghame.ru"])) {
    $("html").prepend("<p class='adsbygoogle' style='display:none;'>hi</p>");
}
if (a.domCmp(["thevideo.me", "fmovies.to", "fmovies.se", "fmovies.is"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/86
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/99
    a.inject(() => {
        "use strict";
        window.open = () => { };
    });
}
if (a.domCmp(["is.fi"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/88
    a.readOnly("Sabdetect_load", false);
}
if (a.domCmp(["mooseroots.com", "insidegov.com", "gearsuite.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/96
    a.css("html,body { overflow-y:scroll; } .BOX-wrap { display:none; }");
}
if (a.domCmp(["sandiegouniontribune.com"])) {
    const token = setInterval(() => {
        const elem = $("#reg-overlay");
        if (elem.length) {
            elem.remove();
            $("head").append("<style> html[data-dss-meterup], [data-dss-meterup] body { overflow: scroll !important; } </style>");
            clearInterval(token);
        }
    }, 1000);
}
if (a.domCmp(["startclass.com", "sandiegouniontribune.com"])) {
    a.filter("addEventListener", a.matchMethod.stringExact, "scroll");
}
if (a.domCmp(["adz.bz", "mellow.link", "hop.bz", "mellowads.com", "url.vin", "clik.bz"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/106
    a.inject(() => {
        "use strict";
        let val;
        const newFunc = () => {
            window.callAPI(
                "publishing",
                "VerifyLinkClick",
                {
                    linkRef: val.linkRef(),
                    linkClickRef: window.$("#LinkClickRef")[0].value,
                    recaptchaResponse: val.recaptchaResponse(),
                },
                "Verify",
                "Verifying",
                (response) => {
                    if (response.result) {
                        window.location.href = response.linkURL;
                    } else {
                        window.showMessageModal("Verify failed", response.resultHtml, response.result);
                    }
                },
                null,
                () => {
                    window.grecaptcha.reset();
                },
            );
        };
        window.Object.defineProperty(window, "linkVM", {
            configurable: false,
            set(arg) {
                val = arg;
                try {
                    val.verify = newFunc;
                } catch (err) { }
            },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["zap.in"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/201
    a.inject(() => {
        "use strict";
        let val;
        const newFunc = () => {
            window.callAPI(
                "VerifyZapClick",
                {
                    linkRef: val.linkRef(),
                    linkClickRef: window.$("#LinkClickRef")[0].value,
                    recaptchaResponse: val.recaptchaResponse(),
                },
                "Verify",
                "Verifying",
                (response) => {
                    if (response.result) {
                        window.location.href = response.zapURL;
                    } else {
                        window.showMessageModal("Verify failed", response.resultHtml, response.result);
                    }
                },
                null,
                () => {
                    window.grecaptcha.reset();
                },
            );
        };
        window.Object.defineProperty(window, "zapVM", {
            configurable: false,
            set(arg) {
                val = arg;
                try {
                    val.verify = newFunc;
                } catch (err) { }
            },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["bonusbitcoin.co"])) {
    //Issue: https://github.com/reek/anti-adblock-killer/issues/3377
    a.injectWithRuntime(() => {
        "use strict";
        const matcher1 = /adBlocked:[^,]+/;
        const matcher2 = /self/g;
        let val;
        window.Object.defineProperty(window, "faucetVM", {
            configurable: false,
            set(arg) {
                val = arg;
                try {
                    execute(`(() => {
                        "use strict";
                        window.faucetVM.claim = ${String(val.claim).replace(matcher1, "adBlocked: false")
                            .replace(matcher2, "window.faucetVM")};
                    })();`);
                } catch (err) { }
            },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["shink.in"])) {
    //Skip countdown
    if (location.pathname.startsWith("/go/")) {
        a.ready(() => {
            const link = document.getElementById("btn-main");
            const i = link.href.lastIndexOf("http");
            const url = link.href.substr(i);
            location.href = url;
        });
    }
    //Block popup
    a.inject(() => {
        "use strict";
        window.open = () => { };
        const _createElement = window.document.createElement;
        window.document.createElement = (...args) => {
            switch (args[0].toLowerCase()) {
                case "a":
                    return null;
                case "iframe":
                    let elem = _createElement.apply(window.document, args);
                    /*
                    //Causes some problems
                    elem.onload = () => {
                        try {
                            //Remove open and createElement
                            elem.contentWindow.open = () => { };
                            elem.contentWindow.document.createElement = () => { };
                        } catch (err) {
                            //reCaptcha frame, ignore
                        }
                    };
                    */
                    return elem;
                default:
                    return _createElement.apply(window.document, args);
            }
        };
    });
}
if (a.domCmp(["gamezhero.com"])) {
    a.readOnly("ads", true);
    a.timewarp("setInterval", a.matchMethod.string, "function (){var _0x");
}
if (a.domCmp(["freetvall.com"])) {
    a.readOnly("clickNS", () => { });
}
if (a.domCmp(["hotslogs.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/121
    a.inject(() => {
        "use strict";
        window.MonkeyBroker = {};
    });
    a.noAccess("regSlotsMap", "window.MonkeyBroker");
}
if (a.domCmp(["undeniable.info"])) {
    a.bait("div", "#testadblock");
}
if (a.domInc(["gamereactor"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/124
    a.cookie("overlayMessage", "1");
    //Skip welcome page
    a.ready(() => {
        if ($("a.buttonBox.continue > span").startsWith("Continue to ").length) {
            location.reload();
        }
    });
}
if (a.domCmp(["dasolo.co"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/126
    a.inject(() => {
        "use strict";
        window.eval = () => { };
    });
    a.noAccess("adblockblock");
    a.bait("div", "#loveyou");
    //Remove right click and shortcut keys blocker
    //a.readOnly will crash function declaration, so these are enough
    a.readOnly("nocontext", null);
    a.readOnly("mischandler", null);
    a.readOnly("disableselect", null);
    a.filter("addEventListener", a.matchMethod.stringExact, "contextmenu", "window.document");
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/280
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            window.document.oncontextmenu = null;
            window.document.onmousedown = null;
            window.document.onmouseup = null;
            window.setTimeout(() => {
                window.$("body").unbind("contextmenu");
                window.$("#id").unbind("contextmenu");
            }, 250);
        });
    });
}
if (a.domCmp(["titulky.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/128
    a.generic.FuckAdBlock("FADB", "fADB");
}
if (a.domCmp(["discoveryrom.org"])) {
    a.inject(() => {
        "use strict";
        window.adsbygoogle = [];
    });
}
if (a.domCmp(["sthelensstar.co.uk", "runcornandwidnesworld.co.uk", "leighjournal.co.uk",
    "warringtonguardian.co.uk", "northwichguardian.co.uk", "middlewichguardian.co.uk",
    "knutsfordguardian.co.uk", "wilmslowguardian.co.uk", "creweguardian.co.uk",
    "thewestmorlandgazette.co.uk", "newsquest.co.uk", "messengernewspapers.co.uk",
    "lancashiretelegraph.co.uk", "asianimage.co.uk", "chorleycitizen.co.uk",
    "theboltonnews.co.uk", "burytimes.co.uk", "prestwichandwhitefieldguide.co.uk",
    "wirralglobe.co.uk", "autoexchange.co.uk", "chesterlestreetadvertiser.co.uk",
    "consettstanleyadvertiser.co.uk", "darlingtonaycliffesedgefieldadvertiser.co.uk",
    "darlingtonandstocktontimes.co.uk", "durhamadvertiser.co.uk",
    "edition.pagesuite-professional.co.uk", "durhamtimes.co.uk", "northyorkshireadvertiser.co.uk",
    "thenorthernecho.co.uk", "northernfarmer.co.uk", "wearvalleyadvertiser.co.uk",
    "gazetteherald.co.uk", "yorkpress.co.uk", "cravenherald.co.uk", "ilkleygazette.co.uk",
    "keighleynews.co.uk", "thetelegraphandargus.co.uk", "wharfedaleobserver.co.uk",
    "herefordtimes.com", "ludlowadvertiser.co.uk", "redditchadvertiser.co.uk",
    "bromsgroveadvertiser.co.uk", "droitwichadvertiser.co.uk", "cotswoldjournal.co.uk",
    "eveshamjournal.co.uk", "tewkesburyadmag.co.uk", "dudleynews.co.uk", "halesowennews.co.uk",
    "stourbridgenews.co.uk", "kidderminstershuttle.co.uk", "ledburyreporter.co.uk",
    "malverngazette.co.uk", "worcesternews.co.uk", "southendstandard.co.uk",
    "essexcountystandard.co.uk", "gazette-news.co.uk", "clactonandfrintongazette.co.uk",
    "harwichandmanningtreestandard.co.uk", "braintreeandwithamtimes.co.uk", "halsteadgazette.co.uk",
    "guardian-series.co.uk", "brentwoodweeklynews.co.uk", "chelmsfordweeklynews.co.uk",
    "maldonandburnhamstandard.co.uk", "thurrockgazette.co.uk", "basildonrecorder.co.uk",
    "echo-news.co.uk", "bucksfreepress.co.uk", "theargus.co.uk", "redhillandreigatelife.co.uk",
    "romseyadvertiser.co.uk", "dailyecho.co.uk", "hampshirechronicle.co.uk",
    "basingstokegazette.co.uk", "andoveradvertiser.co.uk", "stalbansreview.co.uk",
    "watfordobserver.co.uk", "heraldseries.co.uk", "banburycake.co.uk", "bicesteradvertiser.net",
    "oxfordmail.co.uk", "oxfordtimes.co.uk", "witneygazette.co.uk", "falmouthpacket.co.uk",
    "smallholder.co.uk", "southwestfarmer.co.uk", "dorsetecho.co.uk", "bournmouthecho.co.uk",
    "bridportnews.co.uk", "wiltsglosstandard.co.uk", "gazetteseries.co.uk", "bridgwatermercury.co.uk",
    "burnhamandhighbridgeweeklynews.co.uk", "chardandilminsternews.co.uk", "middevonstar.co.uk",
    "somersetcountygazette.co.uk", "thisisthewestcountry.co.uk", "yeovilexpress.co.uk",
    "wiltshiretimes.co.uk", "swindonadvertiser.co.uk", "salisburyjournal.co.uk",
    "boxingnewsonline.net", "engagedinvestor.co.uk", "globalreinsurance.com", "insurancetimes.co.uk",
    "pensions-insight.co.uk", "strategic-risk-global.com", "reward-guide.co.uk", "thestrad.com",
    "times-series.co.uk", "borehamwoodtimes.co.uk", "ealingtimes.co.uk", "enfieldindependent.co.uk",
    "haringeyindependent.co.uk", "harrowtimes.co.uk", "hillingdontimes.co.uk", "newsshopper.co.uk",
    "croydonguardian.co.uk", "epsomguardian.co.uk", "streathamguardian.co.uk", "suttonguardian.co.uk",
    "wandsworthguardian.co.uk", "wimbledonguardian.co.uk", "surreycomet.co.uk", "kingstonguardian.co.uk",
    "richmondandtwickenhamtimes.co.uk", "campaignseries.co.uk", "southwalesguardian.co.uk",
    "milfordmercury.co.uk", "pembrokeshirecountyliving.co.uk", "westerntelegraph.co.uk",
    "tivysideadvertiser.co.uk", "southwalesargus.co.uk", "cotswoldessence.co.uk",
    "freepressseries.co.uk", "monmouthshirecountylife.co.uk", "barryanddistrictnews.co.uk",
    "penarthtimes.co.uk", "eveningtimes.co.uk", "s1cars.com", "s1community.com", "s1homes.com",
    "s1jobs.com", "s1rental.com", "thescottishfarmer.co.uk", "heraldscotland.com", "thenational.scot"])) {
    //These are NewsQuest related domains, add other domains that share this rule elsewhere
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/137
    a.readOnly("_sp_", null);
}
if (a.domCmp(["aetv.com", "history.com", "mylifetime.com"])) {
    a.inject(() => {
        "use strict";
        const f = (e) => { e(false); };
        window._sp_ = window._sp_ || {};
        window.Object.defineProperties(window._sp_, {
            "checkState": {
                configurable: false,
                set() { },
                get() {
                    return f;
                },
            },
            "isAdBlocking": {
                configurable: false,
                set() { },
                get() {
                    return f;
                },
            },
            "_detectionInstance": {
                configurable: false,
                set() { },
                get() {
                    return undefined;
                },
            },
        });
    });
}
if (a.domCmp(["finalservers.net"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/125
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.videojs("video_1").videoJsResolutionSwitcher();
        });
    });
}
if (a.domCmp(["filmy.to", "histock.info"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/130
    a.inject(() => {
        "use strict";
        window.open = () => {
            return { closed: false };
        };
    });
}
if (a.domCmp(["flashx.tv"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/130
    a.filter("addEventListener", a.matchMethod.RegExp, /^(mousedown|keydown|contextmenu)$/, "window.document");
    a.cookie("noprpaylqckrpuwntcnt", "1");
    a.cookie("noprpaylqckrpuwntexp", "1");
}
if (a.domCmp(["multiup.org", "multiup.eu"])) {
    a.cookie("visit", "1");
    a.readOnly("hi", () => { });
    a.ready(() => {
        $(".alert").includes("Tired of ads ? Remove them").remove();
        $("#M130814ScriptRootC54591").includes("Loading...").remove();
    });
}
if (a.domCmp(["linkneverdie.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/146
    a.readOnly("eval", () => {
        //Remove block screen
        window.$("div").each(function () {
            if (this.id.length === 30) {
                this.remove();
            }
        });
    });
    a.ready(() => {
        $(".SC_TBlock").textIs("loading...").remove();
        $("#wrapper").show();
    });
}
if (a.domCmp(["ally.sh", "al.ly", "croco.site"])) {
    a.inject(() => {
        "use strict";
        window.open = null;
    });
}
if (a.domCmp(["nbc.com"])) {
    a.noAccess("mps");
}
if (a.domCmp(["filmyiseriale.net"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/152
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.konik = 1;
        });
    });
}
if (a.domCmp(["tf2center.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/141
    a.filter("setInterval", a.matchMethod.string, '"/adblock"');
    a.filter("setTimeout", a.matchMethod.stringExact, "function (){B(F+1)}");
}
if (a.domCmp(["gaybeeg.info"])) {
    //NSFW!
    a.onInsert((node) => {
        if (node.innerHTML && node.innerHTML.includes("AdBloker Detected")) {
            node.remove();
        }
    });
    a.noAccess("uid");
    a.ready(() => {
        //Patch download button
        $(".download a.button").each((elem) => {
            elem.classList.remove("locked");
            elem.href = elem.dataset.href;
        });
    });
}
if (a.domCmp(["netdna-storage.com"])) {
    //NSFW!
    a.noAccess("uid");
    a.ready(() => {
        $(".plan-footer-item").each((elem) => {
            elem.href = elem.dataset.link;
        });
    });
}
if (a.domCmp(["mma-core.com"])) {
    a.noAccess("displayAdBlockedVideo");
}
if (a.domCmp(["menshealth.pl", "womenshealth.pl", "runners-world.pl", "auto-motor-i-sport.pl", "motocykl-online.pl",
    "mojeauto.pl"])) {
    a.ready(() => {
        if (location.pathname.startsWith("/welcome-page")) {
            location.href = $("#timeLink").attr("href");
        }
    });
}
if (a.domCmp(["dovathd.com"])) {
    a.ready(() => {
        $(".onp-sl-social-buttons-enabled").remove();
        $(".onp-sl-content").show();
    });
}
if (a.domCmp(["temp-mail.org"])) {
    a.readOnly("checkadBlock", () => { });
}
if (a.domCmp(["gaana.com"])) {
    a.inject(() => {
        "use strict";
        const noop = () => { };
        const pType = {
            _auds: "", //all
            isauds: false,
            lotamecall: false,
            itemInfo: [],
            colombiaAdeURL: "",
            deviceType: "", //desktop
            colombiaCookies: "",
            privateMode: true,
            adIconInfo: [],
            fns: { push: noop },
            update: noop,
            colombiaAdRequest: noop,
            resetAdDivClass: noop,
            clear: noop,
            clearData: noop,
            notifyColombiaAd: noop,
            refresh: noop,
            refreshFBAd: noop,
            timeoutHandler: noop,
            load: noop,
            loadDataAd: noop,
            drawIconHtml: noop,
            loadDisplayAd: noop,
            jsonCallback: noop,
            getCB: noop,
            repllaceMacro: noop,
            getAdJSON: noop,
            fireImpression: noop,
            fireThirdPartyImp: noop,
            storeThirdPartyImprURL: noop,
            dataResponseFormat: noop,
            storeAdIcons: noop,
            checkDevice: noop,
            dfpLog: noop,
        };
        let obj = function () { };
        obj.prototype = pType;
        const val = new obj();
        window.Object.defineProperty(window, "colombia", {
            configurable: false,
            set() { },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["gelbooru.com"])) {
    if (location.pathname === "/") {
        a.on("load", () => {
            $("div").each((elem) => {
                if (elem.textContent === "Have you first tried disabling your AdBlock?") {
                    elem.textContent = "";
                }
            });
        });
    } else {
        a.noAccess("abvertDar");
    }
}
if (a.domCmp(["playbb.me", "easyvideo.me", "videowing.me", "videozoo.me"])) {
    a.ready(() => {
        $(".safeuploada-content").css("background", "transparent");
    });
}
if (a.domCmp(["nicematin.com"])) {
    a.noAccess("checkAds");
}
if (a.domCmp(["up-4ever.com"])) {
    a.filter("setTimeout", a.matchMethod.string, "$('#adblock_detected').val(1);");
    //Force show download links
    a.css("#hiddensection { display:block; }");
    a.ready(() => {
        $("#hiddensection").show();
        $("#hiddensection2").remove();
    });
}
if (a.domCmp(["exrapidleech.info"])) {
    //Thanks to lain566
    //Prevent sending to verify page
    a.readOnly("PopAds", `"this is a string"`);
    a.cookie("popcashpuCap", "1");
    a.cookie("popcashpu", "1");
    //Remove warnings
    a.ready(() => {
        $(".alert-danger.lead").includes("block").remove();
        $("p").includes("Please disable ads block").remove();
        $("p").includes("Please turn on popup").remove();
    });
}
if (a.domCmp(["fastserver.me"])) {
    a.filter("alert", a.matchMethod.string, "Adblocker Detected!!");
}
if (a.domCmp(["ouo.io"])) {
    localStorage.setItem("snapLastPopAt", (new Date()).getTime());
}
if (a.domCmp(["canalplus.fr"])) {
    let videoElem; //Current video player element, used to replace it when changing episode
    const reMagicValidator = /^\d+$/;
    const magic = a.uid();
    addEventListener(magic, (e) => {
        if (reMagicValidator.test(e.detail)) {
            videoElem.text("Loading...");
            a.request({
                method: "GET",
                url: `http://service.canal-plus.com/video/rest/getVideos/cplus/${e.detail}?format=json`,
            }, (res) => {
                //Try to find media URL
                try {
                    const response = JSON.parse(res);
                    const url = response.MEDIA.VIDEOS.HD;
                    if (url) {
                        videoElem.after(a.nativePlayer(url + "?secret=pqzerjlsmdkjfoiuerhsdlfknaes")).remove();
                        videoElem = $("video");
                    } else {
                        throw "Media URL Not Found";
                    }
                } catch (err) {
                    console.error("uBlock Protector failed to find media URL!");
                }
            }, () => {
                console.error("uBlock Protector failed to load media JSON!");
            });
        }
    });
    a.ready(() => {
        //Get the original player
        videoElem = $("#onePlayerHolder");
    });
    a.inject(`(() => {
        "use strict";
        let original; //Will be set later
        let currentVideoId = null; //So I do not switch unless it is different
        //New handler
        const newFunc = function (onglet, liste, page, pid, ztid, videoId, progid) {
            //Switch video
            if (videoId !== currentVideoId) {
                currentVideoId = videoId;
                videoSwitcher(videoId);
            }
            //Run original function
            original.apply(window, arguments);
        };
        //Video switcher
        const videoSwitcher = function (videoID) {
            window.dispatchEvent(new window.CustomEvent("${magic}", {
                detail: videoID,
            }));
        };
        //Initialization
        window.addEventListener("DOMContentLoaded", () => {
            //Insert our handler in between theirs
            original = window.changeOngletColonneCentrale;
            window.changeOngletColonneCentrale = newFunc;
            //Set current video ID then patch the player for the first time
            const elem = window.document.getElementById("onePlayerHolder");
            if (elem && elem.getAttribute("data-video")) {
                currentVideoId = elem.getAttribute("data-video");
                videoSwitcher(currentVideoId);
            }
        });
    })();`, true);
}
if (a.domCmp(["receive-sms-online.info"])) {
    a.filter("addEventListener", a.matchMethod.stringExact, `function (b){return"undefined"!=typeof n&&` +
        `n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}`);
}
if (a.domCmp(["3dgames.com.ar"])) {
    a.generic.FuckAdBlock(a.uid(), "gw");
}
if (a.domCmp(["comicallyincorrect.com"])) {
    a.onInsert((node) => {
        if (node.tagName === "DIV" && node.innerHTML && node.innerHTML.includes("Paid Content:")) {
            node.remove();
        }
    });
}
if (a.domCmp(["cda.pl"])) {
    a.readOnly("adblockV1", true);
}
if (a.domCmp(["linternaute.com"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/224
    a.inject(() => {
        "use strict";
        window.OO = window.OO || {};
        window.Object.defineProperty(window.OO, "AAB", {
            configurable: false,
            set() { },
            get() {
                return null;
            },
        });
    });
}
if (a.domCmp(["new-skys.net"])) {
    a.noAccess("alert");
}
if (a.domCmp(["idlelivelink.blogspot.com"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.document.body.oncontextmenu = null;
            window.document.body.onkeydown = null;
            window.document.body.onmousedown = null;
        });
    });
}
if (a.domCmp(["hackinformer.com", "chelsea24news.pl"])) {
    a.readOnly("AlobaidiDetectAdBlock", true);
    a.ready(() => {
        $(".special-message-wrapper").includes("your ad blocker").remove();
    });
}
if (a.domCmp(["tg007.net"])) {
    a.bait("div", "#gads", true);
}
if (a.domCmp(["bild.de"])) {
    a.filter("querySelector", a.matchMethod.stringExact, "body", "window.document");
    a.noAccessExt("de.bild.cmsKonfig.a.a");
}
if (a.domCmp(["codepo8.github.io"]) && location.pathname.startsWith("/detecting-adblock/")) {
    a.css(".notblocked { display:block; } .blocked { display:none; }");
}
if (a.domCmp(["altadefinizione.media"])) {
    //Issue: https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/1
    a.ready(() => {
        $("a[href='http://altarisoluzione.online/HD/play5.php']").remove();
    });
}
if (a.domCmp(["hdpass.net"])) {
    //Issue: https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/1
    a.inject(() => {
        "use strict";
        let flag = false;
        window.open = () => {
            flag = true;
        };
        window.addEventListener("load", () => {
            let token = window.setInterval(() => {
                window.$(".wrapSpot span#closeSpot").click();
                if (flag) {
                    window.clearInterval(token);
                }
            }, 500);
        });
    });
}
if (a.domCmp(["nowvideo.ec", "nowvideo.li", "ewingoset.info"])) {
    //Issue: https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/2
    //Issue: https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/5
    a.ready(() => {
        $("#cty").append(`<input type="hidden" name="ab" value="1">`);
    });
}
if (a.domCmp(["karibusana.org"])) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/253
    a.noAccess("bizpanda");
    a.css(".onp-locker-call { display:block; }");
}
if (a.domCmp(["lewat.id", "u2s.io"])) {
    //Issue: https://gitlab.com/xuhaiyang1234/uBlockProtectorSecretIssues/issues/4
    let matcher;
    if (a.domCmp(["lewat.id"], true)) {
        matcher = /^https?:\/\/lewat\.id\//i;
    } else if (a.domCmp(["u2s.io"], true)) {
        matcher = /^https?:\/\/u2s\.io\//i;
    }
    const token = setInterval(() => {
        const elem = $(".skip-ad a");
        if (elem.length && elem.selection[0].href && !matcher.test(elem.selection[0].href)) {
            elem.hide();
            location.href = elem.selection[0].href;
            clearInterval(token);
        }
    }, 250);
}
if (a.domCmp(["shinden.pl"])) {
    a.readOnly("shinden_ads", true);
}
if (a.domCmp(["onhax.me"])) {
    a.inject(() => {
        "use strict";
        const _open = window.open;
        window.open = (...args) => {
            if (args[1].startsWith("wpcom")) {
                return _open.apply(window, args);
            }
        }
    });
}
if (a.domCmp(["null-24.com"])) {
    a.ready(() => {
        $("#custom-links .custom-url-wrap a").each((elem) => {
            elem.href = elem.innerHTML;
        });
        setTimeout(() => {
            a.inject(() => {
                "use strict";
                window.jQuery("span:contains(Download Direct Link)").parent().unbind("click");
            });
        }, 250);
    });
}
if (a.domCmp(["searchftps.net"])) {
    $("html").append(`<iframe width="336" height="280" style="display:none;"></iframe>`);
}
if (a.domCmp(["cyberterminators.co"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.document.oncontextmenu = null;
        });
    });
}
if (a.domCmp(["youtube-videos.tv"])) {
    a.css(".cactus-video-content div { display:block; } .mts-cl-horizontal.mts-cl-social-locker { display:none; }");
    a.noAccess("KillAdBlock");
}
if (a.domCmp(["dailyuploads.net"])) {
    a.css("#downloadBtnClickOrignal { display:block; } #downloadBtnClick { display:none; } #chkIsAdd { display:none; }");
}
if (a.domCmp(["buickforums.com"])) {
    a.bait("div", "#TestAdBlock", true);
}
if (a.domCmp(["realkana.com"])) {
    a.generic.FuckAdBlock("HooAdBlock", "hooAdBlock");
}
if (a.domCmp(["generatorlinkpremium.com"])) {
    a.ready(() => {
        const elem = $("#normal");
        const normal = elem.attr("href") + "&h=1";
        elem.attr("href", normal).attr("title", "Download this file with a faster download speed").css("cursor", "pointer");
    });
}
if (a.domCmp(["genbird.com"])) {
    a.filter("addEventListener", a.matchMethod.string, "Please disable your ad blocker.");
}
if (a.domCmp(["pg3dhacks.com"])) {
    a.ready(() => {
        const buttons = document.querySelectorAll("button");
        const matcher = /Unlock.*Download/;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText === "Download") {
                buttons[i].disabled = false;
            } else if (matcher.test(buttons[i].innerText)) {
                buttons[i].remove();
            }
        }
    });
}
if (a.domCmp(["lne.es"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.onload = null;
        });
    });
}
if (a.domCmp(["adshort.co", "linksh.top", "adshorte.com", "coinb.ink"])) {
    a.noAccess("F3Z9");
}
if (a.domCmp(["sport365.live"])) {
    a.inject(() => {
        "use strict";
        const _eval = window.eval;
        window.eval = (...args) => {
            try {
                window.$.adblock = false;
            } catch (err) { }
            _eval.apply(window, args);
        };
    });
}
if (a.domCmp(["myfxbook.com"])) {
    a.inject(() => {
        "use strict";
        const err = new window.Error("This property may not be accessed!");
        window.Object.defineProperty(window, "isAdBlockerExist", {
            configurable: false,
            set(val) {
                if (val) {
                    throw err;
                }
            },
            get() {
                throw err;
            },
        });
    });
}
if (a.domCmp(["ptztv.com", "mahobeachcam.com"])) {
    a.readOnly("PTZtv", true);
}
if (a.domCmp(["yiv.com"])) {
    a.cookie("AdBlockMessage", "yes");
}
if (a.domCmp(["short.am"])) {
    if (location.pathname !== "/") {
        a.readOnly("RunAds", undefined);
        a.ready(() => {
            let check = $("#disable > div.alert-danger");
            if (check.length) {
                check.text("Please wait...");
                a.on("load", () => {
                    //Based on AdsBypasser
                    //License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
                    let f = document.createElement("form");
                    f.style.display = "none";
                    f.method = "post";
                    let i = document.createElement("input");
                    i.name = "_image";
                    i.value = "Continue";
                    f.appendChild(i);
                    document.body.append(f);
                    f.submit();
                });
            }
        });
    }
}
if (a.domCmp(["ohmymag.com", "ohmymag.com.br", "gentside.com", "gentside.com.br", "maxisciences.com"])) {
    a.readOnly("adblockPopup", `{
        IS_BLOCKED: false,
        init() { },
        removeAdblockPopup() { },
    }`);
    a.inject(() => {
        "use strict";
        window.prebid = (i, f) => {
            f();
        };
        window.prebid.init = () => { };
    });
}
if (a.domCmp(["mywrestling.com.pl"])) {
    a.generic.FuckAdBlock("KillAdBlock", "killAdBlock");
}
if (a.domCmp(["socketloop.com"])) {
    a.readOnly("epmads_block", false);
    a.filter("setTimeout", a.matchMethod.string, "document.getElementById('content').innerHTML='';");
}
if (a.domCmp(["digitalpoint.com"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.DigitalPoint._General.blockMessage = () => { };
        });
    });
}
if (a.domCmp(["itv.com"])) {
    a.loopback((ignored, url) => {
        if (url.startsWith("https://tom.itv.com/itv/tserver/size=")) {
            return `
<?xml version="1.0" encoding="utf-8"?>
<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd">
</VAST>
`;
        } else {
            return null;
        }
    });
}
if (a.domCmp(["gry.wp.pl"])) {
    a.filter("atob");
}
if (a.domCmp(["giallozafferano.it"])) {
    a.filter("setTimeout", a.matchMethod.string, "adblock alert");
}
if (a.domCmp(["oddreaders.com"])) {
    a.onInsert((node) => {
        if (node.querySelector && node.querySelector("img[src='http://oddreaders.com/wp-content/uploads/2017/07/" +
            "A-Publisher-Approach-to-Adblock-Users.png'")) {
            node.remove();
        }
    });
}
if (a.domCmp(["vvvvid.it"])) {
    a.ready(() => {
        a.inject(() => {
            //Based on KAADIVVVV
            //License: https://github.com/Robotex/KAADIVVVV/blob/master/LICENSE
            "use strict";
            if (window.vvvvid) {
                const re = /var a=function.*};/;
                const data = `var a=function(){vvvvid.advPlayer=null,$(c.playerControlsClass).removeClass("ppad"),d()};`;
                //Patch properties
                window.vvvvid.cab4 = function (a, b) {
                    this.isAdBlockActive = false;
                    b && b(false);
                };
                const func = window.String(window.vvvvid.models.PlayerObj.prototype.startAdv);
                if (!re.test(func)) {
                    window.console.error("uBlock Protector failed to set up VVVVID uBlock Origin detector defuser!");
                }
                //That variable name feels like a trap
                //https://github.com/Robotex/KAADIVVVV/issues/16
                window.eval("window[mnsJHnyT] = window.vvvvid.models.PlayerObj.prototype.startAdv = " + func.replace(re, data));
            }
        });
    });
}
if (a.domCmp(["onet.pl", "komputerswiat.pl"])) {
    a.onInsert((node) => {
        if (node.innerText && node.innerText.includes("Prosimy, odblokuj wy\u015Bwietlanie reklam")) {
            node.remove();
        }
    });
}
if (a.domCmp(["viz.com"])) {
    a.css("#player_error { display:none; } #player { display:block; }");
}
if (a.domCmp(["swissadspaysfaucet.com"])) {
    a.readOnly("adBlockEnabled", false);
}
if (a.domCmp(["1tv.ru"])) {
    a.inject(() => {
        "use strict";
        //Stage 1
        const fakeAntiblock = {
            opts: {
                url: "",
                detectOnStart: false,
                indicatorName: "",
                resources: [],
            },
            readyState: "ready",
            detected: false,
            ready(f) {
                window.setTimeout(f, 10, false);
                return this;
            },
            detect(f) {
                window.setTimeout(f.cb, 10, false, this);
                return this
            },
        };
        window.EUMP = window.EUMP || {};
        window.Object.defineProperty(window.EUMP, "antiblock", {
            configurable: false,
            set() { },
            get() {
                return fakeAntiblock;
            },
        });
        //Stage 2
        const original = window.XMLHttpRequest;
        window.XMLHttpRequest = function (...args) {
            const wrapped = new (window.Function.prototype.bind.apply(original, args));
            const _open = wrapped.open;
            wrapped.open = function (...args) {
                if (args.length > 1 && args[1].startsWith("//v.adfox.ru/")) {
                    this.withCredentials = false;
                }
                return _open.apply(wrapped, args);
            };
            return wrapped;
        };
    });
}
if (a.domCmp(["cellmapper.net"])) {
    a.filter("alert", a.matchMethod.string, "Please disable ad-block");
}
if (a.domCmp(["tlz.de"])) {
    a.filter("addEventListener", a.matchMethod.string, `document.getElementById("ad-container")`,
        "window.document");
}
if (a.domCmp(["paksociety.com"])) {
    a.css("html, body { overflow:scroll; }");
}
if (a.domCmp(["rule34hentai.net"])) {
    //NSFW!
    a.inject(() => {
        "use strict";
        window.base_href = "";
    });
}
if (a.domCmp(["haber1903.com"])) {
    a.filter("setTimeout", a.matchMethod.string, "adblock");
    a.noAccess("EnableRightClick");
}
