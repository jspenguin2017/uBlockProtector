// ----------------------------------------------------------------------------------------------------------------- //

// Nano Defender - An anti-adblock defuser
// Copyright (C) 2016-2019  Nano Defender contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------------------------------------------------------------------------------------- //

// Handle whitelist and initialize generic content solutions. Then apply common content rules.
//
// Solutions from Anti-Adblock Killer (by Reek) are modified to fit the content core library.
//
// Anti-Adblock Killer Repository (contains original source code and license):
// https://github.com/reek/anti-adblock-killer

// ----------------------------------------------------------------------------------------------------------------- //

"use strict";

// ----------------------------------------------------------------------------------------------------------------- //

{

    // ------------------------------------------------------------------------------------------------------------- //

    a.init();

    // ------------------------------------------------------------------------------------------------------------- //

    const domCmpWhitelist = [

        // --------------------------------------------------------------------------------------------------------- //

        // Local network
        "127.0.0.1",
        "local",

        // Reserved TLDs
        "example",
        "invalid",
        "localhost",
        "test",

        // --------------------------------------------------------------------------------------------------------- //

        // Baidu
        "baidu.com",

        // Google
        "google.it.ao",
        "google.ne.jp",
        "google.off.ai",

        // PayPal
        "paypal.com",
        "paypal.me",

        // Twitch
        "twitch.tv",

        // Wikipedia
        "wikipedia.org",

        // YouTube
        "youtu.be",
        "youtube.com",

        // --------------------------------------------------------------------------------------------------------- //

        // Advanced tools (for performance)
        "lab.wolframcloud.com",

        // Image hosts (for performance)
        "flickr.com",
        "imgbox.com",
        "imgur.com",

        // JavaScript playgrounds (for performance)
        "ask.com",
        "jsbin.com",
        "jsfiddle.net",
        "plnkr.co",
        "preloaders.net",
        "stackoverflow.com",
        "w3schools.com",

        // Media sites (for performance)
        "calm.com",
        "vimeo.com",
        "xemvtv.net",
        "yandex.ru",

        // Social networks (for performance)
        "bufferapp.com",
        "chatango.com",
        "facebook.com",
        "instagram.com",
        "linkedin.com",
        "messenger.com",
        "pinterest.com",
        "reddit.com",
        "twitter.com",

        // --------------------------------------------------------------------------------------------------------- //

        // Handled by a special private extension
        "boost.ink",

        // False positives
        "anandabazar.com",
        "animesync.tv",
        "avgle.com",
        "babbel.com",
        "bild.de",
        "buxfer.com",
        "dallasnews.com",
        "derstandard.at",
        "di.fm",
        "download.ipeenk.com",
        "egy.best",
        "filmweb.pl",
        "imdb.com",
        "infostrow.pl",
        "jazzradio.com",
        "kissasian.ch",
        "lcpdfr.com",
        "lemonde.fr",
        "lolalytics.com",
        "o2.pl",
        "ostrzeszowinfo.pl",
        "pokyun.tv",
        "shinden.pl",
        "socketloop.com",
        "sport-tv-guide.live",
        "store.playstation.com",
        "strefadb.pl",
        "techradar.com",
        "tv3sport.dk",
        "tvserial.it",
        "viafree.dk",
        "viafree.fi",
        "viafree.no",
        "viafree.se",
        "viasatsport.se",
        "viasport.fi",
        "viasport.no",
        "vod.pl",
        "wilmaa.com",
        "wp.pl",

        // Custom FuckAdBlock
        "atresplayer.com",
        "aviationweek.com",
        "juprimaulana.com",
        "paraedu.id",
        "rmcmv.us",
        "yuukithemes.com",

        // --------------------------------------------------------------------------------------------------------- //

    ];

    const domIncWhitelist = [

        // --------------------------------------------------------------------------------------------------------- //

        // Local network
        "192.168.0",
        "192.168.1",

        // --------------------------------------------------------------------------------------------------------- //

        // Google
        "google",
        "google.co",
        "google.com",

        // Yahoo
        "yahoo",

        // --------------------------------------------------------------------------------------------------------- //

        // Stores (for performance)
        "amazon",
        "ebay",

        // --------------------------------------------------------------------------------------------------------- //

        // False positives
        "9anime",
        "italiashare",
        "kissanime",

        // --------------------------------------------------------------------------------------------------------- //

    ];

    // ------------------------------------------------------------------------------------------------------------- //

    if (a.domCmp(domCmpWhitelist, true) || a.domInc(domIncWhitelist, true)) {

        console.log("[Nano] Excluded :: All Generically Applied Solutions");

    } else {

        if (a.domCmp([], true))
            console.log("[Nano] Excluded :: Common Generic Solutions");
        else
            a.generic();

        if (a.domCmp([], true))
            console.log("[Nano] Excluded :: Adfly Bypasser");
        else
            a.generic.Adfly();

        if (a.domCmp([], true))
            console.log("[Nano] Excluded :: app_vars Defuser");
        else
            a.generic.app_vars();

        /*
        // NoAdBlock is removed from Cloudflare, disable rule for now
        if (a.domCmp([], true))
            console.log("[Nano] Excluded :: NoAdBlock Defuser");
        else
            a.generic.NoAdBlock();
        */

    }

    // ------------------------------------------------------------------------------------------------------------- //

    if (a.domCmp([
        "acquavivalive.it",
        "beinsports.com",
        "gamersclub.com.br",
        "listamais.com.br",
        "lolskinlistgenerator.com",
        "m.delfi.ee",
        "memurlar.net",
        "molfettalive.it",
        "palemoon.org",
        "palolive.it",
        "passionea300allora.it",
        "sledujserialy.sk",
        "stocks.cafe",
        "uploadboy.com",
        "videohelp.com",
        "vidoza.net",
        "warforum.cz",
        "zeiz.me",
    ])) {
        a.generic.adsjsV2();
    }

    // ------------------------------------------------------------------------------------------------------------- //

    if (a.domCmp([
    ], true)) {
        a.uBOExtraExcluded = true;
        console.log("[Nano] Excluded :: uBO-Extra");
    }

    // ------------------------------------------------------------------------------------------------------------- //

}

