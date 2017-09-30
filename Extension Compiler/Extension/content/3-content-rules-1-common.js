//Content rules initialization and common content rules
//Solutions from Anti-Adblock Killer (originally by Reek) are modified to fit my Core API
//Anti-Adblock Killer Repository (contains original source code and license): https://github.com/reek/anti-adblock-killer
"use strict";

//Initialization
{
    a.init();
    //White list
    const genericWhitelist1 = [
        //Local network
        "localhost", "127.0.0.1",
        //Google
        "google.it.ao", "google.ne.jp", "google.off.ai", "youtu.be", "youtube.com",
        //Baidu
        "baidu.com",
        //Wikipedia
        "wikipedia.org",
        //PayPal
        "paypal.com", "paypal.me",
        //JavaScript playgrounds
        "stackoverflow.com", "ask.com", "w3schools.com", "jsbin.com", "jsfiddle.net", "plnkr.co",
        "preloaders.net",
        //Social sites (for performance)
        "facebook.com", "messenger.com", "twitter.com", "instagram.com", "reddit.com", "linkedin.com",
        "pinterest.com", "bufferapp.com", "chatango.com",
        //Media sites (for performance)
        "calm.com", "vimeo.com", "yandex.ru", "xemvtv.net",
        //Image beds (for performance)
        "imgur.com", "imgbox.com", "flickr.com",
        //Handled by specific rules
        "anandabazar.com", "o2.pl", "vod.pl", "viasatsport.se", "viasport.fi", "tv3sport.dk",
        "viasport.no",
        //False positives
        "techradar.com", "imdb.com", "babbel.com",
    ];
    const genericWhitelist2 = [
        //Local network
        "192.168.0", "192.168.1",
        //Google
        "google", "google.co", "google.com",
        //Yahoo
        "yahoo",
        //Stores
        "amazon", "ebay",
    ];
    //Apply generic solutions
    if (a.domCmp(genericWhitelist1, true) || a.domInc(genericWhitelist2, true)) {
        console.log("This domain is excluded from all generically applied solutions.");
    } else {
        //Basic
        if (a.domCmp([], true)) {
            console.log("This domain is excluded from common generic solutions.");
        } else {
            a.generic();
        }
        //Adfly
        if (a.domCmp([], true)) {
            console.log("This domain is excluded from Adfly bypasser.");
        } else {
            a.generic.Adfly();
        }
        //NoAdBlock
        if (a.domCmp([], true)) {
            console.log("This domain is excluded from NoAdBlock defuser.");
        } else {
            a.generic.NoAdBlock();
        }
    }
    //ads.js v2
    if (a.domCmp(["gamersclub.com.br", "uploadboy.com", "vidoza.net", "videohelp.com", "zeiz.me",
        "passionea300allora.it", "memurlar.net", "palemoon.org", "stocks.cafe", "listamais.com.br",
        "acquavivalive.it", "palolive.it", "molfettalive.it", "sledujserialy.sk", "warforum.cz",
        "lolskinlistgenerator.com", "beinsports.com"])) {
        a.generic.adsjsV2();
    }
    //uBO-Extra white list
    if (a.domCmp([], true)) {
        a.uBOExtraExcluded = true;
        console.log("uBlock Protector excluded this domain from uBO-Extra.");
    }
}

//Candidate For Generic Rules
if (a.domCmp(["mywrestling.com.pl", "zxctunnel.com", "tsa-algerie.com", "ilpuntotecnicoeadsl.com",
    "kmspico.esy.es", "orgasmnaut.com", "mytunnel.info"])) {
    a.generic.FuckAdBlock("KillAdBlock", "killAdBlock");
}

//a.filter
if (a.domCmp(["usapoliticstoday.com", "vidlox.tv", "exrapidleech.info", "urle.co", "gsmarena.com",
    "darmowe-pornosy.pl", "salon.com", "linx.cloud", "flashx.tv", "flashx.to"])) {
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
    "myp2p.ws", "myp2p.com", "atdhe.ru", "atdhe.se", "atdhe.bz", "atdhe.top", "u2s.io", "linclik.com",
    "iiv.pl", "linkkawy.com", "zlshorte.net", "ur.ly", "oload.stream", "sawlive.tv"])) {
    a.filter("open");
}
if (a.domCmp(["drivearabia.com", "putlocker.com", "doatoolsita.altervista.org", "sockshare.com",
    "free-movie-home.com", "pc.online143.com", "kooora.com", "str3amtv.co.nr", "str3amtv.altervista.org",
    "str3am.altervista.org", "filecom.net", "pipocas.tv", "generatupremium.biz", "mega-debrid.eu",
    "premiumst0re.blogspot.com", "dl-protect.com", "newsinlevels.com", "vipracing.biz", "businesstoday.in"])) {
    a.filter("alert");
}

