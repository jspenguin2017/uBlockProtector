/**
 * Content rules for specific websites.
 */
"use strict";

if (a.domCmp(["catchcoin.pw", "irc-source.com", "dogecatch.website", "dashcatch.xyz"])) {
    a.noAccess("adBlockDetected");
}
if (a.domCmp(["mid-day.com", "happytrips.com", "jagranjunction.com"])) {
    a.readOnly("canRun", true);
}
if (a.domCmp(["voici.fr", "programme-tv.net"])) {
    a.bait("div", "#sas_script2");
}
if (a.domCmp(["badtv.it", "badtaste.it", "badgames.it", "badcomics.it"])) {
    a.cookie("adBlockChecked", "disattivo");
}
if (a.domCmp(["bknime.com", "debrido.com", "thepcspy.com"])) {
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
    // NSFW!
    a.readOnly("xRds", false);
    a.readOnly("cRAds", true);
}
if (a.domCmp(["vidlox.tv"])) {
    a.readOnly("adb", 0);
}
if (a.domCmp(["superfilm.pl"])) {
    a.readOnly("adblock", true);
    a.readOnly("adbp", true);
}
if (a.domCmp(["cwtv.com"])) {
    // Thanks to szymon1118
    a.readOnly("wallConfig", false);
    a.readOnly("CWTVIsAdBlocking", undefined);
}
if (a.domCmp(["theinquirer.net"])) {
    a.readOnly("_r3z", true);
}
if (a.domCmp(["tweaktown.com"])) {
    a.on("load", () => {
        a.css("html, body { overflow:scroll; }");
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
    // NSFW!
    a.readOnly("getAd", () => { });
    a.readOnly("getUtm", () => { });
}
if (a.domCmp(["hackintosh.zone", "elfqrin.com", "lne.es", "diariodemallorca.es", "artesacro.org"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.onload = null;
        });
    });
}
if (a.domCmp(["hackintosh.computer"])) {
    a.noAccess("google_jobrunner");
    a.readOnly("ai_adb_detected", (...args) => window.ai_adb_undetected(...args));
}
if (a.domCmp(["tvregionalna24.pl"])) {
    a.inject(() => {
        "use strict";
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
if (a.domCmp(["florydinvaslui.ro"])) {
    a.loopbackXHR((ignored, url) => {
        const re = /^https?:\/\/thinkdigitalro\.adocean\.pl\/ad\.xml/;
        if (re.test(url)) {
            return `<VAST version="2.0"></VAST>`;
        }
    });
}
if (a.domCmp(["itvn.pl", "itvnextra.pl", "kuchniaplus.pl", "miniminiplus.pl", "ttv.pl", "tvn.pl", "tvn24.pl",
    "tvn24bis.pl", "tvn7.pl", "tvnfabula.pl", "tvnstyle.pl", "tvnturbo.pl", "x-news.pl", "player.pl"])) {
    a.readOnly("isAdBlockEnabled", () => {
        "use strict";
        window.adBlockEnabled = false;
        return false;
    });
    a.loopbackXHR((ignored, url) => {
        const re = /^https?:\/\/tvn\.adocean\.pl\/ad\.xml/;
        if (re.test(url)) {
            return `<VAST version="2.0"></VAST>`;
        }
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
if (a.domCmp(["abczdrowie.pl", "autokrata.pl", "autokult.pl", "biztok.pl", "echirurgia.pl", "fotoblogia.pl", "gadzetomania.pl",
    "hotmoney.pl", "kafeteria.pl", "kafeteria.tv", "kardiolo.pl", "komediowo.pl", "komorkomania.pl", "money.pl", "o2.pl",
    "parenting.pl", "pudelek.pl", "pudelek.tv", "pudelekx.pl", "sfora.pl", "snobka.pl", "wawalove.pl", "wp.pl", "wp.tv",
    "wrzuta.pl"])) {
    a.loopbackXHR((ignored, url) => {
        const path = url.substring(url.lastIndexOf('/') + 1);
        if (path.startsWith("dmFkLnhtb")) { // vad.xml
            return `<?xml version="1.0" encoding="UTF-8"?>
<VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast2.xsd" version="2.0">
</VAST>`;
        }
    });
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
if (a.domCmp(["wired.it"])) {
    a.readOnly("adBlockedTextEmb", `""`);
    a.readOnly("videoStatus", `"show"`);
    $("html").rmClass("hideVideo").addClass("showVideo");
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
    // https://github.com/jspenguin2017/uBlockProtector/issues/109
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
    // NSFW!
    // https://github.com/jspenguin2017/uBlockProtector/issues/76
    a.noAccess("desktop_variants");
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
if (a.domCmp(["uol.com.br"])) {
    a.readOnly("detectingAdblocks", false);
    a.inject(() => {
        "use strict";
        window.UOLPD = {
            TagManager: {
                DfpAsync: {
                    getAdSize() { },
                },
            },
        };
    });
}
if (a.domCmp(["gamer.com.tw"])) {
    a.readOnly("AntiAd", null);
}
if (a.domCmp(["armorgames.com"])) {
    a.readOnly("ga_detect", null);
}
if (a.domCmp(["mangahost.com", "mangahost.org"])) {
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
                    val.adb.show = () => { };
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
if (a.domCmp(["infoua.biz"])) {
    a.filter("setTimeout", a.matchMethod.stringExact, "function (){b()}");
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
    // https://github.com/jspenguin2017/uBlockProtector/issues/241
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
if (a.domCmp(["diarioinformacion.com", "mallorcazeitung.es", "diaridegirona.cat", "diariodeibiza.es",
    "emporda.info", "farodevigo.es", "laopinioncoruna.es", "laopiniondemalaga.es", "laopiniondemurcia.es",
    "laopiniondezamora.es", "laprovincia.es", "levante-emv.com", "regio7.cat", "superdeporte.es"])) {
    a.readOnly("pr_okvalida", true);
}
if (a.domCmp(["cnbeta.com"])) {
    a.readOnly("JB", () => { });
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
        $("button#access").rmAttr("id").rmAttr("disabled").html("Continue To Video");
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
    // NSFW!
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
if (a.domCmp(["tvplay.skaties.lv", "play.tv3.lt", "tv3play.tv3.ee", "play.nova.bg"])) {
    a.replaceXHR(() => {
        if (url && url.includes("/adinfo?")) {
            this.addEventListener("readystatechange", () => {
                if (this.readyState === 4) {
                    try {
                        let payload = window.JSON.parse(this.responseText);
                        payload.ab_allowed = true;
                        replace(this, window.JSON.stringify(payload));
                    } catch (err) { }
                }
            });
        }
    });
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
    a.timewarp("setTimeout", a.matchMethod.string, "closeMyAd");
    a.noAccess("onclick", "window.document");
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
if (a.domCmp(["next-episode.net", "kingmaker.news", "gamespowerita.com", "todayidol.com", "bizled.co.in",
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
if (a.domCmp(["filmz.dk"])) {
    a.generic.FuckAdBlock("FAB", "fab");
}
if (a.domCmp(["2site.me", "albgoal.com", "bba1.us", "crackhex.ch", "mtzfile.gq", "shqip24.tv",
    "sport-show.fr", "vipflash.net"])) {
    a.css("#blockblockA { visibility:invisible; display:none; } #blockblockA td { visibility:invisible; " +
        "display:none; } #blockblockA td p { visibility:invisible; display:none; } #blockblockB " +
        "{ visibility:visible; display:block; }");
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
if (a.domCmp(["hanime.tv", "ah-me.com", "shortin.ga", "wolink.in"])) {
    // NSFW!
    // https://github.com/jspenguin2017/uBlockProtector/issues/76
    // https://github.com/reek/anti-adblock-killer/issues/3563
    a.inject(() => {
        "use strict";
        window.open = (url) => {
            window.location.href = url;
            throw new window.Error("[Nano] Blocked :: Popunder");
        };
    });
}
if (a.domCmp(["git.tc"])) {
    const magic = a.uid();
    addEventListener(magic, () => {
        a.close();
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
if (a.domCmp(["hanime.tv"])) {
    a.noAccess("confirm");
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
    // NSFW!
    // 29443kmq.video is the iframe of czechhq.net, other domains are part of Pornhub Network
    a.inject(() => {
        "use strict";
        window.open = (arg) => {
            if (arg.includes(window.document.domain)) {
                window.location.href = arg;
            }
        };
    });
    a.ready(() => {
        $(".tja, .footerAd").remove();
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
    a.readOnly("ads_enable", () => { });
}
if (a.domCmp(["ghame.ru"])) {
    a.cookie("adblock", "1");
}
if (a.domCmp(["thevideo.me", "fmovies.to", "fmovies.se", "fmovies.is"])) {
    // https://github.com/jspenguin2017/uBlockProtector/issues/86
    // https://github.com/jspenguin2017/uBlockProtector/issues/99
    a.inject(() => {
        "use strict";
        window.open = () => { };
    });
}
if (a.domCmp(["is.fi"])) {
    // https://github.com/jspenguin2017/uBlockProtector/issues/88
    a.readOnly("Sabdetect_load", false);
}
if (a.domCmp(["gearsuite.com"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/96
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
    //https://github.com/jspenguin2017/uBlockProtector/issues/106
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
    //https://github.com/jspenguin2017/uBlockProtector/issues/201
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
    //https://github.com/reek/anti-adblock-killer/issues/3377
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
if (a.domCmp(["shink.me"])) {
    if (location.pathname.startsWith("/go/")) {
        a.ready(() => {
            const link = document.getElementById("btn-main");
            const i = link.href.lastIndexOf("http");
            const url = link.href.substr(i);
            location.href = url;
        });
    }
}
if (a.domCmp(["gamezhero.com"])) {
    a.readOnly("ads", true);
    a.ready(() => {
        a.timewarp("setInterval", a.matchMethod.string, "function (){var _0x");
    });
}
if (a.domCmp(["freetvall.com"])) {
    a.readOnly("clickNS", () => { });
}
if (a.domCmp(["hotslogs.com"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/121
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
    //https://github.com/jspenguin2017/uBlockProtector/issues/124
    a.cookie("overlayMessage", "1");
    a.ready(() => {
        if ($("a.buttonBox.continue > span").startsWith("Continue to ").length) {
            location.reload();
        }
    });
}
if (a.domCmp(["dasolo.co", "dasolo.me"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/126
    a.inject(() => {
        "use strict";
        window.eval = () => { };
    });
    a.noAccess("adblockblock");
    a.noAccess("alert");
    a.bait("div", "#loveyou");
    //https://github.com/jspenguin2017/uBlockProtector/issues/280
    a.readOnly("nocontext", null);
    a.readOnly("mischandler", null);
    a.readOnly("disableselect", null);
    a.readOnly("disabletextselect", null);
    a.filter("addEventListener", a.matchMethod.stringExact, "contextmenu", "window.document");
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            window.document.oncontextmenu = null;
            window.document.onmousedown = null;
            window.document.onmouseup = null;
            window.document.onselectstart = null;
            window.setTimeout(() => {
                window.$("body").unbind("contextmenu");
                window.$("#id").unbind("contextmenu");
            }, 250);
        });
    });
}
if (a.domCmp(["titulky.com"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/128
    a.generic.FuckAdBlock("FADB", "fADB");
}
if (a.domCmp(["vaughnlive.tv"])) {
    a.readOnly("init", () => { });
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
    //These are NewsQuest related domains, put other domains that share this rule elsewhere
    //https://github.com/jspenguin2017/uBlockProtector/issues/137
    a.readOnly("_sp_", null);
}
if (a.domCmp(["nyheter24.se"])) {
    a.readOnly("_sp_", null);
}
if (a.domCmp(["aetv.com", "history.com", "mylifetime.com"])) {
    a.inject(() => {
        "use strict";
        const f = (e) => { e(false); };
        window._sp_ = {};
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
    //https://github.com/jspenguin2017/uBlockProtector/issues/125
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.videojs("video_1").videoJsResolutionSwitcher();
        });
    });
}
if (a.domCmp(["filmy.to", "histock.info"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/130
    a.inject(() => {
        "use strict";
        window.open = () => {
            return { closed: false };
        };
    });
}
if (a.domCmp(["multiup.org", "multiup.eu"])) {
    a.cookie("visit", "1");
    a.readOnly("hi", () => { });
    a.ready(() => {
        $(".alert").includes("Tired of ads ? Remove them").remove();
        $("#M130814ScriptRootC54591").includes("Loading...").remove();
    });
}
if (a.domCmp(["ally.sh", "al.ly", "croco.site"])) {
    a.inject(() => {
        "use strict";
        window.open = null;
    });
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
    //https://github.com/jspenguin2017/uBlockProtector/issues/141
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
        $(".download a.button").each((elem) => {
            elem.classList.remove("locked");
            if (elem.dataset.href) {
                elem.href = elem.dataset.href;
            }
        });
    });
}
if (a.domCmp(["netdna-storage.com"])) {
    //NSFW!
    a.noAccess("uid");
    a.noAccess("adcashMacros");
    a.ready(() => {
        $(".plan-footer-item").each((elem) => {
            if (elem.dataset.link) {
                elem.href = elem.dataset.link;
            }
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
if (a.domCmp(["nicematin.com", "alcpu.com"])) {
    a.noAccess("checkAds");
}
if (a.domCmp(["up-4ever.com"])) {
    a.filter("setTimeout", a.matchMethod.string, "$('#adblock_detected').val(1);");
    a.css("#hiddensection { display:block; }");
    a.ready(() => {
        $("#hiddensection").show();
        $("#hiddensection2").remove();
    });
}
if (a.domCmp(["exrapidleech.info"])) {
    a.readOnly("PopAds", `"this is a string"`);
    a.cookie("popcashpuCap", "1");
    a.cookie("popcashpu", "1");
    a.ready(() => {
        $(".alert-danger.lead").includes("block").remove();
        $("p").includes("Please disable ads block").remove();
        $("p").includes("Please turn on popup").remove();
    });
}
if (a.domCmp(["fastserver.me"])) {
    a.filter("alert", a.matchMethod.string, "Adblocker Detected!!");
}
if (a.domCmp(["canalplus.fr"])) {
    a.loopbackXHR((ignored, url) => {
        if (url.includes(".v.fwmrm.net/ad/")) {
            return `<vmap:VMAP version='1.0' xmlns:vmap='http://www.iab.net/vmap-1.0'></vmap:VMAP>`;
        }
    });
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
if (a.domCmp(["linternaute.com", "mtv.fi"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/224
    a.inject(() => {
        "use strict";
        let val;
        window.Object.defineProperty(window, "OO", {
            configurable: false,
            set(v) {
                val = v;
                try {
                    val.AAB = null;
                } catch (err) { }
            },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["vgtv.no"])) {
    a.inject(() => {
        "use strict";
        let callback;
        let val = {
            load(...args) {
                if (callback instanceof window.Function) {
                    callback(...args);
                }
            },
        };
        window.Object.defineProperty(val, "onSuccess", {
            configurable: false,
            set(v) {
                callback = v;
            },
            get() {
                return v;
            },
        });
        val = window.Object.freeze(val);

        window.OO = {};
        window.Object.defineProperty(window.OO, "AAB", {
            configurable: false,
            set() { },
            get() {
                return val;
            },
        });
    });
}
if (a.domCmp(["tv4play.se"])) {
    a.loopbackXHR((ignored, url) => {
        if (url.includes("svonm.com/global_config.json")) {
            return `{ "enabled": false }`;
        }
    });
}
if (a.domCmp(["new-skys.net"])) {
    a.noAccess("alert");
}
if (a.domCmp(["idlelivelink.blogspot.com", "animeforce.org"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.document.body.oncontextmenu = null;
            window.document.body.onkeydown = null;
            window.document.body.onmousedown = null;
        });
    });
}
if (a.domCmp(["shortin.ga"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.document.oncontextmenu = null;
            window.document.onselectstart = null;
            window.document.onmousedown = null;
        });
    });
}
if (a.domCmp(["cyberterminators.co", "wakfutemporada2subs.blogspot.com"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.document.oncontextmenu = null;
        });
    });
}
if (a.domCmp(["hackinformer.com"])) {
    a.ready(() => {
        $(".special-message-wrapper").includes("your ad blocker").remove();
    });
}
if (a.domCmp(["tg007.net"])) {
    a.bait("div", "#gads", true);
}
if (a.domCmp(["bild.de"])) {
    a.filter("querySelector", a.matchMethod.stringExact, "body", "window.document");
    a.noAccessExt("de.bild.cmsKonfig.a.b.a");
}
if (a.domCmp(["codepo8.github.io"]) && location.pathname.startsWith("/detecting-adblock/")) {
    a.css(".notblocked { display:block; } .blocked { display:none; }");
}
if (a.domCmp(["nowvideo.ec", "nowvideo.li", "ewingoset.info"])) {
    //https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/2
    //https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/5
    a.ready(() => {
        $("#cty").append(`<input type="hidden" name="ab" value="1">`);
    });
}
if (a.domCmp(["karibusana.org"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/253
    a.noAccess("bizpanda");
    a.css(".onp-locker-call { display:block; }");
}
if (a.domCmp(["lewat.id", "u2s.io"])) {
    //https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/4
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
if (a.domCmp(["null-24.com", "apkmod1.com"])) {
    a.timewarp("setInterval", a.matchMethod.stringExact, "1500");
}
if (a.domCmp(["null-24.com"])) {
    a.noAccess("no_menu_msg");
    a.noAccess("nocontext");
    a.ready(() => {
        setTimeout(() => {
            a.inject(() => {
                "use strict";
                window.jQuery("a.FLMBTN-Btn.FLMBTN-Size-MD.FLMBTN-Color-Red, a.download-link").unbind("click");
            });
        }, 250);
        const re = /https?:\/\/null-24\.com\/download\/\?link=([^&]+)/;
        let match;
        $(".custom-link").each((elem) => {
            if (match = re.exec(elem.href)) {
                elem.href = decodeURIComponent(match[1]);
            }
        });
    });
}
if (a.domCmp(["nulledvar.com"])) {
    a.ready(() => {
        setTimeout(() => {
            a.inject(() => {
                "use strict";
                window.jQuery("a.download-btn, a.alternative-btn, div.alternative ul li a").unbind("click");
            });
        }, 250);
    });
}
if (a.domCmp(["searchftps.net"])) {
    $("html").append(`<iframe width="336" height="280" style="display:none;"></iframe>`);
}
if (a.domCmp(["wakfutemporada2subs.blogspot.com"])) {
    a.noAccess("disabletext");
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
        $("#quick").attr("href", $("#normal").attr("href") + "&h=1")
            .attr("title", "Download this file with a faster download speed").css("cursor", "pointer");
    });
}
if (a.domCmp(["genbird.com"])) {
    a.filter("addEventListener", a.matchMethod.string, "Please disable your ad blocker.");
}
if (a.domCmp(["pg3dhacks.com"])) {
    a.ready(() => {
        const matcher = /Unlock.*Download/;
        $("button").each((button) => {
            if (button.innerText === "Download") {
                button.disabled = false;
            } else if (matcher.test(button.innerText)) {
                button.remove();
            }
        });
    });
}
if (a.domCmp(["adshort.co", "linksh.top", "adshorte.com", "coinb.ink", "gratisjuegos.co"])) {
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
        const err = new window.Error("[Nano] Blocked :: Property Access");
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
if (a.domCmp(["ohmymag.com", "ohmymag.com.br", "ohmymag.de", "gentside.com", "gentside.com.br",
    "maxisciences.com"])) {
    a.readOnly("adblockPopup", `{
        IS_BLOCKED: false,
        init() { },
        removeAdblockPopup() { },
    }`);
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
    a.loopbackXHR((ignored, url) => {
        if (url.startsWith("https://tom.itv.com/itv/tserver/size=")) {
            return `<?xml version="1.0" encoding="utf-8"?>
<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd">
</VAST>`;
        }
    });
}
if (a.domCmp(["di.fm", "jazzradio.com"])) {
    a.loopbackXHR((ignored, url) => {
        if (url.startsWith("https://pubads.g.doubleclick.net/")) {
            return `<?xml version="1.0" encoding="UTF-8"?>
<VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0">
</VAST>`;
        }
    });
}
if (a.domCmp(["stream.nbcsports.com"])) {
    a.loopbackXHR((ignored, url) => {
        if (url.includes(".v.fwmrm.net/ad/g/1")) {
            return `<VAST version='3.0' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:noNamespaceSchemaLocation='vast.xsd'>
</VAST>`;
        }
    });
}
if (a.domCmp(["gry.wp.pl", "maketecheasier.com"])) {
    a.filter("atob");
}
if (a.domCmp(["giallozafferano.it"])) {
    a.filter("setTimeout", a.matchMethod.string, "adblock alert");
}
if (a.domCmp(["oddreaders.com"])) {
    a.css(".onp-sl-blur-area { filter:none; }");
    a.onInsert((node) => {
        if (node.querySelector && node.querySelector("img[src='http://oddreaders.com/wp-content/uploads/2017/07/" +
            "A-Publisher-Approach-to-Adblock-Users.png'")) {
            node.remove();
        }
    });
}
if (a.domCmp(["vod.pl"])) {
    a.onInsert((node) => {
        if (node.tagName !== "SCRIPT" && node.innerText && node.innerText.includes("Prosimy, odblokuj wy\u015Bwietlanie reklam")) {
            node.remove();
        }
    });
}
if (a.domCmp(["viz.com"])) {
    a.readOnly("show_dfp_preroll", false);
}
if (a.domCmp(["1tv.ru"])) {
    a.inject(() => {
        "use strict";
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
                return this;
            },
        };
        window.EUMP = {};
        window.Object.defineProperty(window.EUMP, "antiblock", {
            configurable: false,
            set() { },
            get() {
                return fakeAntiblock;
            },
        });

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
if (a.domCmp(["gamejolt.net"])) {
    a.onInsert((node) => {
        if (node && node.innerHTML && node.innerHTML.includes("View ad.")) {
            node.querySelector("h3").remove();
            node.querySelector("p").remove();
        }
    });
}
if (a.domCmp(["dilidili.wang"])) {
    a.filter("addEventListener", a.matchMethod.stringExact, "DOMNodeInserted", "window.document");
}
if (a.domCmp(["dilidili.wang", "reevown.com"])) {
    a.antiCollapse("innerHTML", (elem) => elem === window.document.body);
}
if (a.domCmp(["overclockers.ru"])) {
    a.antiCollapse("innerHTML", (ignored, val) => val.includes("images/hungry.png"));
}
if (a.domCmp(["gamekit.com"])) {
    a.filter("setInterval", a.matchMethod.string, "a-d-block-popup");
}
if (a.domCmp(["linkshrink.net"])) {
    //Based on AdsBypasser
    //License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
    const matcher = /revC\("([^"]+)"\)/;
    a.ready(() => {
        let match;
        const scripts = document.querySelectorAll("script");
        //Start from end as the script tend to be at the end
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (match = matcher.exec(scripts[i].textContent)) {
                location.pathname = "/" + atob(match[1]);
                break;
            }
        }
    });
}
if (a.domCmp(["playrust.io"])) {
    a.onInsert((node) => {
        if (node.textContent && node.textContent.includes("Advertising enables us")) {
            node.remove();
        }
    });
}
if (a.domCmp(["videacesky.cz"])) {
    a.filter("setTimeout", a.matchMethod.string, "/dialog/adblock/");
}
if (a.domCmp(["wunderground.com"])) {
    a.readOnly("noAdBlocker", true);
}
if (a.domCmp(["explosm.net"])) {
    a.readOnly("showads", true);
}
if (a.domCmp(["playok.com", "kurnik.pl"])) {
    a.filter("getElementById", a.matchMethod.stringExact, "abp", "window.document");
}
if (a.domCmp(["gp.se", "bohuslaningen.se", "hallandsposten.se", "hn.se", "stromstadstidning.se", "ttela.se"])) {
    a.inject(() => {
        "use strict";
        window.scrollTo = () => { };
        window.burtApi = {
            stopTracking() { },
            connect() { },
            annotate() { },
            startTracking() { },
            trackById() {
                return {
                    connect() { },
                };
            },
        };
        window._adform = {
            readTags() { },
        };
    });
}
if (a.domCmp(["kbb.com"])) {
    a.inject(() => {
        "use strict";
        const v = window.Object.freeze({
            init() { },
            start() { },
        });
        window.KBB = {};
        window.Object.defineProperty(window.KBB, "Abb", {
            configurable: false,
            set() { },
            get() {
                return v;
            },
        });
    });
}
if (a.domCmp(["booogle.net", "nsspot.net"])) {
    a.readOnly("gadb", false);
}
if (a.domCmp(["samehadaku.net"])) {
    a.readOnly("$tieE3", true);
}
if (a.domCmp(["docer.pl"])) {
    a.readOnly("ads_unblocked", true);
    a.ready(() => {
        $("#square-1").css("width", "1px");
    });
}
if (a.domCmp(["telecinco.es", "cuatro.com", "divinity.es", "factoriadeficcion.com", "energytv.es", "bemad.es",
    "eltiempohoy.es", "mtmad.es"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/448
    a.inject(() => {
        "use strict";
        const err = new TypeError("Failed to execute 'getElementById' on 'Document': 'adsFooter' is not a valid ID.");
        const original = window.document.getElementById;
        window.document.getElementById = (id, ...rest) => {
            if (id === "adsFooter") {
                throw err;
            } else {
                return original.call(window.document, id, ...rest);
            }
        }
    });
}
if (a.domCmp(["webcafe.bg"])) {
    a.readOnly("bDetect", false);
}
if (a.domCmp(["aternos.org"])) {
    a.filter("setTimeout", a.matchMethod.string, ".ad-detect");
}
if (a.domCmp(["adageindia.in", "bombaytimes.com", "businessinsider.in", "gizmodo.in", "iamgujarat.com", "idiva.com",
    "in.techradar.com", "indiatimes.com", "timesofindia.com", "lifehacker.co.in", "mensxp.com", "samayam.com",
    "gadgetsnow.com"])) {
    //https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/8
    a.inject(() => {
        "use strict";
        const magic = "a" + window.Math.random().toString(36).substring(2);
        const reScript = /typeof otab == 'function'/;
        const reComment = /\d{5,} \d{1,2}/;
        const getter = () => {
            let script;
            {
                let temp = [...window.document.querySelectorAll(`script:not([src]):not([${magic}])`)];
                if (window.document.currentScript && !window.document.currentScript.hasAttribute(magic)) {
                    temp.unshift(window.document.currentScript);
                }
                if (!temp.length) {
                    return true;
                }
                for (let i = 0; i < temp.length; i++) {
                    temp[i].setAttribute(magic, 1);
                    if (reScript.test(temp[i].textContent)) {
                        script = temp[i];
                        break;
                    }
                }
            }
            if (!script) {
                return true;
            }
            {
                const previous = script.previousSibling;
                let temp = previous;
                while (temp = temp.previousSibling) {
                    if (temp.nodeType === window.Node.COMMENT_NODE && reComment.test(temp.data)) {
                        previous.style.setProperty("display", "none", "important");
                        return false;
                    }
                }
            }
        };
        window.Object.defineProperty(window, "trev", {
            configurable: false,
            set() { },
            get() {
                let r;
                let i = 0;
                do {
                    try {
                        r = getter();
                    } catch (err) { }
                } while (!r && i++ < 100);
                return null;
            },
        });
        window.addEventListener("load", () => {
            void window.trev;
        });
    });

    let isInBackground = false;
    const reStart = /^\/[a-z_]+\.cms/;
    const reEnd = /^ \d{5,} \d{1,2} $/;
    const adsHidder = () => {
        if (isInBackground || !document.body) {
            return;
        }
        let iterator = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
        let comment;
        while (comment = iterator.nextNode()) {
            if (reStart.test(comment.data)) {
                let toHide = [];
                let previous = comment;
                while (previous = previous.previousSibling) {
                    if (previous.nodeType === Node.COMMENT_NODE && reEnd.test(previous.data)) {
                        if (toHide.length < 15) {
                            for (let i = 0; i < toHide.length; i++) {
                                try {
                                    toHide[i].style.setProperty("display", "none", "important");
                                } catch (err) { }
                            }
                        }
                        break;
                    }
                    toHide.push(previous);
                }
            }
        }
    };
    setInterval(adsHidder, 1000);
    //@pragma-if-debug
    //a.setBenchmarkedInterval(adsHidder, 1000);
    //@pragma-end-if
    a.on("focus", () => { isInBackground = false; });
    a.on("blur", () => { isInBackground = true; });
}
if (a.domCmp(["uptostream.com"])) {
    a.readOnly("a", undefined);
}
if (a.domInc(["10co"])) {
    a.bait("div", "#myTestAd", true);
    a.timewarp("setInterval", a.matchMethod.stringExact, "1000");
}
if (a.domCmp(["moviemakeronline.com"])) {
    a.readOnly("abNoticeShowed", true);
}
if (a.domCmp(["nbcsports.com", "knowyourmeme.com"])) {
    a.readOnly("adblockDetect", () => { });
}
if (a.domCmp(["kiss.com.tw"])) {
    a.bait("div", "#ads");
}
if (a.domCmp(["identi.li"])) {
    a.css("div[id^='hidden_'] { display:block; }");
    a.cookie("BetterJsPop0", "1");
    a.cookie("BetterJsPop1", "1");
    a.ready(() => {
        a.inject(() => {
            "use strict";
            const nbsp = /&nbsp;/g;
            const blocks = window.document.querySelectorAll(".info_bbc");
            for (let i = 0; i < blocks.length; i++) {
                if (!blocks[i].firstChild.tagName) {
                    try {
                        const links = window.GibberishAES.dec(blocks[i].textContent, window.hash);
                        blocks[i].innerHTML = window.linkify(links.replace(nbsp, " "));
                        blocks[i].style.display = "block";
                        blocks[i].parentNode.previousSibling.remove();
                    } catch (err) { }
                }
            }
            if (window.$) {
                window.$("div #decrypt.myjdownloader").unbind("click").click(function () {
                    window._decrypt.fnID = "jdownloader";
                    window._decrypt.fnURL = this.getAttribute("href");
                    window._decrypt.objeto = null;
                    window._decrypt.open();
                });
                window.$("button.link-d").unbind("click").click(function () {
                    let d = this.dataset.link;
                    while (!d.includes("%")) {
                        d = window.atob(d);
                    }
                    d = window.decodeURIComponent(d);
                    window.open(d);
                });
            }
        });
    });
}
if (a.domCmp(["peliculasmega.info"])) {
    a.css("a[class*='hidden_'] { display:block; }");
}
if (a.domCmp(["navegacom.com"])) {
    a.css(".series-indeti { display:block; }");
}
if (a.domCmp(["acortar.net", "acortalo.net", "vellenger.com", "infobae.net"])) {
    a.on("load", () => {
        a.inject(() => {
            "use strict";
            let btn = window.document.querySelector(".linkhidder");
            if (btn) {
                const fallback = btn.onclick || (() => { });
                btn.onclick = () => {
                    try {
                        window.location.href = window.href[window.href.length - 1];
                    } catch (err) {
                        fallback();
                    }
                };
            }
        });
    });
}
if (a.domCmp(["egobits.com"])) {
    a.noAccess("detector_launch");
}
if (a.domCmp(["tvnow.de"])) {
    a.replaceXHR(() => {
        if (url.includes("/v3/movies/")) {
            this.addEventListener("readystatechange", () => {
                if (this.readyState === 4) {
                    try {
                        let payload = window.JSON.parse(this.responseText);
                        payload.ignoreAd = true;
                        payload.noad = true;
                        payload.geoblocked = false;
                        payload.free = true;
                        payload.blockadeText = "0";
                        payload.format.enableAd = false;
                        payload.format.hasFreeEpisodes = true;
                        payload.format.isGeoBlocked = false;
                        replace(this, window.JSON.stringify(payload));
                    } catch (err) { }
                }
            });
        }
    });
}
if (a.domCmp(["qoshe.com"])) {
    a.readOnly("adBlockAlertShown", true);
    a.filter("setTimeout", a.matchMethod.string, "adBlockFunction()");
}
if (a.domCmp(["aargauerzeitung.ch", "badenertagblatt.ch", "basellandschaftlichezeitung.ch", "bzbasel.ch",
    "limmattalerzeitung.ch", "solothurnerzeitung.ch", "grenchnertagblatt.ch", "oltnertagblatt.ch"])) {
    a.filter("setTimeout", a.matchMethod.string, "[native code]");
}
if (a.domCmp(["mangacanblog.com"])) {
    a.readOnly("adblock", 1);
}
if (a.domCmp(["portel.pl"])) {
    a.readOnly("blokowanko", false);
}
if (a.domCmp(["mwpaste.com"])) {
    a.css("#downbloq { display:none; } .hidebloq { display:block; }");
    a.ready(() => {
        a.inject(() => {
            "use strict";
            const blocks = window.document.querySelectorAll(".hidebloq");
            for (let i = 0; i < blocks.length; i++) {
                blocks[i].innerHTML = window.atob(blocks[i].textContent);
            }
        });
    });
}
if (a.domCmp(["clasicotas.org"])) {
    a.filter("addEventListener", a.matchMethod.stringExact, "mouseup", "window.document");
}
if (a.domCmp(["pseudo-flaw.net"])) {
    a.readOnly("stopBlock", () => { });
}
if (a.domCmp(["bildungsspender.de"])) {
    a.readOnly("werbeblocker", true);
}
if (a.domCmp(["sledujufilmy.cz"])) {
    a.readOnly("ads_ok", true);
}
if (a.domCmp(["vsports.pt"])) {
    a.readOnly("adblockDetecter", true);
}
if (a.domCmp(["gpro.net"])) {
    a.ready(() => {
        $("#blockblockA").parent().parent().remove();
    });
}
if (a.domCmp(["shutterdowner.com"])) {
    a.bait("div", "#zagshutter");
}
if (a.domCmp(["ur.ly", "urly.mobi"])) {
    const re = /\?ref=.*/;
    a.onInsert((node) => {
        if (node.id === "skip_button1") {
            stop();
            location.href = node.href.replace(re, "?href=https://google.com/");
        }
    });
}
if (a.domCmp(["falter.at"])) {
    a.noAccess("showFalterGif");
}
if (a.domCmp(["wetter3.de"])) {
    a.readOnly("karte1", 18);
}
if (a.domCmp(["tuba.pl"])) {
    a.readOnly("adsOk", true);
}
if (a.domCmp(["haaretz.com", "themarker.com"])) {
    a.noAccess("AdBlockUtil");
}
if (a.domCmp(["nontonanime.org"])) {
    a.readOnly("ADBLOCK", true);
}
if (a.domCmp(["graphiq-stories.graphiq.com"])) {
    a.loopbackXHR((ignored, url) => {
        if (url.startsWith("/ad?")) {
            return "window.FTBAds.blocking = false;";
        }
    });
}
if (a.domCmp(["viasatsport.se", "viasport.fi", "tv3sport.dk", "viasport.no"])) {
    a.inject(() => {
        "use strict";
        const observer = new window.MutationObserver(() => {
            const videos = window.document.querySelectorAll("video.blurred");
            for (let i = 0; i < videos.length; i++) {
                videos[i].classList.remove("blurred");
            }
            const buttons = window.document.querySelectorAll(".vjs-overlay-message-close-button");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].click();
            }
            if (window.videoPlayers instanceof window.Object) {
                for (let key in window.videoPlayers) {
                    try {
                        window.videoPlayers[key]._player.trigger("hideOverlayBlur");
                    } catch (err) { }
                }
            }
        });
        observer.observe(window.document, {
            childList: true,
            subtree: true,
        });
    });
}
if (a.domCmp(["gntai.xyz"])) {
    a.readOnly("showAds", true);
}
if (a.domCmp(["wifihack.me"])) {
    a.noAccess("AdBlocked");
}
if (a.domCmp(["flashx.tv", "flashx.to"])) {
    a.filter("addEventListener", a.matchMethod.stringExact, "keydown", "window.document");
}
if (a.domCmp(["wowtoken.info"])) {
    const re = /fail\(\);/g;
    a.beforeScript((script) => {
        if (script.src && script.src.includes("/js/main.js")) {
            $.request({
                method: "GET",
                url: script.src,
            }, (data) => {
                a.inject(data.replace(re, "true;"), true);
            }, () => {
                console.error("[Nano] Failed :: Patch Main Script");
            });
            script.remove();
        }
    });
}
if (a.domCmp(["arenavision.us"])) {
    a.noAccess("H7WWWW");
    a.noAccess("adbClick");
}
if (a.domCmp(["cbs.com"])) {
    //https://github.com/jspenguin2017/uBlockProtector/issues/578
    if (!a.cookie("first_page_today") && !sessionStorage.getItem("_first_page_today_fallback")) {
        sessionStorage.setItem("_first_page_today_fallback", true);
        a.ready(() => {
            location.reload();
        });
    }
}
if (a.domCmp(["solowrestling.com"])) {
    a.readOnly("bloq", 1);
}
if (a.domCmp(["timesofindia.indiatimes.com"])) {
    a.ready(() => {
        setTimeout(() => {
            if (location.href.includes("interstitial")) {
                a.cookie("nsIstial_Cook", "1");
                a.cookie("ns", "1");
                location.href = "https://timesofindia.indiatimes.com/";
            }
        }, 300);
    });
}
if (a.domCmp(["zimuku.net"])) {
    a.readOnly("isAdEnabled", true);
}
if (a.domCmp(["cdn-surfline.com"])) {
    a.filter("setTimeout", a.matchMethod.string, "ad blocker");
    a.ready(() => {
        a.inject(() => {
            "use strict";
            window.doFallBackonAdError = () => { };
        });
    });
}
if (a.domCmp(["player.radiojazzfm.ru"])) {
    a.bait("div", "#tester", true);
}
if (a.domCmp(["hackingwithphp.com"])) {
    a.readOnly("areAdsDisplayed", true);
}
if (a.domCmp(["muyinteresante.es"])) {
    a.readOnly("ads", true);
}
if (a.domCmp(["zdnet.de"])) {
    a.readOnly("can_i_run_ads", true);
}
if (a.domCmp(["linkneverdie.com"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            const _removeChild = window.document.body.removeChild;
            window.document.body.removeChild = function (child, ...rest) {
                if (child.id !== "wrapper") {
                    _removeChild.call(this, child, ...rest);
                }
            };
        });
    });
}
if (a.domCmp(["megawrzuta.pl"])) {
    a.cookie("slickModal-1", "true");
}
if (a.domCmp(["4downfiles.org"])) {
    a.ready(() => {
        a.inject(() => {
            "use strict";
            const link = window.document.querySelector("#direct_link > a");
            if (link && link.href) {
                const i = link.href.indexOf("=");
                if (i > -1) {
                    link.href = link.href.substring(i + 1);
                }
            }
        });
    });
}
if (a.domCmp(["strefadb.pl"])) {
    a.inject(() => {
        "use strict";
        let counter = 0;
        window.Object.defineProperty(window, "FuckAdBlock", {
            configurable: false,
            set() { },
            get() {
                counter++;
                if (counter === 2) {
                    return true;
                } else {
                    return undefined;
                }
            },
        });
    });
}
if (a.domCmp(["tune.pk"])) {
    a.replaceXHR(() => {
        if (url.startsWith("https://tune.pk/api_public/playerConfigs/?")) {
            this.addEventListener("readystatechange", () => {
                if (this.readyState === 4) {
                    try {
                        let payload = window.JSON.parse(this.responseText);
                        delete payload.data.plugins.overlayAd;
                        delete payload.data.plugins.annoy;
                        replace(this, window.JSON.stringify(payload));
                    } catch (err) { }
                }
            });
        }
    });
}
if (a.domCmp(["ultrahorny.com"])) {
    //NSFW!
    a.noAccess("decodeURIComponent");
}
if (a.domCmp(["uplod.cc"])) {
    a.bait("div", "#bannerad", true);
}
if (a.domCmp(["pilot.wp.pl"])) {
    a.readOnly("PWA_adbd", 0);
}
if (a.domCmp(["siliconinvestor.com"])) {
    a.bait("div", "#tester", true);
}
if (a.domCmp(["jacquieetmicheltv.net"])) {
    a.ready(() => {
        $("#disclaimerOkButton").on("click", (e) => {
            $(".disclaimer-wrapper").remove();
            e.preventDefault();
            e.stopPropagation();
        });
    });
}
if (a.domCmp(["ultimedia.com"])) {
    a.readOnly("_um_ads_allowed", 1);
}
if (a.domCmp(["nova.cz", "popcornflix.com"])) {
    a.inject(() => {
        "use strict";
        const String = window.String.bind(window);
        const _Promise = window.Promise;
        window.Promise = class extends _Promise {
            constructor(func, ...rest) {
                if (String(func).includes("adblock")) {
                    func = (resolve) => { resolve(); };
                }
                super(func, ...rest);
            }
        };
    });
}
if (a.domCmp(["pornovoisines.com"])) {
    a.noAccess("isAdBlocked");
    a.noAccess("getPubUrl2");
    a.ready(() => {
        $("#disclaimerOkButton").attr("target", "_self");
    });
}
if (a.domCmp(["letribunaldunet.fr"])) {
    a.noAccess("adback");
}
if (a.domCmp(["filmweb.pl"])) {
    a.noAccessExt("document.onreadystatechange");
}
if (a.domCmp(["playstation.com"])) {
    a.readOnly("adFileLoaded", true);
}
if (a.domCmp(["animezone.pl", "egy.best", "newpct.com"])) {
    a.filter("eval", a.matchMethod.string, "googlesyndication");
}
if (a.domCmp(["animezone.pl"])) {
    a.noAccess("o6c6e");
}
if (a.domCmp(["egy.best"])) {
    a.generic.FuckAdBlock("_AdBlock", "_AdBlock_init");
    a.noAccess("V4d4P");
}
if (a.domCmp(["newpct.com"])) {
    a.noAccess("Y9z5A");
}
if (a.domCmp(["player.radioloyalty.com"])) {
    a.beforeScript((script) => {
        if (script.textContent &&
            script.textContent.includes("mainView = new MainView({model: playerManager});")) {
            script.textContent = script.textContent.replace("mainView", "window._mainView = mainView");
            setTimeout(() => {
                a.inject(() => {
                    "use strict";
                    window.setTimeout(() => {
                        window.$("#videoPlayerModal").modal("hide");
                    }, 1000);
                    window.Object.defineProperty(window._mainView.player.player.attributes, "playingAd", {
                        configurable: false,
                        set() { },
                        get() {
                            return false;
                        },
                    });
                });
            }, 100);
        }
    });
}
if (a.domCmp(["insuranceloansonline.com"])) {
    a.css("#openPubli { display:none; }")
    a.ready(() => {
        a.inject(() => {
            "use strict";
            const isLink = /^https?:\/\//;
            for (let key in window) {
                if (key.length === 1 && isLink.test(window[key])) {
                    window.location.href = window[key];
                    break;
                }
            }
        });
    });
}
if (a.domCmp(["letras.mus.br"])) {
    a.readOnly("canAds", true);
}
if (a.domCmp(["ostrzeszowinfo.pl", "infostrow.pl"])) {
    a.readOnly("canRunAds", undefined);
}
if (a.domCmp(["wurstclient.net"])) {
    a.ready(() => {
        $(".adsbygoogle").remove();
    });
}
if (a.domCmp(["version2.dk"])) {
    a.bait("div", "#banner", true);
}
if (a.domCmp(["adyou.me"])) {
    a.filter("eval", a.matchMethod.RegExp, /acPrefetch|LEGAL NOTICE/);
}
if (a.domCmp(["crockolinks.com"])) {
    a.noAccess("test");
}
if (a.domCmp(["srt.am", "tny.ec"])) {
    a.noAccess("acPrefetch");
}
if (a.domCmp(["uflash.tv"])) {
    a.inject(() => {
        "use strict";
        const codeExtractor = /if\(h&&check3\)({[^}]+})/;
        let payload;
        const _eval = window.eval;
        window.eval = (code, ...rest) => {
            const match = codeExtractor.exec(code);
            if (match) {
                payload = match[1];
            } else {
                _eval.call(window, code, ...rest);
            }
        };
        window.addEventListener("load", () => {
            if (payload) {
                _eval.call(window, payload);
            }
        });
    });
}
if (a.domCmp(["hdpass.net"])) {
    //https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/1
    a.inject(() => {
        "use strict";
        const expandClickArea = () => {
            const btn = window.document.querySelector(".wrapSpot");
            if (btn) {
                btn.addEventListener("click", () => {
                    const realBtn = window.document.getElementById("closeSpot");
                    if (realBtn) {
                        realBtn.click();
                    }
                });
            }
        };
        window.addEventListener("DOMContentLoaded", expandClickArea);
    });
}
if (a.domCmp(["moondash.co.in"])) {
    a.bait("div", "#claimAd");
}
if (a.domCmp(["videolab.io"])) {
    a.inject(() => {
        "use strict";
        window.open = () => {
            return {
                focus() { },
            };
        };
    });
}
if (a.domCmp(["3dzone.link"])) {
    a.ready(() => {
        $("a").each((e) => {
            if (
                e.textContent.trim() === "" ||
                e.querySelector(":scope > img[src^='https://authedmine.com/']")
            ) {
                e.textContent = e.href;
            }
        });
    });
}
if (a.domCmp(["washingtonpost.com"])) {
    a.ready(() => {
        $("body").attr("data-no_ads", "true");
    });
}

// Nano Adblocker does not support UserCSS because it breaks DOM Inspector,
// duct tape it here
// TODO - Convert to filter (or remove if already in uAssets) when minimum
// required version of Chrome can handle removing injected stylesheet
if (a.domCmp(["hdblog.it", "hdmotori.it"])) {
    a.css("body { background:none; overflow:auto; }");
}
if (a.domCmp(["telegraph.co.uk"])) {
    a.css(".adblocker-message { display:none; }");
}
if (a.domCmp(["go4up.com"])) {
    a.inject(() => {
        "use strict";
        const _getElementById = window.document.getElementById;
        window.document.getElementById = function (elem, ...rest) {
            if (elem === "dlbuttonimg") {
                return window.document.createElement("div");
            }
            return _getElementById.call(this, elem, ...rest);
        };
    });
}

// Partially working
if (a.domCmp(["hulu.com"])) {
    const performClick = (btn) => {
        if (btn.classList.contains("nano-defender-clicked")) {
            return;
        }

        btn.classList.add("nano-defender-clicked");
        btn.click();

        // TODO - DEBUG ONLY
        console.warn("clicked", btn);
    };
    a.onInsert((node) => {
        if (node.querySelector) {
            if (node.classList.contains("ad-selector-option") || node.classList.contains("trailer-selector-watch-trailer-button")) {
                setTimeout(performClick, 1000, node);
            } else {
                const btn = node.querySelector(".ad-selector-option, .trailer-selector-watch-trailer-button");
                if (btn) {
                    setTimeout(performClick, 1000, btn);
                }
            }
        }
    });
}