// ----------------------------------------------------------------------------------------------------------------- //

// a.filter

if (a.domCmp([
    "darmowe-pornosy.pl",
    "exrapidleech.info",
    "flashx.to",
    "flashx.tv",
    "linx.cloud",
    "salon.com",
    "urle.co",
    "usapoliticstoday.com",
    "vidlox.tv",
])) {
    a.filter("eval");
}

if (a.domCmp([
    "cloudwebcopy.com",
    "sc2casts.com",
    "webqc.org",
])) {
    a.filter("setTimeout");
}

if (a.domCmp([
    "1movies.tv",
    "adshort.co",
    "adshort.im",
    "adshorte.com",
    "arenavision.in",
    "atdhe.al",
    "atdhe.bz",
    "atdhe.li",
    "atdhe.me",
    "atdhe.mx",
    "atdhe.ru",
    "atdhe.se",
    "atdhe.to",
    "atdhe.top",
    "backin.net",
    "coinb.ink",
    "ddlfr.pw",
    "doramasflv.net",
    "firstrow.co",
    "firstrow1us.eu",
    "firstrows.biz",
    "firstrows.co",
    "firstrows.org",
    "firstrows.ru",
    "firstrows.tv",
    "firstrowsportes.com",
    "firstrowsportes.tv",
    "firstrowus.eu",
    "firstsrowsports.eu",
    "hahasport.me",
    "iiv.pl",
    "justfirstrowsports.com",
    "katfile.com",
    "l2s.io",
    "linclik.com",
    "linkkawy.com",
    "linksh.top",
    "myp2p.biz",
    "myp2p.com",
    "myp2p.ec",
    "myp2p.eu",
    "myp2p.la",
    "myp2p.sx",
    "myp2p.tv",
    "myp2p.ws",
    "oload.info",
    "oload.stream",
    "sawlive.tv",
    "shink.me",
    "u2s.io",
    "ur.ly",
    "urle.co",
    "videowood.tv",
    "vidoza.net",
    "wiziwig.ru",
    "wiziwig.sx",
    "wiziwig.to",
    "wiziwig.tv",
    "zlshorte.net",
])) {
    a.filter("open");
}