//a.timewarp
if (a.domCmp(["apkmirror.com", "freepdf-books.com", "bc.vc", "themeslide.com", "linkdrop.net",
    "l2s.io", "ally.sh", "al.ly", "croco.site", "urle.co", "ouo.io", "idlelivelink.blogspot.com",
    "lewat.id", "cutwin.com", "cut-urls.com", "adbull.me", "xess.pro", "clik.pw", "admove.co",
    "adshort.co", "linksh.top", "adshorte.com", "coinb.ink", "123link.top", "fas.li", "zeiz.me",
    "u2s.io", "linclik.com", "xurl.us", "adbilty.me", "cpmlink.net", "gsurl.in", "linkhits.us",
    "coshurl.co", "leechall.com", "gratisjuegos.co", "zonadescarga.info", "firstone.tv", "shortzero.com",
    "veneapp.com", "shink.in", "iiv.pl", "uskip.me", "link-cash.com", "ouo.press", "coinlink.us",
    "tmearn.com", "url.gem-flash.com", "cuturlink.com", "linkhits.net", "shorteurl.com", "bit-url.com",
    "leenlink.com", "linkkawy.com", "cut-egy.ml", "igram.im", "adlinkme.com", "oke.io", "wolink.in",
    "bilink.xyz", "git.tc", "zlshorte.net", "ur.ly", "shink.me", "oload.stream"])) {
    a.timewarp("setInterval", a.matchMethod.stringExact, "1000");
}
if (a.domCmp(["katfile.com", "goldescargas.com", "globalbesthosting.com", "userupload.net",
    "jzrputtbut.net"])) {
    a.timewarp("setTimeout", a.matchMethod.stringExact, "1000");
}

//a.readOnly
if (a.domCmp(["jansatta.com", "financialexpress.com", "indianexpress.com", "shink.in", "uskip.me",
    "shink.me"])) {
    a.readOnly("RunAds", true);
}
if (a.domCmp(["jagranjunction.com", "nekopoi.bid", "catcatyfaucet.xyz"])) {
    a.readOnly("isAdsDisplayed", true);
}
if (a.domCmp(["swissadspaysfaucet.com", "swissadspaysethfaucet.com", "stream.nbcsports.com"])) {
    a.readOnly("adBlockEnabled", false);
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
if (a.domCmp(["openload.co", "openload.io", "openload.tv", "oload.stream", "nekopoi.bid", "translatica.pl",
    "angrybirdsnest.com", "4tests.com", "urlaubspartner.net", "freizeitpartnerweb.de", "8bbit.com",
    "outdoorpartner.net"])) {
    a.readOnly("adblock", false);
}
if (a.domCmp(["mexashare.com", "kisshentai.net", "hanime.tv", "mega-estrenos.com", "shortin.ga", "popunderjs.com",
    "code.ptcong.com"])) {
    a.readOnly("BetterJsPop", "window.Object.freeze({})");
}
if (a.domCmp(["youwatch.to", "he2eini7ka.com", "shink.in", "shink.me"])) {
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
if (a.domCmp(["kissanime.io", "kisscartoon.es", "1movies.tv"])) {
    a.readOnly("check_adblock", true);
}
if (a.domCmp(["fourchette-et-bikini.fr", "meteocity.com"])) {
    a.readOnly("adProtect", 1);
}
if (a.domCmp(["vipleague.is", "vipleague.ws", "vipleague.tv", "vipleague.se", "vipleague.me", "vipapp.me",
    "vipleague.mobi", "vipleague.co", "vipleague.sx", "vipleague.ch", "vipbox.tv", "vipbox.co", "vipbox.biz",
    "vipbox.sx", "vipbox.eu", "vipbox.so", "vipbox.nu", "vipboxsa.co", "strikeout.co", "strikeout.me",
    "homerun.re", "vipboxtv.co", "securenetsystems.net"])) {
    a.readOnly("iExist", true);
}
if (a.domCmp(["games.nydailynews.com", "games.express.co.uk", "puzzles.independent.co.uk", "games.orlandosentinel.com",
    "puzzles.standard.co.uk", "games.parade.com", "games.baltimoresun.com", "games.mcall.com", "games.somersetlive.co.uk",
    "games.sun-sentinel.com", "games.reviewjournal.com", "games.dailypress.com", "puzzles.bestforpuzzles.com",
    "games.sandiegouniontribune.com", "games.charlotteobserver.com", "games.chicagotribune.com"])) {
    a.readOnly("Adv_ab", false);
}

//a.noAccess
if (a.domCmp(["debridnet.com", "adshort.co", "linksh.top", "adshorte.com", "coinb.ink", "animeforce.org",
    "imgrock.info"])) {
    a.noAccess("_pop");
}
if (a.domCmp(["linx.cloud"])) {
    a.noAccess("popns");
}
if (a.domCmp(["psarips.com", "streamcloud.eu", "jzrputtbut.net", "arenabg.ch", "solidfiles.com", "adlinkme.com"])) {
    a.noAccess("open");
}

//a.bait
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
if (a.domCmp(["alein.org"])) {
    a.bait("div", "#tester", true);
}
if (a.domCmp(["cutwin.com", "cut-urls.com", "adbull.me", "xess.pro", "clik.pw", "admove.co", "urle.co", "link-cash.com",
    "adshort.co", "linksh.top", "adshorte.com", "coinb.ink", "l2s.io", "shortzero.com", "veneapp.com", "coinlink.us",
    "tmearn.com", "url.gem-flash.com", "cuturlink.com", "shorteurl.com", "linkkawy.com", "cut-egy.ml", "igram.im",
    "adlinkme.com"])) {
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