if (a.domCmp([
    "businesstoday.in",
    "dl-protect.com",
    "doatoolsita.altervista.org",
    "drivearabia.com",
    "filecom.net",
    "free-movie-home.com",
    "generatupremium.biz",
    "kooora.com",
    "kooora.com",
    "mega-debrid.eu",
    "newsinlevels.com",
    "pc.online143.com",
    "pipocas.tv",
    "premiumst0re.blogspot.com",
    "putlocker.com",
    "sockshare.com",
    "str3am.altervista.org",
    "str3amtv.altervista.org",
    "str3amtv.co.nr",
    "str3amtv.co.nr",
    "vipracing.biz",
])) {
    a.filter("alert");
}

// ----------------------------------------------------------------------------------------------------------------- //

// a.readOnly

if (a.domCmp([
    "financialexpress.com",
    "indianexpress.com",
    "jansatta.com",
    "srt.am",
    "uskip.me",
])) {
    a.readOnly("RunAds", true);
}

if (a.domCmp([
    "catcatyfaucet.xyz",
    "jagranjunction.com",
    "nekopoi.bid",
])) {
    a.readOnly("isAdsDisplayed", true);
}

if (a.domCmp([
    "stream.nbcsports.com",
    "swissadspaysethfaucet.com",
    "swissadspaysfaucet.com",
])) {
    a.readOnly("adBlockEnabled", false);
}

if (a.domCmp([
    "link.tl",
])) {
    a.readOnly("adblocker", false);
}

if (a.domCmp([
    "megogo.net",
])) {
    a.readOnly("adBlock", false);
}

if (a.domCmp([
    "4tests.com",
    "8bbit.com",
    "alcodistillers.ru",
    "angrybirdsnest.com",
    "freizeitpartnerweb.de",
    "nekopoi.bid",
    "oload.stream",
    "openload.co",
    "openload.io",
    "openload.tv",
    "outdoorpartner.net",
    "translatica.pl",
    "urlaubspartner.net",
])) {
    a.readOnly("adblock", false);
}

if (a.domCmp([
    "code.ptcong.com",
    "hanime.tv",
    "mega-estrenos.com",
    "mexashare.com",
    "popunderjs.com",
    "shortin.ga",
])) {
    a.readOnly("BetterJsPop", "window.Object.freeze({})");
}

if (a.domCmp([
    "he2eini7ka.com",
    "youwatch.to",
])) {
    a.readOnly("jsPopunder", () => { });
}

if (a.domCmp([
    "ahzahg6ohb.com",
    "ajihezo.info",
    "bojem3a.info",
    "chefti.info",
    "chouhaa.info",
    "exashare.com",
    "he2eini7ka.com",
    "yahmaib3ai.com",
    "youwatch.org",
    "youwatch.to",
])) {
    a.readOnly("adsShowPopup1", 1);
}

if (a.domCmp([
    "game-debate.com",
    "naruto-mx.net",
    "onepiece-mx.net",
    "scan-mx.com",
])) {
    a.readOnly("ad_block_test", () => { });
}

if (a.domCmp([
    "freebitcoins.nx.tc",
    "getbitcoins.nx.tc",
])) {
    a.readOnly("ad_block_test", () => false);
}

if (a.domCmp([
    "1movies.tv",
    "xmovies8.es",
])) {
    a.readOnly("check_adblock", true);
}

if (a.domCmp([
    "fourchette-et-bikini.fr",
    "meteocity.com",
])) {
    a.readOnly("adProtect", 1);
}

if (a.domCmp([
    "homerun.re",
    "securenetsystems.net",
    "strikeout.co",
    "strikeout.me",
    "vipapp.me",
    "vipbox.biz",
    "vipbox.co",
    "vipbox.eu",
    "vipbox.nu",
    "vipbox.so",
    "vipbox.sx",
    "vipbox.tv",
    "vipboxsa.co",
    "vipboxtv.co",
    "vipleague.ch",
    "vipleague.co",
    "vipleague.is",
    "vipleague.me",
    "vipleague.mobi",
    "vipleague.se",
    "vipleague.sx",
    "vipleague.tv",
    "vipleague.ws",
])) {
    a.readOnly("iExist", true);
}

// ----------------------------------------------------------------------------------------------------------------- //

// a.noAccess

if (a.domCmp([
    "adshort.co",
    "adshorte.com",
    "animeforce.org",
    "coinb.ink",
    "debridnet.com",
    "imgrock.info",
    "linksh.top",
    "srt.am",
])) {
    a.noAccess("_pop");
}

if (a.domCmp([
    "linx.cloud",
])) {
    a.noAccess("popns");
}

if (a.domCmp([
    "adlinkme.com",
    "arenabg.ch",
    "jzrputtbut.net",
    "maango.info",
    "psarips.com",
    "solidfiles.com",
    "streamcloud.eu",
    "torrentfunk.com",
    "vidfile.net",
])) {
    a.noAccess("open");
}

// ----------------------------------------------------------------------------------------------------------------- //

// a.bait

if (a.domCmp([
    "leveldown.fr",
    "primeshare.tv",
])) {
    a.bait("div", "#adblock");
}

if (a.domCmp([
    "720pmkv.com",
    "psarips.com",
])) {
    a.bait("div", "#advert");
}

if (a.domCmp([
    "bitcoiner.net",
    "d3brid4y0u.info",
    "dashcatch.xyz",
    "dogecatch.website",
    "dramapassion.com",
    "easybillets.com",
    "fileice.net",
    "freeallmusic.info",
    "litecoiner.net",
    "nosteam.ro",
    "online.ua",
    "openrunner.com",
    "osoarcade.com",
    "putlocker.com",
    "shortify.pw",
    "sockshare.com",
    "spox.fr",
    "tgo-tv.com",
    "tv3.co.nz",
    "yooclick.com",
    "yovoyages.com",
])) {
    a.bait("div", "#tester");
}

if (a.domCmp([
    "alein.org",
])) {
    a.bait("div", "#tester", true);
}

if (a.domCmp([
    "filecom.net",
    "globeslot.com",
    "mwfiles.net",
    "skippyfile.com",
    "up-flow.org",
    "upshare.org",
])) {
    a.bait("div", "#add");
}

if (a.domCmp([
    "bluesatoshi.com",
    "oneadfaucet.com",
    "razercrypt.com",
    "satoshiempire.com",
])) {
    a.bait("div", "#test");
}

if (a.domCmp([
    "bitcoinaliens.com",
    "door2windows.com",
])) {
    a.bait("ins", ".adsbygoogle");
}

if (a.domCmp([
    "hellsmedia.com",
    "leaguesecretary.com",
    "teknogods.com",
])) {
    a.bait("div", "#adpbtest");
}

if (a.domCmp([
    "freesportsbet.com",
    "sportsplays.com",
])) {
    a.bait("div", "#ad-tester");
}

if (a.domCmp([
    "bitcoiner.net",
    "litecoiner.net",
])) {
    a.bait("div", "#ad-top");
}

// ----------------------------------------------------------------------------------------------------------------- //
