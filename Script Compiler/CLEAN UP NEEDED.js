
    if (a.domCmp(["primeshare.tv"])) { 
        //Inject CSS

        a.bait("div", "#adblock");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues?q=debridnet
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=livedebrid
    if (a.domCmp(["debridnet.com', 'livedebrid.com"])) { 
        //Inject CSS

        a.css(".myTestAd2 { height: 5px; }");
        a.bait("div", ".myTestAd2");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/873
    if (a.domCmp(["bluesatoshi.com"])) { 
        //Inject CSS

        a.css("#test { height: 280px; }");
        a.bait("div", "#test");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/870
    if (a.domCmp(["razercrypt.com"])) { 
        //Inject CSS

        a.css("#test { height: 250px; }");
        a.bait("div", "#test");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/872
    if (a.domCmp(["satoshiempire.com"])) { 
        //Inject CSS

        a.css("#test { height: 250px; }");
        a.bait("div", "#test");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/871
    if (a.domCmp(["oneadfaucet.com"])) { 
        //Inject CSS

        a.css("#test { height: 250px; }");
        a.bait("div", "#test");
    }

    if (a.domCmp(["jkanime.net"])) { 
        //Inject CSS
        // @@||jkanime.net/assets/js/advertisement2.js

        a.bait("div", "#reco");
    }

    if (a.domCmp(["720pmkv.com"])) { 
        //Inject CSS

        a.bait("div", "#advert");
    }

    if (a.domCmp(["paidverts.com"])) { 
        //Inject CSS

        a.bait("div", ".afs_ads");
    }

    if (a.domCmp(["italiatv.org"])) { 
        //Inject CSS

        a.bait("div", "#fab13");
    }

    if (a.domCmp(["eventhubs.com"])) { 
        //Inject CSS

        a.bait("div", "#blahyblaci1");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/1295
    // source: http://pastebin.com/FDPAKjTQ
    if (a.domCmp(["superanimes.com"])) { 
        //Inject CSS

        a.bait("div", "#bannerLoja");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/243
    if (a.domCmp(["forum.pac-rom.com"])) { 
        //Inject CSS

        a.bait("div", ".banner_ads");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/1299
    // source: http://pastebin.com/zcddvTuC
    if (a.domCmp(["litv.tv"])) { 
        //Inject CSS

        a.bait("div", ".player_mask");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/595
    if (a.domCmp(["leveldown.fr"])) { 
        //Inject CSS

        a.bait("div", "#adblock");
        a.bait("div", "#adblocktest");
    }

    // issue: https://github.com/reek/anti-adblock-killer/issues/924
    if (a.domCmp(["globeslot.com"])) { 
        //Inject CSS

        a.bait("div", "#add");
        a.bait("div", "#add1");
    }

    if (a.domCmp(["antennesport.com', 'serverhd.eu"])) { 
        //Inject CSS
        onIdle: function () { // for antennesport
            // Remove Pub
            Aak.removeElement("#pub .pubclose");
            // Redirect to Player
            Aak.setElement('#pub .embed iframe', {
                src: '/embed/embed.php'
            });
        }

        // issue: https://greasyfork.org/en/forum/discussion/8611
        if (a.domCmp(["drivearabia.com', 'putlocker.com', 'doatoolsita.altervista.org', 'sockshare.com', 'free-movie-home.com', 'pc.online143.com', 'kooora.com', 'str3amtv.co.nr', 'str3amtv.altervista.org', 'str3am.altervista.org', 'filecom.net', 'pipocas.tv', 'generatupremium.biz', 'mega-debrid.eu', 'premiumst0re.blogspot.com', 'dl-protect.com', 'newsinlevels.com', 'vipracing.biz', 'businesstoday.in"])) { 
            //Inject CSS
            onAlways: function () {
                Aak.uw.alert = function () { };
            }

            if (a.domCmp(["generatupremium.biz"])) { 
                //Inject CSS

                // Disable Confirm Box
                //Aak.uw.confirm = function (){};
                Aak.setCookie('genera', false);
            }

            if (a.domCmp(["newstatesman.com"])) { 
                //Inject CSS

                Aak.setCookie('donationPopup', 'hide");
                }

            // by: Skr4tchGr3azyMonkiBallllllZzzz
            // issue: https://github.com/reek/anti-adblock-killer/issues/809
            if (a.domCmp(["yes.fm"])) { 
                //Inject CSS

                Aak.addScript(function () {
                    window.com_adswizz_synchro_initialize = function () { };
                });
            }

            // by: Alexander255
            // patch: http://pastebin.com/raw.php?i=r7Q4DrfB
            // issue: https://github.com/reek/anti-adblock-killer/issues?q=derstandard
            if (a.domCmp(["derstandard.at"])) { 
                //Inject CSS


                var makeISOTimestampUTC = function () {
                    var pad = function (amount, width) {
                        var padding = "";
                        while (padding.length < width - 1 && amount < Math.pow(10, width - padding.length - 1)) {
                            padding += "0";
                        }
                        return padding + amount.toString();
                    };

                    var date = new Date();
                    return [pad(date.getUTCFullYear(), 4), "-",
                      pad(date.getUTCMonth() + 1, 2), "-",
                      pad(date.getUTCDate(), 2), "T",
                      pad(date.getUTCHours(), 2), ":",
                      pad(date.getUTCMinutes(), 2), ":",
                      pad(date.getUTCSeconds(), 2)].join();
                };

                document.cookie.split('; ').forEach(function (cookie) {
                    // Find main storage cookie
                    if (cookie.substr(0, 6) == "MGUID=") {
                        // Decompose information from main storage cookie
                        var values = {};
                        cookie.substr(6).split("&").forEach(function (assignment) {
                            var pos = assignment.indexOf('=");
                            if (pos > -1) {
                                values[assignment.substr(0, pos)] = assignment.substr(pos + 1);
                            }
                        });

                        // Update "first viewed" timestamp
                        values.Timestamp = makeISOTimestampUTC();

                        // Recompose information in main storage cookie
                        cookie = "MGUID=";
                        for (var key in values) {
                            if (values.hasOwnProperty(key)) {
                                cookie += key + "=" + values[key] + "&";
                            }
                        }
                        cookie = cookie.substr(0, (cookie.length - 1));

                        // Update cookie
                        document.cookie = cookie;
                    }
                });
            }

            // by: Reek, Alexander255
            // issue: https://github.com/reek/anti-adblock-killer/issues/788
            // issue: https://github.com/reek/anti-adblock-killer/issues/512
            if (a.domCmp(["tek.no', 'gamer.no', 'teknofil.no', 'insidetelecom.no', 'prisguide.no', 'diskusjon.no', 'teknojobb.no', 'akam.no', 'hardware.no', 'amobil.no"])) { 
                //Inject CSS
                onIdle: function () {

                    /*
                    var ad_frame = document.createElement("iframe");
                    ad_frame.name = "_frame";
                    ad_frame.style.display = "none";
                    document.body.appendChild(ad_frame);
                    ad_frame.contentWindow.wrappedJSObject.inFIF = true;
                     */

                    // fix 27.11.2015
                    Aak.createElement({
                        tag: 'div',
                        id: 'google_ads_iframe_',
                        html: '<p></p>',
                        append: 'body'
                    });

                }

                // issue: https://github.com/reek/anti-adblock-killer/issues/1467
                // issue: https://github.com/reek/anti-adblock-killer/issues/159
                if (a.domCmp(["planetatvonlinehd.blogspot.', 'planetatvonlinehd.com"])) { 
                    //Inject CSS

                    a.css('.adsantilok { height: 1px; }");
                    //Aak.uw.jQAntiAdsBlock = function (){}; // don't work
                    }

                // issue: https://github.com/reek/anti-adblock-killer/issues/628
                // issue: https://github.com/reek/anti-adblock-killer/issues/562
                // issue: https://github.com/reek/anti-adblock-killer/issues/484
                // source: http://paste2.org/53ymghX1
                if (a.domCmp(["beta.speedtest.net"])) { 
                    //Inject CSS
                    onAlways: function () {
                        Aak.uw.adsOoklaComReachable = true;
                        Aak.uw.scriptsLoaded = function () { };
                    }

                    // by: Alexander255
                    // issue: https://github.com/reek/anti-adblock-killer/issues/545
                    if (a.domCmp(["binbucks.com"])) { 
                        //Inject CSS
                        onIdle: function () {
                            Aak.uw.testJuicyPay = true;
                            Aak.uw.testSensePay = true;
                        }

                        // issue: https://github.com/reek/anti-adblock-killer/issues/1284
                        // source: http://pastebin.com/Epr5tREL
                        if (a.domCmp(["whiskyprijzen.com', 'whiskyprices.co.uk', 'whiskypreise.com', 'whiskyprix.fr"])) { 
                            //Inject CSS
                            onAlways: function () {
                                Aak.uw.OA_show = true;
                            }

                            // issue: https://github.com/reek/anti-adblock-killer/issues/1184
                            // source: http://pastebin.com/MNHpLs2V
                            if (a.domCmp(["nicoblog.org"])) { 
                                //Inject CSS
                                onIdle: function () {
                                    var el = document.querySelector('.src");
                                    el.removeAttribute('class");
                                }

                                // note: add this rule for chrome user
                                // issue: https://github.com/reek/anti-adblock-killer/issues/1319
                                // source: http://pastebin.com/9bDPQzMX
                                if (a.domCmp(["di.se"])) { 
                                    //Inject CSS
                                    onIdle: function () {
                                        Aak.removeElement('#header_overlay");
                                        Aak.removeElement('#message_modal");
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1642
                                    // source: http://pastebin.com/6Fzp0vrE
                                    if (a.domCmp(["libertaddigital.com"])) { 
                                        //Inject CSS

                                        Object.defineProperty(Aak.uw, "ad_already_played", {
                                            enumerable: true,
                                            writable: false,
                                            value: true
                                        });
                                        Object.defineProperty(Aak.uw, "puedeMostrarAds", {
                                            enumerable: true,
                                            writable: false,
                                            value: true
                                        });
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1396
                                    // source: f( ( typeof paywall_access == "undefined" || paywall_access != true ) && ( typeof folha_ads == "undefined" || folha_ads != true ) ) {
                                    if (a.domCmp(["folha.uol.com.br"])) { 
                                        //Inject CSS

                                        Object.defineProperty(Aak.uw, "paywall_access", {
                                            enumerable: true,
                                            writable: false,
                                            value: true
                                        });
                                        Object.defineProperty(Aak.uw, "folha_ads", {
                                            enumerable: true,
                                            writable: false,
                                            value: true
                                        });
                                    }

                                    // by: mmis1000
                                    // userscript: https://greasyfork.org/en/scripts/16525
                                    // issue: : https://github.com/reek/anti-adblock-killer/issues/975
                                    if (a.domCmp(["gamer.com.tw"])) { 
                                        //Inject CSS

                                        Object.defineProperty(Aak.uw, 'AntiAd', {
                                            enumerable: true,
                                            writable: false,
                                            value: null
                                        });
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/845
                                    if (a.domCmp(["armorgames.com"])) { 
                                        //Inject CSS

                                        Object.defineProperty(Aak.uw, 'ga_detect', {
                                            enumerable: true,
                                            writable: false,
                                            value: null
                                        });
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/957
                                    // issue: https://github.com/reek/anti-adblock-killer/issues/558
                                    // source: http://pastebin.com/GrpbJENA
                                    if (a.domCmp(["mangahost.com"])) { 
                                        //Inject CSS

                                        Object.defineProperty(Aak.uw, "testDisplay", {
                                            enumerable: true,
                                            writable: false,
                                            value: false
                                        });
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1339
                                    // source: http://videowood.tv/build/assets/js/pembed-97a640f625.js
                                    if (a.domCmp(["videowood.tv"])) { 
                                        //Inject CSS

                                        Aak.uw.open = function () { }; // prevent popup
                                        Aak.uw.config = {};
                                        Object.defineProperty(Aak.uw.config, "adb_remind", {
                                            enumerable: true,
                                            writable: false,
                                            value: false
                                        });
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1339
                                    // source: http://pastebin.com/LPg6093U
                                    // redirect: http://www.infojobs.com.br/nopublicity.aspx
                                    if (a.domCmp(["infojobs.com.br"])) { 
                                        //Inject CSS

                                        Aak.addScript(function () {
                                            var webUI = webUI || {};
                                            webUI.Utils = webUI.Utils || {};
                                            Object.defineProperty(webUI.Utils, "StopAdBlock", {
                                                enumerable: true,
                                                writable: false,
                                                value: function () { }
                                            });
                                        });
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/714
                                    if (a.domCmp(["cloudwebcopy.com"])) { 
                                        //Inject CSS

                                        var setTimeoutClone = Aak.uw.setTimeout;
                                        Aak.uw.setTimeout = null;
                                        setTimeout(function () {
                                            Aak.uw.setTimeout = setTimeoutClone;
                                        }, 5000);
                                    }

                                    // issue: https://github.com/reek/anti-adblock-killer/issues/569
                                    if (a.domCmp(["narkive.com"])) { 
                                        //Inject CSS
                                        onAlways: function () {
                                            Aak.uw.adblock_status = function () {
                                                return false;
                                            };
                                        }

                                        if (a.domCmp(["pregen.net"])) { 
                                            //Inject CSS

                                            // skip page info
                                            Aak.setCookie('pgn', 1);
                                        }

                                        // issue: https://github.com/reek/anti-adblock-killer/issues/768
                                        if (a.domCmp(["phys.org"])) { 
                                            //Inject CSS
                                            onAlways: function () {
                                                Aak.uw.chkAB = function () { };
                                            }

                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=onvasortir.com
                                            if (a.domCmp(["onvasortir.com"])) { 
                                                //Inject CSS
                                                onAlways: function () {
                                                    // +abp rule alt solution
                                                    Aak.uw.JeBloque = function () { };
                                                }

                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=fullhdzevki.com
                                                if (a.domCmp(["fullhdzevki.com"])) { 
                                                    //Inject CSS
                                                    onAlways: function () {
                                                        // +abp rule alt solution
                                                        Aak.uw.check = function () { };
                                                    }

                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/258
                                                    // source: http://pastebin.com/16mnmeMc
                                                    if (a.domCmp(["ville-ideale.com"])) { 
                                                        //Inject CSS
                                                        onAlways: function () {
                                                            // +abp rule alt solution
                                                            Aak.uw.execsp = function () { };
                                                        }

                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/258
                                                        // source: http://pastebin.com/qrS6QGGE
                                                        if (a.domCmp(["notre-planete.info"])) { 
                                                            //Inject CSS
                                                            onAlways: function () {
                                                                // +abp rule alt solution
                                                                Aak.uw.pubpop = function () { };
                                                            }

                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/378
                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/224
                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/78
                                                            if (a.domCmp(["apkmirror.com"])) { 
                                                                //Inject CSS
                                                                onAlways: function () {
                                                                    Aak.uw.doCheck = function () { };
                                                                }

                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/948
                                                                // issue: https://greasyfork.org/forum/discussion/7753
                                                                // source: http://pastebin.com/BFrDPM6b
                                                                if (a.domCmp(["mtlblog.com"])) { 
                                                                    //Inject CSS

                                                                    Object.defineProperty(Aak.uw, 'puabs', {
                                                                        enumerable: true,
                                                                        value: function () { }
                                                                    });
                                                                }

                                                                // issue:
                                                                if (a.domCmp(["anizm.com"])) { 
                                                                    //Inject CSS
                                                                    onAlways: function () {
                                                                        Aak.uw.stopAdBlock = {};
                                                                    }

                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1550
                                                                    if (a.domCmp(["diarioinformacion.com"])) { 
                                                                        //Inject CSS

                                                                        Object.defineProperty(Aak.uw, 'pr_okvalida', {
                                                                            enumerable: true,
                                                                            value: true
                                                                        });
                                                                    }

                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1301
                                                                    // source: http://pastebin.com/vXNCztwx
                                                                    if (a.domCmp(["cnbeta.com"])) { 
                                                                        //Inject CSS

                                                                        Object.defineProperty(Aak.uw, 'JB', {
                                                                            enumerable: true,
                                                                            value: function () { }
                                                                        });
                                                                    }

                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1292
                                                                    // source: http://pastebin.com/m08dkDT4
                                                                    if (a.domCmp(["themarker.com', 'haaretz.co.il"])) { 
                                                                        //Inject CSS

                                                                        Object.defineProperty(Aak.uw, 'AdBlockUtil', {
                                                                            enumerable: true,
                                                                            value: {}
                                                                        });
                                                                    }

                                                                    // issue:
                                                                    if (a.domCmp(["pipocas.tv"])) { 
                                                                        //Inject CSS

                                                                        // Also added in disableAlertbox
                                                                        // No popup
                                                                        Aak.setCookie('popup_user_login', 'yes");
                                                                        }

                                                                    // note: regulary update script
                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues?q=15min.it
                                                                    // source: http://pastebin.com/YWf3HTqr
                                                                    // test: http://tinyurl.com/h6c4336
                                                                    if (a.domCmp(["15min.lt"])) { 
                                                                        //Inject CSS

                                                                        Object.defineProperty(Aak.uw, 'ROUTE', {
                                                                            enumerable: true,
                                                                            writable: false,
                                                                            value: '_be_reklamos'
                                                                        });
                                                                    }

                                                                    // by: Giwayume
                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1599
                                                                    if (a.domCmp(["sc2casts.com"])) { 
                                                                        //Inject CSS

                                                                        Aak.addScript(function () {
                                                                            window._gaq = { push: function () { } };
                                                                            Object.defineProperty(window, "showdialog", {
                                                                                value: function () { },
                                                                                configurable: false,
                                                                                writable: false
                                                                            });
                                                                            Object.defineProperty(window, "showPopup2", {
                                                                                value: function () { },
                                                                                configurable: false,
                                                                                writable: false
                                                                            });
                                                                        });
                                                                    }

                                                                    // issue:
                                                                    if (a.domCmp(["vgunetwork.com"])) { 
                                                                        //Inject CSS
                                                                        onIdle: function () {
                                                                            Aak.setCookie('stopIt', 1);
                                                                            var close = Aak.getElement('#some_ad_block_key_close");
                                                                            if (close) {
                                                                                close.click();
                                                                        }
                                                                    }

                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/286
                                                                    // issue: https://github.com/reek/anti-adblock-killer/pull/67
                                                                    if (a.domCmp(["linkcrypt.ws"])) { 
                                                                        //Inject CSS
                                                                        onIdle: function () {
                                                                            Aak.setElement('#ad_cont', {
                                                                                id: '',
                                                                                style: 'display:block;'
                                                                            });
                                                                            Aak.setElement('#container_check', {
                                                                                style: 'display:none;'
                                                                            });
                                                                        }

                                                                        // issue: 
                                                                        if (a.domCmp(["eventosppv.me"])) { 
                                                                            //Inject CSS
                                                                            onIdle: function () {
                                                                                Aak.removeElement('#nf37");
                                                                                }

                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/552
                                                                            if (a.domCmp(["bolor-toli.com"])) { 
                                                                                //Inject CSS
                                                                                onEnd: function () {
                                                                                    var ads = document.getElementsByClassName('banner");
                                                                                    for (var i = 0; i < ads.length; i++) {
                                                                                        var ad = ads[i];
                                                                                        ad.innerHTML = '<br>';
                                                                                        ad.style.height = '1px';
                                                                                    }
                                                                                }

                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/280
                                                                                if (a.domCmp(["vivo.sx"])) { 
                                                                                    //Inject CSS
                                                                                    onEnd: function () {
                                                                                        var alert = Aak.getElement('#alert-throttle");
                                                                                        if (alert) {
                                                                                            Aak.removeElement(alert);
                                                                                    }
                                                                                    var button = Aak.getElement('button#access");
                                                                                    if (button) {
                                                                                            button.removeAttribute('id");
                                                                                            button.removeAttribute('disabled");
                                                                                            button.innerHTML = 'Continue to video';
                                                                                }
                                                                                setTimeout(function () {
                                                                                    var input = Aak.getElement('input[name="throttle"]");
                                                                                    if (input) {
                                                                                        Aak.removeElement(input);
                                                                                }
                                                                                }, 1000);
                                                                        }
                                                                        // skip redirect myanimes.li
                                                                        // issue:
                                                                        if (a.domCmp(["luxyad.com"])) { 
                                                                            //Inject CSS
                                                                            onIdle: function () {
                                                                                if ('/Information.php' == location.pathname) {
                                                                                    var href = location.href;
                                                                                    location.href = href.substr(href.indexOf('url=') + 4, href.length);
                                                                                }
                                                                            }

                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1405
                                                                            if (a.domCmp(["mrpiracy.xyz', 'mrpiracy.club"])) { 
                                                                                //Inject CSS
                                                                                onBeforeScript: function () {
                                                                                    return [{
                                                                                        contains: 'Desativa o AdBlock para continuar',
                                                                                        external: false,
                                                                                        remove: true
                                                                                    }
                                                                                    ];
                                                                                }

                                                                                // issue: PM
                                                                                if (a.domCmp(["dbplanet.net"])) { 
                                                                                    //Inject CSS

                                                                                    Aak.setCookie('newnoMoreAdsNow', 1);
                                                                                }

                                                                                // issue:
                                                                                if (a.domCmp(["aidemu.fr"])) { 
                                                                                    //Inject CSS

                                                                                    Aak.setCookie('adblockPopup', true);
                                                                                }

                                                                                // issue:
                                                                                if (a.domCmp(["eami.in"])) { 
                                                                                    //Inject CSS
                                                                                    onAlways: function () {
                                                                                        Aak.setCookie('ad_locked', 1);
                                                                                    }

                                                                                    // issue:
                                                                                    if (a.domCmp(["bigdownloader.com"])) { 
                                                                                        //Inject CSS
                                                                                        onIdle: function () {
                                                                                            Aak.removeElement('#anti_adblock");
                                                                                            }

                                                                                        // by: Gorhill
                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/639
                                                                                        // note: also added list rule
                                                                                        if (a.domCmp(["freeskier.com"])) { 
                                                                                            //Inject CSS
                                                                                            onIdle: function () {
                                                                                                var el = document.getElementById("adb-not-enabled");
                                                                                                if (el !== null) {
                                                                                                    el.style.removeProperty("display");
                                                                                                }
                                                                                                el = document.getElementById("videoContainer");
                                                                                                if (el !== null) {
                                                                                                    el.style.removeProperty("display");
                                                                                                }
                                                                                            }

                                                                                            // issue:
                                                                                            if (a.domCmp(["gametrailers.com"])) { 
                                                                                                //Inject CSS
                                                                                                onIdle: function () {
                                                                                                    Aak.removeElement('#ad_blocking");
                                                                                                    }

                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/582
                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/279
                                                                                                if (a.domCmp(["scan-mx.com', 'onepiece-mx.net', 'naruto-mx.net"])) { 
                                                                                                    //Inject CSS
                                                                                                    onAlways: function () {
                                                                                                        Aak.uw.ad_block_test = function () { };
                                                                                                    },
                                                                                                    onIdle: function () {
                                                                                                        Aak.setElement('#yop', {
                                                                                                            id: ''
                                                                                                        });
                                                                                                    }
                                                                                                },
                                                                                                // Bitcoins
                                                                                                bitcoinker_com: {
                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/230
                                                                                                    if (a.domCmp(["bitcoinker.com"])) { 
                                                                                                        //Inject CSS

                                                                                                        Aak.uw.claim = function () {
                                                                                                            return true;
                                                                                                        };
                                                                                                    },
                                                                                                    onIdle: function () {
                                                                                                        Aak.removeElement('#E33FCCcX2fW");
                                                                                                        }

                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/384
                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/232
                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/233
                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/236
                                                                                                    if (a.domCmp(["moondoge.co.in', 'moonliteco.in', 'moonbit.co.in', 'bitcoinzebra.com"])) { 
                                                                                                        //Inject CSS
                                                                                                        onIdle: function () {
                                                                                                            Aak.removeElement('#AB, #E442Dv, #eCC5h");
                                                                                                            }

                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/349
                                                                                                        if (a.domCmp(["bitcoiner.net', 'litecoiner.net"])) { 
                                                                                                            //Inject CSS

                                                                                                            a.bait("div", "#tester");
                                                                                                            a.bait("div", "#ad-top");
                                                                                                        }

                                                                                                        // issue:
                                                                                                        if (a.domCmp(["freebitcoins.nx.tc', 'getbitcoins.nx.tc"])) { 
                                                                                                            //Inject CSS
                                                                                                            onAlways: function () {
                                                                                                                Aak.uw.ad_block_test = function () {
                                                                                                                    return false;
                                                                                                                };
                                                                                                            }

                                                                                                            // issue:
                                                                                                            if (a.domCmp(["freecoins4.me"])) { 
                                                                                                                //Inject CSS
                                                                                                                onAlways: function () {
                                                                                                                    Aak.uw.check = function () {
                                                                                                                        return false;
                                                                                                                    };
                                                                                                                }

                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/537
                                                                                                                if (a.domCmp(["torrent-tv.ru"])) { 
                                                                                                                    //Inject CSS
                                                                                                                    onAlways: function () {
                                                                                                                        Aak.uw.c_Oo_Advert_Shown = true;
                                                                                                                    }

                                                                                                                    // by: Kalbasit
                                                                                                                    // pull: https://github.com/reek/anti-adblock-killer/pull/763
                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/340
                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/762
                                                                                                                    if (a.domCmp(["cwtv.com"])) { 
                                                                                                                        //Inject CSS
                                                                                                                        onAlways: function () {
                                                                                                                            Aak.uw.CWTVIsAdBlocking = undefined;
                                                                                                                        }

                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=bild
                                                                                                                        if (a.domCmp(["bild.de"])) { 
                                                                                                                            //Inject CSS
                                                                                                                            onBeforeScript: function () {
                                                                                                                                return [{
                                                                                                                                    contains: 'http://www.bild.de/wa/ll/bild-de/unangemeldet-42925516.bild.html',
                                                                                                                                    external: false,
                                                                                                                                    replace: ['javascript', 'void(0);'].join(':')
                                                                                                                                }
                                                                                                                                ];
                                                                                                                            }

                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/532
                                                                                                                            if (a.domCmp(["inn.co.il"])) { 
                                                                                                                                //Inject CSS

                                                                                                                                Aak.addScript(function () {
                                                                                                                                    var TRC = {};
                                                                                                                                    TRC.blocker = {
                                                                                                                                        states: {
                                                                                                                                            ABP_DETECTION_DISABLED: -2,
                                                                                                                                            ABP_NOT_DETECTED: 0,
                                                                                                                                            ABP_DETECTED: 1
                                                                                                                                        },
                                                                                                                                        createBlockDetectionDiv: function () {
                                                                                                                                            return document.createElement("div");
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
                                                                                                                                });
                                                                                                                            }

                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=bhaskar
                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=divyabhaskar.co.in
                                                                                                                            if (a.domCmp(["bhaskar.com', 'divyabhaskar.co.in"])) { 
                                                                                                                                //Inject CSS
                                                                                                                                onAlways: function () {
                                                                                                                                    Aak.uw.openPopUpForBreakPage = function () { };
                                                                                                                                    Aak.uw.canABP = true;
                                                                                                                                    Aak.uw.canRunAds = true;
                                                                                                                                    Aak.uw.canCheckAds = true;
                                                                                                                                }

                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/446
                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/139
                                                                                                                                // issue: https://greasyfork.org/tr/forum/discussion/4282/
                                                                                                                                if (a.domCmp(["turkanime.tv"])) { 
                                                                                                                                    //Inject CSS
                                                                                                                                    onAlways: function () {
                                                                                                                                        Aak.uw.adblockblock = function () { };
                                                                                                                                        Aak.uw.BlokKontrol = {};
                                                                                                                                    }

                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/407
                                                                                                                                    if (a.domCmp(["wtfbit.ch"])) { 
                                                                                                                                        //Inject CSS
                                                                                                                                        onAlways: function () {
                                                                                                                                            Aak.uw.writeHTMLasJS = function () { };
                                                                                                                                        }

                                                                                                                                        // by: Robotex
                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=aranzulla.it
                                                                                                                                        // source: http://pastebin.com/yMM6YgxW
                                                                                                                                        if (a.domCmp(["aranzulla.it"])) { 
                                                                                                                                            //Inject CSS

                                                                                                                                            a.css('#abt1 + STYLE + div[id][class] {display:none;}");
                                                                                                                                            },
                                                                                                                                        onBeforeScript: function () {
                                                                                                                                            return [{
                                                                                                                                                contains: 'navigator.userAgent||navigator.vendor||window.opera',
                                                                                                                                                external: false,
                                                                                                                                                remove: true
                                                                                                                                            }
                                                                                                                                            ];
                                                                                                                                        }

                                                                                                                                        // note: canRunAds inverted value
                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=ndtv.com
                                                                                                                                        // test: http://tinyurl.com/hcfncdv
                                                                                                                                        if (a.domCmp(["ndtv.com"])) { 
                                                                                                                                            //Inject CSS

                                                                                                                                            Aak.setReadOnly('___p__p', 1);
                                                                                                                                            Aak.setReadOnly('getNoTopLatestNews', function () { });
                                                                                                                                        }

                                                                                                                                        // Reek, Giwayume
                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=lesechos.fr
                                                                                                                                        // source: http://pastebin.com/CMM8WGLj
                                                                                                                                        if (a.domCmp(["lesechos.fr', 'lesechos.com"])) { 
                                                                                                                                            //Inject CSS

                                                                                                                                            Aak.addScript(function () {
                                                                                                                                                Object.defineProperty(window, "checkAdBlock", {
                                                                                                                                                    value: function () { },
                                                                                                                                                    configurable: false,
                                                                                                                                                    writable: false
                                                                                                                                                });
                                                                                                                                            });
                                                                                                                                        },
                                                                                                                                        onAlways: function () {
                                                                                                                                            Aak.uw.call_Ad = 1;
                                                                                                                                            Aak.uw.paywall_adblock_article = function () { };
                                                                                                                                        }

                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/266
                                                                                                                                        if (a.domCmp(["bitvisits.com"])) { 
                                                                                                                                            //Inject CSS
                                                                                                                                            onAlways: function () {
                                                                                                                                                Aak.uw.blockAdblockUser = function () { };
                                                                                                                                            }

                                                                                                                                            // by: Alexander255, Reek, Giwayume
                                                                                                                                            // patch: http://pastebin.com/Q664diQ2
                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=exrapidleech
                                                                                                                                            // source: http://pastebin.com/5e27syjA
                                                                                                                                            if (a.domCmp(["exrapidleech.info"])) { 
                                                                                                                                                //Inject CSS


                                                                                                                                                var tomorrow = new Date();
                                                                                                                                                tomorrow.setDate(tomorrow.getDate() + 1);

                                                                                                                                                // prevent popup
                                                                                                                                                Aak.setCookie('popcashpuCap', 1);
                                                                                                                                                Aak.setCookie('popcashpu', 1);
                                                                                                                                                Aak.setCookie('nopopatall', tomorrow.getTime().toString());
                                                                                                                                                Aak.setCookie('noadvtday', 0);
                                                                                                                                                //Aak.setCookie('bv_DSKskdck_s1d', 'bvDSKskdcks1d");

                                                                                                                                                // hide notice
                                                                                                                                                a.css('div.alert.alert-danger.lead {opacity:0;}");

                                                                                                                                                // prevent redirect to verify page
                                                                                                                                                Aak.setReadOnly('bdvbnr_pid', []);
                                                                                                                                                Aak.setReadOnly('PopAds', 1);

                                                                                                                                                Aak.addScript(function () {
                                                                                                                                                    (function () {
                                                                                                                                                        // prevent popup
                                                                                                                                                        window.open = function () { };

                                                                                                                                                        // prevent redirect to verify page
                                                                                                                                                        var frame1 = document.createElement('iframe");
                                                                                                                                                        frame1.src = 'http://bdfrm.bidvertiser.com/BidVertiser.dbm?pid=383865&bid=1737418&RD=';
                                                                                                                                                        frame1.id = 'bdvi';
                                                                                                                                                        frame1.style = 'display:none';
                                                                                                                                                        document.documentElement.appendChild(frame1);
                                                                                                                                                    })();
                                                                                                                                                });
                                                                                                                                            }

                                                                                                                                            // note: also killed by AakList
                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=vipbox
                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=vipleague
                                                                                                                                            // source: http://pastebin.com/NERVzHzS
                                                                                                                                            host: ["vipleague.is", "vipleague.ws", "vipleague.tv", "vipleague.se", "vipleague.tv", "vipleague.me", "vipleague.mobi", "vipleague.co", "vipleague.sx", "vipleague.ch", "vipbox.tv", "vipbox.co", "vipbox.biz", "vipbox.sx", "vipbox.eu", "vipbox.so", "vipbox.nu", "vipboxsa.co", "strikeout.co", "strikeout.me", "homerun.re", "vipboxtv.co", "vipapp.me"],

                                                                                                                                                Aak.uw.iExist = true;
                                                                                                                                            Aak.setCookie('xclsvip', 1);
                                                                                                                                            a.css(".vip_052x003 { height: 250px; }");
                                                                                                                                            a.css(".vip_09x827 { height: 26px; }");
                                                                                                                                            a.css("#overlay { display: none; }");
                                                                                                                                        }

                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=zoomtv.me
                                                                                                                                        // source: http://pastebin.com/m4zAXGcw
                                                                                                                                        if (a.domCmp(["zoomtv.me"])) { 
                                                                                                                                            //Inject CSS
                                                                                                                                            onAlways: function () {
                                                                                                                                                Aak.uw.iaxpEnabled = true;
                                                                                                                                            }

                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/292
                                                                                                                                            // +abp rule
                                                                                                                                            if (a.domCmp(["vg.no', 'e24.no"])) { 
                                                                                                                                                //Inject CSS
                                                                                                                                                onAlways: function () {
                                                                                                                                                    Aak.uw.__AB__ = function () { };
                                                                                                                                                }

                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/947
                                                                                                                                                // source: http://pastebin.com/7TPPkq12
                                                                                                                                                if (a.domCmp(["pornve.com"])) { 
                                                                                                                                                    //Inject CSS
                                                                                                                                                    onAlways: function () {
                                                                                                                                                        Aak.uw.adxjwupdate = 1;
                                                                                                                                                    }

                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1114
                                                                                                                                                    if (a.domCmp(["lol.moa.tw"])) { 
                                                                                                                                                        //Inject CSS
                                                                                                                                                        onIdle: function () {
                                                                                                                                                            Aak.addScript(function () {
                                                                                                                                                                var MoaObj = MoaObj || {};
                                                                                                                                                                MoaObj.ad = MoaObj.ad || {};
                                                                                                                                                                MoaObj.ad.hasAdblock = function () {
                                                                                                                                                                    return false;
                                                                                                                                                                };
                                                                                                                                                                MoaObj.ad.checkABP = function () {
                                                                                                                                                                    return false;
                                                                                                                                                                };
                                                                                                                                                            });
                                                                                                                                                        }

                                                                                                                                                        // by: Watilin
                                                                                                                                                        // note: alternative solution
                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=multiup.org
                                                                                                                                                        if (a.domCmp(["multiup.org"])) { 
                                                                                                                                                            //Inject CSS

                                                                                                                                                            Aak.setCookie('visit', 1); // prevent popup
                                                                                                                                                            Aak.setReadOnly('hi', function () { });
                                                                                                                                                        }

                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/107
                                                                                                                                                        if (a.domCmp(["dailybitcoins.org"])) { 
                                                                                                                                                            //Inject CSS
                                                                                                                                                            onIdle: function () {
                                                                                                                                                                Aak.removeElement('.ad-img");
                                                                                                                                                                }

                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/414
                                                                                                                                                            if (a.domCmp(["kozaczek.pl', 'zeberka.pl"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                Aak.setCookie('ablc', 1);
                                                                                                                                                                Aak.setCookie('cookie_policy', 1);
                                                                                                                                                            }

                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/887
                                                                                                                                                            // source: http://pastebin.com/TFB1dtgb
                                                                                                                                                            if (a.domCmp(["spankwire.com', 'keezmovies.com', 'extremetube.com', 'mofosex.com"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                Aak.setCookie("abClosed", "true");
                                                                                                                                                                Aak.setCookie("hide_ad_msg", "1");
                                                                                                                                                            }

                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/887
                                                                                                                                                            // source: http://pastebin.com/TFB1dtgb
                                                                                                                                                            if (a.domCmp(["youporn.com', 'youporngay.com"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                Aak.setCookie("adblock_message", "closed");
                                                                                                                                                            }

                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=citationmachine.net
                                                                                                                                                            if (a.domCmp(["citationmachine.net"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                Aak.setCookie("sbm_cm_citations", 0);
                                                                                                                                                            }

                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/153
                                                                                                                                                            if (a.domCmp(["psarips.com"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                a.bait("div", "#advert");
                                                                                                                                                            }

                                                                                                                                                            if (a.domCmp(["extratorrent.cc', 'extratorrent.com"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                // prevent popup
                                                                                                                                                                // source are obfuscated in external js
                                                                                                                                                                Aak.setCookie('ppu_delay', 1);
                                                                                                                                                                Aak.setCookie('ppu_main', 1);
                                                                                                                                                                Aak.setCookie('ppu_sub', 1);
                                                                                                                                                                Aak.setCookie('ppu_show_on', 1);
                                                                                                                                                            }

                                                                                                                                                            if (a.domCmp(["tny.cz', 'pasted.co"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                // prevent popup
                                                                                                                                                                Aak.setCookie('__.popunderCap', 1);
                                                                                                                                                                Aak.setCookie('__.popunder', 1);
                                                                                                                                                            }
                                                                                                                                                            // two antiadblock
                                                                                                                                                            if (a.domCmp(["clubedohardware.com.br"])) { 
                                                                                                                                                                //Inject CSS

                                                                                                                                                                if (Aak.contains(location.host, 'forum')) {
                                                                                                                                                                    // Solution 1
                                                                                                                                                                    Aak.addStyle("#banner, script { height: 51px; }");
                                                                                                                                                                    a.bait("div", "#banner");
                                                                                                                                                                } else { // Website
                                                                                                                                                                    // Solution 1
                                                                                                                                                                    a.bait("div", ".banner_topo");
                                                                                                                                                                }
                                                                                                                                                            },
                                                                                                                                                            onIdle: function () {
                                                                                                                                                                if (Aak.contains(location.host, 'forum')) {
                                                                                                                                                                    // Solution 2
                                                                                                                                                                    Aak.uw.addBlocking.hide();
                                                                                                                                                                    Aak.uw.addBlocking.kill();
                                                                                                                                                                } else { // Website
                                                                                                                                                                    // Solution 2
                                                                                                                                                                    document.body.id = '';
                                                                                                                                                                    Aak.removeElement('.adblock");
                                                                                                                                                                    }
                                                                                                                                                            }

                                                                                                                                                            if (a.domCmp(["debrastagi.com"])) { 
                                                                                                                                                                //Inject CSS
                                                                                                                                                                onIdle: function () {
                                                                                                                                                                    Aak.removeElement('#stp-main");
                                                                                                                                                                    Aak.removeElement('#stp-bg");
                                                                                                                                                                }

                                                                                                                                                                if (a.domCmp(["ddlfrench.org"])) { 
                                                                                                                                                                    //Inject CSS
                                                                                                                                                                    onIdle: function () {
                                                                                                                                                                        // Fix bug display content
                                                                                                                                                                        Aak.setElement('#dle-content .d-content', {
                                                                                                                                                                            'class': ''
                                                                                                                                                                        });
                                                                                                                                                                        Aak.setElement('#content', {
                                                                                                                                                                            'id': ''
                                                                                                                                                                        });
                                                                                                                                                                    }

                                                                                                                                                                    if (a.domCmp(["mega-debrid.eu"])) { 
                                                                                                                                                                        //Inject CSS
                                                                                                                                                                        onEnd: function () {
                                                                                                                                                                            // Activate button debrid
                                                                                                                                                                            Aak.setElement('.realbutton', {
                                                                                                                                                                                'onclick': '',
                                                                                                                                                                                'type': 'submit'
                                                                                                                                                                            });
                                                                                                                                                                        }

                                                                                                                                                                        // by: Alexander255
                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1333
                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/515
                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/296
                                                                                                                                                                        // demo: http://slideplayer.fr/slide/1304026/#
                                                                                                                                                                        if (a.domCmp(["slideplayer.*"])) { 
                                                                                                                                                                            //Inject CSS
                                                                                                                                                                            onEnd: function () {

                                                                                                                                                                                // Disable anti-adblocker
                                                                                                                                                                                Aak.uw.force_remove_ads = true;

                                                                                                                                                                                // Circumvent "share to download" rule
                                                                                                                                                                                Aak.addScript(function () {
                                                                                                                                                                                    var slide_id = window.get_current_slide_id();
                                                                                                                                                                                    var slide_srv = document.getElementById("player_frame").src.split("/")[3];
                                                                                                                                                                                    var time = 86400 + Math.floor(Date.now() / 1000);
                                                                                                                                                                                    var secret = encodeURIComponent(window.strtr(window.MD5.base64("secret_preved slideplayer never solved " + time + slide_id + ".ppt"), "+/", "- "));

                                                                                                                                                                                    var url = "http://player.slideplayer.org/download/" + slide_srv + "/" + slide_id + "/" + secret + "/" + time + "/" + slide_id + ".ppt";
                                                                                                                                                                                    var links = document.querySelectorAll("a.download_link");
                                                                                                                                                                                    for (var i = 0; i < links.length; i++) {
                                                                                                                                                                                        /* Remove original "share to download" popup event listener */
                                                                                                                                                                                        var events = $._data(links[i]).events.click;
                                                                                                                                                                                        events.splice(0, events.length);

                                                                                                                                                                                        /* Set normal link href instead */
                                                                                                                                                                                        links[i].href = url;
                                                                                                                                                                                    }
                                                                                                                                                                                });

                                                                                                                                                                            }

                                                                                                                                                                            if (a.domCmp(["bokepspot.com"])) { 
                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                // Hide Disclaimer
                                                                                                                                                                                Aak.setCookie('hideDialog', 'hide");
                                                                                                                                                                                },
                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                // Remove Disable AdBlock
                                                                                                                                                                                Aak.removeElement('#tupiklan");
                                                                                                                                                                                }

                                                                                                                                                                            if (a.domCmp(["picload.org"])) { 
                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                Aak.setCookie('pl_adblocker', false);
                                                                                                                                                                            },
                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                Aak.uw.ads_loaded = true;
                                                                                                                                                                                Aak.uw.imageAds = false;
                                                                                                                                                                                Aak.removeElement('div[oncontextmenu="return false;"]");
                                                                                                                                                                                }

                                                                                                                                                                            if (a.domCmp(["freezedownload.com"])) { 
                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                    if (/freezedownload.com\/download\//.test(location.href)) {
                                                                                                                                                                                        Aak.removeElement('body > div[id]");
                                                                                                                                                                                        }
                                                                                                                                                                                }

                                                                                                                                                                                // issue: PM
                                                                                                                                                                                // source: http://pastebin.com/1Lw60h6k
                                                                                                                                                                                if (a.domCmp(["monnsutogatya.com"])) { 
                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                    onIdle: function () {
                                                                                                                                                                                        a.css("#site-box {display:block;}");
                                                                                                                                                                                        Aak.removeElement('#for-ad-blocker");
                                                                                                                                                                                        }

                                                                                                                                                                                    if (a.domCmp(["rapid8.com"])) { 
                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                            Aak.removeElement('div.backk + #blcokMzg");
                                                                                                                                                                                            Aak.removeElement('div.backk");
                                                                                                                                                                                        }

                                                                                                                                                                                        if (a.domCmp(["turkdown.com"])) { 
                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                // remove facebook box
                                                                                                                                                                                                Aak.removeElement('#duyuru");
                                                                                                                                                                                                }

                                                                                                                                                                                            if (a.domCmp(["filmovizija.me', 'filmovizija.com', 'filmovizija.in', 'filmovizija.net"])) { 
                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                    /*
                                                                                                                                                                                                    var d = new Date();
                                                                                                                                                                                                    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                                                                                                                                                                                    var n = weekday[d.getDay()];
                                                                                                                                                                                                    Aak.setElement('#' + n, {
                                                                                                                                                                                                    html : ''
                                                                                                                                                                                                    });
                                                                                                                                                                                                    Aak.removeElement('#' + n);
                                                                                                                                                                                                     */
                                                                                                                                                                                                }

                                                                                                                                                                                                // by: Alexander255
                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=hackintosh.zone
                                                                                                                                                                                                // source: http://paste2.org/DnB9Oj4f
                                                                                                                                                                                                if (a.domCmp(["hackintosh.zone"])) { 
                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                    onIdle: function () {

                                                                                                                                                                                                        var head = document.getElementsByTagName("head")[0];
                                                                                                                                                                                                        // Fake Google ad frame content
                                                                                                                                                                                                        var ad1 = document.createElement("ins");
                                                                                                                                                                                                        ad1.className = "adsbygoogle";
                                                                                                                                                                                                        ad1.appendChild(document.createTextNode("AAK"));
                                                                                                                                                                                                        head.insertBefore(ad1, head.childNodes[0]);

                                                                                                                                                                                                        /*
                                                                                                                                                                                                        // Fake CleanMyMac ad frame size
                                                                                                                                                                                                        var ad2 = document.createElement("div");
                                                                                                                                                                                                        ad2.id  = "nycuhevgqi";
                                                                                                                                                                                                        Object.defineProperty(ad2.wrappedJSObject, 'clientHeight', {value: 1});
                                                                                                                                                                                                        head.insertBefore(ad2, head.childNodes[0]);
                                                                                                                                                                                                         */

                                                                                                                                                                                                        var elems = document.querySelectorAll('.adsensegrey");
                                                                                                                                                                                                        for (var i = 0; i < elems.length; i++) {
                                                                                                                                                                                                            var node = document.createElement("img");
                                                                                                                                                                                                            node.src = Aak.imgBait;
                                                                                                                                                                                                            elems[i].appendChild(node);
                                                                                                                                                                                                        }

                                                                                                                                                                                                    }/*, //This is useless and significantly impact performance
                onBeforeScript: function () {
                    return [{
                        contains: 'disable ADBlock completely',
                        external: false,
                        remove: true
                    }
                    ];
                }*/

                                                                                                                                                                                                    if (a.domCmp(["privateinsta.com"])) { 
                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                                            // + abp rule
                                                                                                                                                                                                            Aak.uw.dont_scroll = false;
                                                                                                                                                                                                            Aak.removeElement("#overlay_div");
                                                                                                                                                                                                            Aak.removeElement("#overlay_main_div");
                                                                                                                                                                                                        }

                                                                                                                                                                                                        if (a.domCmp(["risiko-gesundheit.de"])) { 
                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                                setTimeout(function () {
                                                                                                                                                                                                                    window.stop();
                                                                                                                                                                                                                }, 5000);
                                                                                                                                                                                                            }

                                                                                                                                                                                                            if (a.domCmp(["oneplaylist.eu.pn"])) { 
                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                    // kill popunder
                                                                                                                                                                                                                    Aak.uw.makePopunder = false;
                                                                                                                                                                                                                }

                                                                                                                                                                                                                // note: script obfuscated line 1110
                                                                                                                                                                                                                // issue: https://greasyfork.org/forum/discussion/8576
                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1067
                                                                                                                                                                                                                // source: http://pastebin.com/qf46bN3z
                                                                                                                                                                                                                // source: http://pastebin.com/RwHyF0NL
                                                                                                                                                                                                                if (a.domCmp(["onmeda.de"])) { 
                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                        Aak.uw.$ADP = true;
                                                                                                                                                                                                                        Aak.uw.sas_callAd = function () { };
                                                                                                                                                                                                                        Aak.uw.sas_callAds = function () { };
                                                                                                                                                                                                                    }

                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/599
                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/563
                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/526
                                                                                                                                                                                                                    if (a.domCmp(["turbodebrideur.com"])) { 
                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                                                            Aak.createElement({
                                                                                                                                                                                                                                tag: 'div',
                                                                                                                                                                                                                                id: 'pubdirecte',
                                                                                                                                                                                                                                html: '<img  src="' + Aak.imgBait + '"/><a  href="#">&nbsp;</a>',
                                                                                                                                                                                                                                append: 'body'
                                                                                                                                                                                                                            });
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1256
                                                                                                                                                                                                                        if (a.domCmp(["rockfile.eu"])) { 
                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                                                Aak.createElement({
                                                                                                                                                                                                                                    tag: 'iframe',
                                                                                                                                                                                                                                    src: 'about:blank',
                                                                                                                                                                                                                                    style: 'visibility:hidden;',
                                                                                                                                                                                                                                    append: 'body'
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }

                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/932
                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/469
                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/277
                                                                                                                                                                                                                            // v3: http://pastebin.com/0gh8LMGH
                                                                                                                                                                                                                            // note: no solution, anti-adblock difficult to bypass --> http://pastebin.com/1NRq7WvZ
                                                                                                                                                                                                                            if (a.domCmp(["linkbucks.com', 'miniurls.co', 'picbucks.com', 'picturesetc.net', 'placepictures.com', 'poontown.net', 'qqc.co', 'qvvo.com', 'realfiles.net', 'rqq.co', 'seriousdeals.net', 'seriousfiles.com', 'seriousurls.com', 'sexpalace.gs', 'theseblogs.com', 'thesefiles.com', 'theseforums.com', 'thosegalleries.com', 'tinybucks.net', 'tinylinks.co', 'tnabucks.com', 'tubeviral.com', 'uberpicz.com', 'ubervidz.com', 'ubucks.net', 'ugalleries.net', 'ultrafiles.net', 'urlbeat.net', 'urlpulse.net', 'whackyvidz.com', 'youfap.me', 'yyv.co', 'zxxo.net', 'zff.co', 'linkbucksdns.co', 'miniurls.com', 'dyo.gs', 'goneviral.com', 'eafyfsuh.net', 'sasontnwc.net"])) { 
                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                // do nothing...
                                                                                                                                                                                                                            }

                                                                                                                                                                                                                            // issue:
                                                                                                                                                                                                                            if (a.domCmp(["referencemega.com', 'fpabd.com', 'crackacc.com"])) { 
                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                // Skip visitScript when site use CloudFlare Rocket Script
                                                                                                                                                                                                                                Aak.setCookie('_lbGatePassed', true);
                                                                                                                                                                                                                            }

                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=link.tl
                                                                                                                                                                                                                            // issue: https://greasyfork.org/fr/forum/discussion/8437
                                                                                                                                                                                                                            // source: http://pastebin.com/1MkCnmL7
                                                                                                                                                                                                                            if (a.domCmp(["link.tl"])) { 
                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                a.css('.adblock { height:1px; }");
                                                                                                                                                                                                                                Aak.uw.adblocker = false;
                                                                                                                                                                                                                            }

                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1382
                                                                                                                                                                                                                            // source: http://pastebin.com/EiARVQXt
                                                                                                                                                                                                                            if (a.domCmp(["wstream.video"])) { 
                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                a.css('#adiv { height:4px; }");
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                            if (a.domCmp(["4shared.com"])) { 
                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                                    // Hide "Disable AdBlodk" messages
                                                                                                                                                                                                                                    document.querySelector('body').classList.remove("jsBlockDetect");
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                if (a.domCmp(["pro-zik.ws', 'pro-tect.ws', 'pro-ddl.ws', 'pro-sport.ws"])) { 
                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                    Aak.setCookie('visitedf', true);
                                                                                                                                                                                                                                    Aak.setCookie('visitedh', true);
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                if (a.domCmp(["comptoir-hardware.com"])) { 
                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                                        Aak.uw.adblock = 'non';
                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/657
                                                                                                                                                                                                                                    // note: also solution to AakList
                                                                                                                                                                                                                                    if (a.domCmp(["bakersfield.com"])) { 
                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                        onAlways: function () {
                                                                                                                                                                                                                                            Aak.uw.AD_SLOT_RENDERED = true;
                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=ekstrabladet
                                                                                                                                                                                                                                        // source: http://pastebin.com/R029XpCr
                                                                                                                                                                                                                                        if (a.domCmp(["ekstrabladet.dk', 'eb.dk"])) { 
                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                            onAlways: function () {
                                                                                                                                                                                                                                                Aak.uw.ADTECH = {};
                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1451
                                                                                                                                                                                                                                            // issue: https://greasyfork.org/forum/discussion/9328
                                                                                                                                                                                                                                            // source: http://pastebin.com/EBVZg3VB
                                                                                                                                                                                                                                            if (a.domCmp(["pcgames-download.net"])) { 
                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                onAlways: function () {
                                                                                                                                                                                                                                                    Aak.setCookie('noAdblockNiceMessage', 1);
                                                                                                                                                                                                                                                    Aak.uw.mgCanLoad30547 = true;
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                // note: also killed by AakList
                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/590
                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/245
                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/215
                                                                                                                                                                                                                                                if (a.domCmp(["lachainemeteo.com"])) { 
                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                                                        Aak.uw.js_loaded = true;
                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/997
                                                                                                                                                                                                                                                    // source: http://pastebin.com/RQnCEYK6
                                                                                                                                                                                                                                                    if (a.domCmp(["mac4ever.com"])) { 
                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                        onAlways: function () {
                                                                                                                                                                                                                                                            Aak.uw.coquinou = function () { };
                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=5278bbs.com
                                                                                                                                                                                                                                                        if (a.domCmp(["5278bbs.com"])) { 
                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                            onAlways: function () {
                                                                                                                                                                                                                                                                Aak.uw.myaabpfun12 = function () { };
                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues?q=thesimsresource.com
                                                                                                                                                                                                                                                            // source: http://pastebin.com/DE9rbjxY
                                                                                                                                                                                                                                                            if (a.domCmp(["thesimsresource.com"])) { 
                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                onAlways: function () {
                                                                                                                                                                                                                                                                    Aak.uw.gadsize = true;
                                                                                                                                                                                                                                                                    Aak.uw.iHaveLoadedAds = true;
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                if (a.domCmp(["yellowbridge.com"])) { 
                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                                                                        Aak.uw.finalizePage = function () {
                                                                                                                                                                                                                                                                            return;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1366
                                                                                                                                                                                                                                                                    // source: http://pastebin.com/UzsiX0FK
                                                                                                                                                                                                                                                                    if (a.domCmp(["game-debate.com"])) { 
                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                        onAlways: function () {
                                                                                                                                                                                                                                                                            Aak.uw.ad_block_test = function () { };
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        if (a.domCmp(["adscendmedia.com"])) { 
                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                            // adscendmedia - https://www.adscendmedia.com/
                                                                                                                                                                                                                                                                            var ref = document.createElement('a').href = document.referrer;
                                                                                                                                                                                                                                                                            var host = location.host;
                                                                                                                                                                                                                                                                            var path = location.pathname;
                                                                                                                                                                                                                                                                            if (Aak.contains(path, '/widget_adblock.php') && !Aak.contains(ref.host, host)) {
                                                                                                                                                                                                                                                                                // Auto report
                                                                                                                                                                                                                                                                                Aak.detected('Adscendmedia', ref.host, host);
                                                                                                                                                                                                                                                                                // Notification
                                                                                                                                                                                                                                                                                Aak.notification('You must subscribe to <b>AakList (Anti-Adblock Killer )</b> <a href="' + Aak.subscribeURL + '" target="_blank">Subscribe</a>");
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        if (a.domCmp(["adworkmedia.com', 'loxtk.com', 'contentlockingnetworks.com"])) { 
                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                            // AdWorkMedia - https://www.adworkmedia.com/
                                                                                                                                                                                                                                                                            var ref = document.createElement('a').href = document.referrer;
                                                                                                                                                                                                                                                                            var host = location.host;
                                                                                                                                                                                                                                                                            var path = location.pathname;
                                                                                                                                                                                                                                                                            if (Aak.contains(path, '/help/removeAB.php') && !Aak.contains(ref.host, host)) {
                                                                                                                                                                                                                                                                                // Auto report
                                                                                                                                                                                                                                                                                Aak.info('Adworkmedia', ref.host, host);
                                                                                                                                                                                                                                                                                // Notification
                                                                                                                                                                                                                                                                                Aak.notification('You must subscribe to <b>AakList (Anti-Adblock Killer )</b> <a href="' + Aak.subscribeURL + '" target="_blank">Subscribe</a>");
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                    // --------------------------------------------------------------------------------------------
                                                                                                                                                                                                                                                                    // Players
                                                                                                                                                                                                                                                                    // --------------------------------------------------------------------------------------------
                                                                                                                                                                                                                                                                    kissanime_com: {
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/451
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/381
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/302
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/257
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/178
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/196
                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/56
                                                                                                                                                                                                                                                                        if (a.domCmp(["kissanime.com', 'kissanime.to', 'kissanime.ru'],  //https://github.com/reek/anti-adblock-killer/issues/2828

                                                                                                                                                                                                                                                                            // Masking ads
                                                                                                                                                                                                                                                                        a.css('iframe[id^="adsIfrme"], .divCloseBut { display:none; }");
                                                                                                                                                                                                                                                                            // Solution 1
                                                                                                                                                                                                                                                                                    Aak.uw.DoDetect2 = null;
        },
                                                                                                                                                                                                                                                                    onIdle: function () {

                                                                                                                                                                                                                                                                        // Solution 1 abp rule
                                                                                                                                                                                                                                                                        // @@||kissanime.com^$elemhide

                                                                                                                                                                                                                                                                        var divContentVideo = document.querySelector('#divContentVideo");

                                                                                                                                                                                                                                                                        // Solution 2
                                                                                                                                                                                                                                                                        if (Aak.uw.DoDetect2) {
                                                                                                                                                                                                                                                                            Aak.uw.DoDetect2 = null;
                                                                                                                                                                                                                                                                        Aak.uw.CheckAdImage = null;
                                                                                                                                                                                                                                                                        Aak.info('Solution 2");
                                                                                                                                                                                                                                                                        } //Solution 3
                                                                                                                                                                                                                                                                else if (divContentVideo) {

                                                                                                                                                                                                                                                                    var divDownload = document.querySelector('#divDownload').cloneNode(true);

                                                                                                                                                                                                                                                                    setTimeout(function () {
                                                                                                                                                                                                                                                                        divContentVideo.innerHTML = '';
                                                                                                                                                                                                                                                                        Aak.uw.DoHideFake();
                                                                                                                                                                                                                                                                        divContentVideo.appendChild(divDownload);
                                                                                                                                                                                                                                                                        Aak.removeElement('iframe[id^="adsIfrme"], .divCloseBut");
                                                                                                                                                                                                                                                                        Aak.info('Solution 3");
                                                                                                                                                                                                                                                                    }, 5500);
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/488
                                                                                                                                                                                                                                                                if (a.domCmp(["kisscartoon.me', 'kisscartoon.se'], //https://github.com/reek/anti-adblock-killer/issues/2828
                                                                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                                                                        Aak.uw.xaZlE = function () { };
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                                                                    Aak.removeElement('iframe[id^="adsIfrme"]");
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=openload
                                                                                                                                                                                                                                                                if (a.domCmp(["openload.co', 'openload.io', 'openload.tv"])) { 
                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                    Aak.uw.adblock = false;
                                                                                                                                                                                                                                                                    Aak.uw.adblock2 = false;
                                                                                                                                                                                                                                                                    Aak.uw.popAdsLoaded = true;
                                                                                                                                                                                                                                                                    // hide fake play button used to open popunder
                                                                                                                                                                                                                                                                    //Aak.addStyle('#videooverlay { display:none; }')
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=youwatch
                                                                                                                                                                                                                                                                // test: http://youwatch.org/embed-59p7i3cdkse0-453x320.html
                                                                                                                                                                                                                                                                // test: http://youwatch.org/59p7i3cdkse0
                                                                                                                                                                                                                                                                if (a.domCmp(["youwatch.org', 'chouhaa.info', 'ahzahg6ohb.com', 'ahzahg6ohb.com"])) { 
                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                    // skip anti-adblock
                                                                                                                                                                                                                                                                    Aak.uw.adsShowPopup1 = 1;
                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                                                                    // renove ads + fake play button
                                                                                                                                                                                                                                                                    Aak.removeElement('#player_imj, #player_imj + div[id]");
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                // by: Watilin
                                                                                                                                                                                                                                                                // pull: https://github.com/reek/anti-adblock-killer/pull/519
                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=exashare.com
                                                                                                                                                                                                                                                                // test:  http://exashare.com/galw2ge2kzsv
                                                                                                                                                                                                                                                                if (a.domCmp(["exashare.com', 'chefti.info', 'bojem3a.info', 'ajihezo.info', 'yahmaib3ai.com', 'yahmaib3ai.com"])) { 
                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                    // skip anti-adblock
                                                                                                                                                                                                                                                                    Aak.uw.adsShowPopup1 = 1;
                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                                                                    // renove ads + fake play button
                                                                                                                                                                                                                                                                    Aak.removeElement('#player_gaz, #player_gaz + div[id]");
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/190
                                                                                                                                                                                                                                                                if (a.domCmp(["an1me.se"])) { 
                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                    onIdle: function () {
                                                                                                                                                                                                                                                                        setTimeout(function () {
                                                                                                                                                                                                                                                                            Aak.uw.isBlockAds2 = false;
                                                                                                                                                                                                                                                                        }, 10000);
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                    // putlocker.is
                                                                                                                                                                                                                                                                    if (a.domCmp(["hqq.tv"])) { 
                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                                                                                                            // + abp rule
                                                                                                                                                                                                                                                                            // http://hqq.tv/player/embed_player.php?vid=R3DGHG3GKXX7&autoplay=no
                                                                                                                                                                                                                                                                            if ('/player/embed_player.php' == location.pathname) {
                                                                                                                                                                                                                                                                                document.querySelector('form[id^="form-"]').submit();
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                    

                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1010
                                                                                                                                                                                                                                                                        // source: http://pastebin.com/7G2RBnqq
                                                                                                                                                                                                                                                                    if (a.domCmp(["moje-filmy.tk', 'moje-filmy.live"])) { 
                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                                                                                                var searchvalue = ['var playerInstance', '});'];
                                                                                                                                                                                                                                                                                var script = Aak.hasScript(searchvalue[0]);

                                                                                                                                                                                                                                                                                if (script) {
                                                                                                                                                                                                                                                                                    var source = script.innerHTML;
                                                                                                                                                                                                                                                                                    var str = source.substring(source.lastIndexOf(searchvalue[0]), source.lastIndexOf(searchvalue[1]) + searchvalue[1].length);
                                                                                                                                                                                                                                                                                    Aak.addScript(str);
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                        // by: Marek
                                                                                                                                                                                                                                                                        // solution: http://tinyurl.com/ptb4ybg
                                                                                                                                                                                                                                                                        // issue. https://github.com/reek/anti-adblock-killer/issues/522
                                                                                                                                                                                                                                                                        // test: http://tinyurl.com/hz7gpxx
                                                                                                                                                                                                                                                                        if (a.domCmp(["ipla.tv"])) { 
                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                                                                                                a.css('.html5-player-wrapper { display:none; }'); // chrome/opera
                                                                                                                                                                                                                                                                                var oldPlayer = document.querySelector('.html5-player-wrapper, #vod-player");
                                                                                                                                                                                                                                                                                Aak.request({
                                                                                                                                                                                                                                                                                    url: '/VOD/play-in-ipla/' + location.href.match(/\/vod-(\d+)/)[1],
                                                                                                                                                                                                                                                                                    onload: function (result) {
                                                                                                                                                                                                                                                                                        var videoURL;
                                                                                                                                                                                                                                                                                        var res = result.responseText;
                                                                                                                                                                                                                                                                                        var idn = res.match(/ipla:\/\/playvod-1\|([a-z0-9]+)/)[1];
                                                                                                                                                                                                                                                                                        Aak.log(idn);
                                                                                                                                                                                                                                                                                        Aak.request({
                                                                                                                                                                                                                                                                                            url: 'http://getmedia.redefine.pl/vods/get_vod/?cpid=1&ua=mipla/23&media_id=' + idn,
                                                                                                                                                                                                                                                                                            onload: function (result) {
                                                                                                                                                                                                                                                                                                var res = result.responseText;
                                                                                                                                                                                                                                                                                                var o = JSON.parse(res);
                                                                                                                                                                                                                                                                                                Aak.log(o);
                                                                                                                                                                                                                                                                                                if (o.vod.video_hd) {
                                                                                                                                                                                                                                                                                                    videoURL = o.vod.video_hd;
                                                                                                                                                                                                                                                                                                } else if (o.vod.video) {
                                                                                                                                                                                                                                                                                                    videoURL = o.vod.video;
                                                                                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                                                                                    videoURL = o.vod.copies[0].url;
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                Player.videojs(oldPlayer, {
                                                                                                                                                                                                                                                                                                    source: videoURL,
                                                                                                                                                                                                                                                                                                    type: 'mp4',
                                                                                                                                                                                                                                                                                                    width: 820,
                                                                                                                                                                                                                                                                                                    height: 450,
                                                                                                                                                                                                                                                                                                    autoplay: false
                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/914
                                                                                                                                                                                                                                                                        // source: http://pastebin.com/yGSPBRqe
                                                                                                                                                                                                                                                                        if (a.domCmp(["koscian.net"])) { 
                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                                                                                                var elems = document.querySelectorAll('.ban");
                                                                                                                                                                                                                                                                                for (var i = 0; i < elems.length; i++) {
                                                                                                                                                                                                                                                                                    elems[i].remove();
                                                                                                                                                                                                                                                                                    //elems[i].innerHTML = '<br>';
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                        // France
                                                                                                                                                                                                                                                                        playtv_fr: { // research solution
                                                                                                                                                                                                                                                                            if (a.domCmp(["play.tv', 'playtv.fr"])) { 
                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                onAlways: function () { },
                                                                                                                                                                                                                                                                                onEnd: function () { }
                                                                                                                                                                                                                                                                                // webradio
                                                                                                                                                                                                                                                                                if (a.domCmp(["rmcsport.bfmtv.com"])) { 
                                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                                    onIdle: function () {

                                                                                                                                                                                                                                                                                        var flashvars = {
                                                                                                                                                                                                                                                                                            urlRadio: "http://mp3lg4.tdf-cdn.com/10160/rmc.mp3",
                                                                                                                                                                                                                                                                                            nom: "live",
                                                                                                                                                                                                                                                                                            categorie: "live",
                                                                                                                                                                                                                                                                                            urlSmart: "" // set empty to remove audio ad
                                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                                        var params = {
                                                                                                                                                                                                                                                                                            wmode: "transparent"
                                                                                                                                                                                                                                                                                        };

                                                                                                                                                                                                                                                                                        Aak.uw.swfobject.embedSWF("/swf/RMCLIVE.swf", "liveplayer", "70", "90", "10.0.0", "", flashvars, params);
                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                    if (a.domCmp(["eclypsia.com"])) { 
                                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                                        onAlways: function () {
                                                                                                                                                                                                                                                                                            // Solution 1
                                                                                                                                                                                                                                                                                            // abp rules

                                                                                                                                                                                                                                                                                            // Solution 2
                                                                                                                                                                                                                                                                                            Aak.uw.isABActivated = function () {
                                                                                                                                                                                                                                                                                                return false;
                                                                                                                                                                                                                                                                                            }; // Kill antiadblock
                                                                                                                                                                                                                                                                                            Aak.uw.refresh_iframe = function () { }; // Stop ads to be loaded
                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                        onEnd: function () {
                                                                                                                                                                                                                                                                                            // Solution 3
                                                                                                                                                                                                                                                                                            var element = document.querySelector('div[id^="webtv_iframe_"]");
                                                                                                                                                                                                                                                                                            if (element !== null) {
                                                                                                                                                                                                                                                                                                var videoId = element.id.split('_')[2];
                                                                                                                                                                                                                                                                                                setTimeout(function () {
                                                                                                                                                                                                                                                                                                    element.innerHTML = '<iframe frameborder="0" width="812" height="500" src="http://www.dailymotion.com/embed/video/' + videoId + '?logo=0&autoPlay=1&autoMute=0"></iframe>';
                                                                                                                                                                                                                                                                                                }, 1000);
                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/461
                                                                                                                                                                                                                                                                                        // test: http://tinyurl.com/ptn2vrl
                                                                                                                                                                                                                                                                                        if (a.domCmp(["m6web.fr"])) { 
                                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                                            onEnd: function () {
                                                                                                                                                                                                                                                                                                var player = document.querySelector('object[id$="_flash_api"]");
                                                                                                                                                                                                                                                                                                var script = Aak.hasScript('M6.Player.config");

                                                                                                                                                                                                                                                                                                if (player !== null && script !== null) {
                                                                                                                                                                                                                                                                                                    var found = script.innerHTML.match(/M6.Player.config = (\{.+\});/);
                                                                                                                                                                                                                                                                                                    var config = JSON.parse(found.pop());

                                                                                                                                                                                                                                                                                                    // Replace player
                                                                                                                                                                                                                                                                                                    var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                    Player.videojs(player.parentNode, {
                                                                                                                                                                                                                                                                                                        source: config.sources[1].src,
                                                                                                                                                                                                                                                                                                        type: 'mp4',
                                                                                                                                                                                                                                                                                                        autoplay: false
                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                            if (a.domCmp(["gamingroom.tv"])) { 
                                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                                onAlways: function () {
                                                                                                                                                                                                                                                                                                    Aak.uw.adblock_detect = function () { };
                                                                                                                                                                                                                                                                                                    Aak.uw.GR_adblock_hide_video = function () { };
                                                                                                                                                                                                                                                                                                    Aak.uw.adblock_video_msg_start = function () { };
                                                                                                                                                                                                                                                                                                    Aak.uw.adblock_video_msg_stop = function () { };
                                                                                                                                                                                                                                                                                                    Aak.uw.disable_chat = function () { };
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1541
                                                                                                                                                                                                                                                                                                // test: http://tinyurl.com/h7ccvqq
                                                                                                                                                                                                                                                                                                if (a.domCmp(["rtl.de"])) { 
                                                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                                                    onIdle: function () {
                                                                                                                                                                                                                                                                                                        Array.prototype.slice.call(document.querySelectorAll('div[data-widget="video"]')).map(function (video) {
                                                                                                                                                                                                                                                                                                            var cfg = Aak.intoObject(video.dataset.playerLayerCfg);
                                                                                                                                                                                                                                                                                                            var file = cfg.videoinfo.mp4url;
                                                                                                                                                                                                                                                                                                            Aak.log(video, cfg, file);

                                                                                                                                                                                                                                                                                                            // Replace player
                                                                                                                                                                                                                                                                                                            var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                            Player.videojs(video, {
                                                                                                                                                                                                                                                                                                                source: file,
                                                                                                                                                                                                                                                                                                                type: 'mp4',
                                                                                                                                                                                                                                                                                                                autoplay: false
                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/76
                                                                                                                                                                                                                                                                                                    // test: http://tinyurl.com/lto9pyd
                                                                                                                                                                                                                                                                                                    if (a.domCmp(["myspass.de"])) { 
                                                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                                                                                                                                            var videoid = location.pathname.match(/\/(\d+)\/$/);

                                                                                                                                                                                                                                                                                                            if (videoid !== null) {
                                                                                                                                                                                                                                                                                                                Aak.request({
                                                                                                                                                                                                                                                                                                                    url: 'http://www.myspass.de/myspass/includes/apps/video/getvideometadataxml.php?id=' + videoid[1],
                                                                                                                                                                                                                                                                                                                    onload: function (result) {
                                                                                                                                                                                                                                                                                                                        var res = result.responseText;
                                                                                                                                                                                                                                                                                                                        Aak.log(res);

                                                                                                                                                                                                                                                                                                                        // Get video
                                                                                                                                                                                                                                                                                                                        var parser = new window.DOMParser();
                                                                                                                                                                                                                                                                                                                        var dom = parser.parseFromString(res, "application/xml");
                                                                                                                                                                                                                                                                                                                        var file = dom.getElementsByTagName("url_flv").item(0).textContent;

                                                                                                                                                                                                                                                                                                                        // Remove elements
                                                                                                                                                                                                                                                                                                                        Aak.removeElement('div.loadingGif");

                                                                                                                                                                                                                                                                                                                        // Replace player
                                                                                                                                                                                                                                                                                                                        var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                                        Player.videojs('#player', {
                                                                                                                                                                                                                                                                                                                            source: file,
                                                                                                                                                                                                                                                                                                                            type: 'mp4',
                                                                                                                                                                                                                                                                                                                            autoplay: false
                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                        // test: http://tinyurl.com/l2zkv3d
                                                                                                                                                                                                                                                                                                        if (a.domCmp(["rtlxl.nl', 'rtlnieuws.nl"])) { 
                                                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                                                            onEnd: function () {
                                                                                                                                                                                                                                                                                                                var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                                Player.editing('#_rtlosmf0', {
                                                                                                                                                                                                                                                                                                                    setFlashvars: {
                                                                                                                                                                                                                                                                                                                        adblock: false
                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1495
                                                                                                                                                                                                                                                                                                            if (a.domCmp(["play.radio1.se', 'play.bandit.se', 'play.lugnafavoriter.com', 'play.rixfm.se"])) { 
                                                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                                                onEnd: function () {
                                                                                                                                                                                                                                                                                                                    Aak.addScript(function () {
                                                                                                                                                                                                                                                                                                                        setTimeout(function () {
                                                                                                                                                                                                                                                                                                                            window.player_load_live(window.stream_id);
                                                                                                                                                                                                                                                                                                                        }, 1000);
                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1463
                                                                                                                                                                                                                                                                                                                if (a.domCmp(["dplay.com', 'dplay.dk', 'dplay.se"])) { 
                                                                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                                                                    var date = new Date();
                                                                                                                                                                                                                                                                                                                    date.setDate(date.getDate() + 365);
                                                                                                                                                                                                                                                                                                                    var timestamp = date.getTime().toString();
                                                                                                                                                                                                                                                                                                                    var value = JSON.stringify({
                                                                                                                                                                                                                                                                                                                        "notificationSubmission": "submitted",
                                                                                                                                                                                                                                                                                                                        "reportingExpiry": timestamp,
                                                                                                                                                                                                                                                                                                                        "notificationExpiry": timestamp
                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                    Aak.setCookie('dsc-adblock', value);
                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                // note: skip video ads + anti-adblock
                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=tv3play
                                                                                                                                                                                                                                                                                                                /* test: http://www.tv3play.no/programmer/redningsskoyta hds/hls
                                                                                                                                                                                                                                                                                                                           http://www.tv3play.dk/programmer/linse-og-didde-ekstra hds/hls
                                                                                                                                                                                                                                                                                                                           http://www.tv3play.se/program/glamourama hds/hls
                                                                                                                                                                                                                                                                                                                           http://www.tv6play.se/program/99-saker-man-maste-gora-innan-man-dor hds/hls
                                                                                                                                                                                                                                                                                                                           http://www.tv8play.se/program/efterlyst--1 hds/hls
                                                                                                                                                                                                                                                                                                                           http://www.tv10play.se/program/garpens-europa hds/hls
                                                                                                                                                                                                                                                                                                                           http://tvplay.skaties.lv/parraides/tv3-zinas hds/hls
                                                                                                                                                                                                                                                                                                                           http://play.tv3.lt/programos/beatos-virtuve rtmp/hls
                                                                                                                                                                                                                                                                                                                           http://tv3play.tv3.ee/sisu/puhapaev-sepoga rtmp/hls */
                                                                                                                                                                                                                                                                                                                if (a.domCmp(["tv3play.no', 'tv3play.dk', 'tv3play.se', 'tv6play.se', 'tv8play.se', 'tv10play.se', 'tvplay.skaties.lv', 'play.tv3.lt', 'tv3play.tv3.ee"])) { 
                                                                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                                                                    onIdle: function () {
                                                                                                                                                                                                                                                                                                                        Aak.hasElement('#video-player', function (thisElement) {
                                                                                                                                                                                                                                                                                                                            thisElement.id = '';
                                                                                                                                                                                                                                                                                                                            //var videoId = location.pathname.split('/').pop();
                                                                                                                                                                                                                                                                                                                            var videoId = thisElement.getAttribute('data-video-id");
                                                                                                                                                                                                                                                                                                                            Aak.log(thisElement, videoId);

                                                                                                                                                                                                                                                                                                                            // get video sources
                                                                                                                                                                                                                                                                                                                            Aak.request({
                                                                                                                                                                                                                                                                                                                                url: 'http://playapi.mtgx.tv/v3/videos/stream/' + videoId,
                                                                                                                                                                                                                                                                                                                                onload: function (result) {
                                                                                                                                                                                                                                                                                                                                    var res = result.responseText;
                                                                                                                                                                                                                                                                                                                                    var obj = JSON.parse(res);
                                                                                                                                                                                                                                                                                                                                    Aak.log(obj);

                                                                                                                                                                                                                                                                                                                                    /* Innholdet du prøver å se er kun tilgjengelig for brukere i Norge
                                                                                                                                                                                                                                                                                                                                    Programmet er blokeret for visning fra denne geografiske position.
                                                                                                                                                                                                                                                                                                                                    Programą galite matyti tik jungdamiesi iš Lietuvos interneto tiekėjų tinklų */
                                                                                                                                                                                                                                                                                                                                    if (obj.msg) {
                                                                                                                                                                                                                                                                                                                                        return thisElement.innerHTML = obj.msg;
                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                    if (location.host === 'tv3play.tv3.ee') {
                                                                                                                                                                                                                                                                                                                                        var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                                                        Player.grindplayer(thisElement, {
                                                                                                                                                                                                                                                                                                                                            source: obj.streams.medium,
                                                                                                                                                                                                                                                                                                                                            type: 'rtmp/mp4',
                                                                                                                                                                                                                                                                                                                                            autoplay: true
                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                                                                                                                        // create video tag for new player
                                                                                                                                                                                                                                                                                                                                        Aak.createElement({
                                                                                                                                                                                                                                                                                                                                            tag: 'video',
                                                                                                                                                                                                                                                                                                                                            id: 'noAdPlayer',
                                                                                                                                                                                                                                                                                                                                            classid: 'video-js vjs-default-skin',
                                                                                                                                                                                                                                                                                                                                            width: thisElement.clientWidth || 730,
                                                                                                                                                                                                                                                                                                                                            height: thisElement.clientHeight || 410,
                                                                                                                                                                                                                                                                                                                                            preload: 'auto',
                                                                                                                                                                                                                                                                                                                                            controls: true,
                                                                                                                                                                                                                                                                                                                                            autoplay: true,
                                                                                                                                                                                                                                                                                                                                            replace: thisElement
                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                        // parse sources
                                                                                                                                                                                                                                                                                                                                        var srcArray = [];
                                                                                                                                                                                                                                                                                                                                        if (obj.streams.high && obj.streams.high !== '') {
                                                                                                                                                                                                                                                                                                                                            srcArray.push({
                                                                                                                                                                                                                                                                                                                                                type: "video/mp4", // mp4
                                                                                                                                                                                                                                                                                                                                                src: obj.streams.high
                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                        } if (obj.streams.hls && obj.streams.hls !== '') {
                                                                                                                                                                                                                                                                                                                                            srcArray.push({
                                                                                                                                                                                                                                                                                                                                                type: "application/x-mpegURL", // m3u8
                                                                                                                                                                                                                                                                                                                                                src: obj.streams.hls
                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                        } if (obj.streams.medium && obj.streams.medium !== '') {
                                                                                                                                                                                                                                                                                                                                            var type = obj.streams.medium.indexOf('rtmp') === 0 ? 'rtmp/mp4' : 'application/f4m+xml';
                                                                                                                                                                                                                                                                                                                                            srcArray.push({
                                                                                                                                                                                                                                                                                                                                                type: type,
                                                                                                                                                                                                                                                                                                                                                src: obj.streams.medium
                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                        Aak.log(srcArray, JSON.stringify(srcArray));

                                                                                                                                                                                                                                                                                                                                        // initialize new player
                                                                                                                                                                                                                                                                                                                                        Aak.addScript(Aak.intoString(function () {
                                                                                                                                                                                                                                                                                                                                            (function () {
                                                                                                                                                                                                                                                                                                                                                function onVjsReady() {
                                                                                                                                                                                                                                                                                                                                                    if (typeof window.videojs !== 'function') {
                                                                                                                                                                                                                                                                                                                                                        onVjsReady();
                                                                                                                                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                                                                                                                                        window.videojs("noAdPlayer").src(/_SOURCES_/);
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                onVjsReady();
                                                                                                                                                                                                                                                                                                                                            })();
                                                                                                                                                                                                                                                                                                                                        }).replace("/_SOURCES_/", JSON.stringify(srcArray)));
                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                    // note: redirect to http://block.streams.tv/
                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["firstrow.co', 'firstrows.ru', 'firstrows.tv', 'firstrows.org', 'firstrows.co', 'firstrows.biz', 'firstrowus.eu', 'firstrow1us.eu', 'firstsrowsports.eu', 'firstrowsportes.tv', 'firstrowsportes.com', 'justfirstrowsports.com', 'hahasport.me', 'wiziwig.ru', 'wiziwig.sx', 'wiziwig.to', 'wiziwig.tv', 'myp2p.biz', 'myp2p.tv', 'myp2p.la', 'myp2p.ec', 'myp2p.eu', 'myp2p.sx', 'myp2p.ws', 'myp2p.com', 'atdhe.ru', 'atdhe.se', 'atdhe.bz', 'atdhe.top', 'atdhe.to', 'atdhe.me', 'atdhe.mx', ' atdhe.li', 'atdhe.al"])) { 
                                                                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                                                                        onAlways: function () {
                                                                                                                                                                                                                                                                                                                            Aak.setCookie("adb", 1); // prevent anti-adblock
                                                                                                                                                                                                                                                                                                                            Aak.uw.open = function () { }; // prevent popup
                                                                                                                                                                                                                                                                                                                            a.css("#bannerInCenter, #hiddenBannerCanvas { display: none; }"); // hide ads
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        // note: disable refcontrol, used by firstrowsports
                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1268
                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1243
                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/889
                                                                                                                                                                                                                                                                                                                        // issue: https://greasyfork.org/forum/discussion/8975
                                                                                                                                                                                                                                                                                                                        // source: http://pastebin.com/8VTrkvS9
                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["buzina.xyz', 'farmet.info', 'rimladi.com', 'kitorelo.com', 'omnipola.com', 'porosin.co.uk', 'rimleno.com', 'simple4alls.com', 'arsopo.com"])) { 
                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                            a.css("#adsframe { height: 151px; }");
                                                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                                                                                                                                                            if (/buzina.xyz/.test(location.host)) { // keeps same host stream
                                                                                                                                                                                                                                                                                                                                Aak.hasElement('iframe[src*=".php?hash="]', function (thisElement) {
                                                                                                                                                                                                                                                                                                                                    // http://arsopo.com/w2.php?hash=panda58
                                                                                                                                                                                                                                                                                                                                    // http://www.buzina.xyz/nana1v1.php?onthetop
                                                                                                                                                                                                                                                                                                                                    var parts = thisElement.src.split('/");
                                                                                                                                                                                                                                                                                                                                    parts[2] = Aak.rules.buzina_xyz.host.pop();
                                                                                                                                                                                                                                                                                                                                    Aak.log(thisElement, parts);
                                                                                                                                                                                                                                                                                                                                    thisElement.src = parts.join('/");

                                                                                                                                                                                                                                                                                                                                    /*	dmFyIG8gPSB7CgkJCSAgICAicGxheWxpc3QiIDogW3sKCQkJICAgICAgICAicHJvdmlkZXIiIDogInJ0bXAiLAoJCQkgICAgICAgICJ1cmwiIDogInBhbmRhMT9lJTNEMTQ2NTA3MDMyNiUyNnN0JTNEUHJ0SFl5dkJ6ZDlaZDdoRF9mUkhUZzExMTEzMCIKCQkJICAgICAgfQoJCQkgICAgXSwKCQkJICAgICJwbHVnaW5zIiA6IHsKCQkJICAgICAgInJ0bXAiIDogewoJCQkgICAgICAgICJ1cmwiIDogImZsb3dwbGF5ZXIucnRtcC0zLjIuMTEuc3dmIiwgCgkJCQkJLy8idXJsIjogImh0dHA6Ly9yZWxlYXNlcy5mbG93cGxheWVyLm9yZy9zd2YvZmxvd3BsYXllci5ydG1wLTMuMi4xMS5zd2YiLAoJCQkgICAgICAgICJuZXRDb25uZWN0aW9uVXJsIiA6ICJydG1wOi8vMTg1LjgyLjIxNS40NTozNTc5L3ZvZC8iCgkJCSAgICAgIH0sCgkJCSAgICAgICJjb250cm9scyIgOiB7CgkJCQkgICAgInVybCI6ICJodHRwOi8vcmVsZWFzZXMuZmxvd3BsYXllci5vcmcvc3dmL2Zsb3dwbGF5ZXIuY29udHJvbHMtMy4yLjE2LnN3ZiIsIC8vIGFkZGVkIGJlY2F1c2UgbWlzc2luZwoJCQkgICAgICAgICJwbGF5IiA6IGZhbHNlLAoJCQkgICAgICAgICJzY3J1YmJlciIgOiBmYWxzZQoJCQkgICAgICB9CgkJCSAgICB9LAoJCQkgICAgInBsYXllcklkIiA6ICJwbGF5ZXIiLAoJCQkgICAgImNsaXAiIDogewoJCQkgICAgICAidXJsIiA6ICJwYW5kYTE/ZSUzRDE0NjUwNzAzMjYlMjZzdCUzRFBydEhZeXZCemQ5WmQ3aERfZlJIVGcxMTExMzAiCgkJCSAgICB9CgkJCSAgfQoKCQkJICB2YXIgbmV3VXJsID0gcGFydHMuc2xpY2UoMCwgMykuam9pbignLycpICsgJy9mbG93cGxheWVyLTMuMi4xNi5zd2Y/Y29uZmlnPScgKyBlc2NhcGUoSlNPTi5zdHJpbmdpZnkobykpOwoJCQkgIC8vdmFyIG5ld1VybCA9ICdodHRwOi8vcmVsZWFzZXMuZmxvd3BsYXllci5vcmcvc3dmL2Zsb3dwbGF5ZXItMy4yLjE2LnN3Zj9jb25maWc9JyArIGVzY2FwZShKU09OLnN0cmluZ2lmeShvKSk7CgkJCSAgY29uc29sZS5sb2cobmV3VXJsKTsKCQkJICB0aGlzRWxlbWVudC5zcmMgPSBuZXdVcmw7
                                                                                                                                                                                                                                                                                                                                    */

                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                            } else { // skip anti-adblock
                                                                                                                                                                                                                                                                                                                                Aak.removeElement('#adsframe");
                                                                                                                                                                                                                                                                                                                                Aak.getElement('#remove-over').click();
                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        // note: obfuscated
                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/274
                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["allmyvideos.net', 'amvtv.net"])) { 
                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                            // skip fake play button
                                                                                                                                                                                                                                                                                                                            Aak.setCookie('_favbt33', 1);
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["ilive.to', 'streamlive.to"])) { 
                                                                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                                                                            onEnd: function () {
                                                                                                                                                                                                                                                                                                                                if (/^\/embedplayer.php/i.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                    setTimeout(function () {
                                                                                                                                                                                                                                                                                                                                        // Skip timer
                                                                                                                                                                                                                                                                                                                                        Aak.uw.removeOverlayHTML();
                                                                                                                                                                                                                                                                                                                                    }, 1000);
                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["micast.tv"])) { 
                                                                                                                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                                                                                                                // prevent popunder
                                                                                                                                                                                                                                                                                                                                Aak.setCookie('vid_main', true);
                                                                                                                                                                                                                                                                                                                                Aak.setCookie('vid_sub', true);
                                                                                                                                                                                                                                                                                                                                // remove overlay
                                                                                                                                                                                                                                                                                                                                Aak.addScript(function () {
                                                                                                                                                                                                                                                                                                                                    window.onload = function () {
                                                                                                                                                                                                                                                                                                                                        if (window.removeOverlayHTML)
                                                                                                                                                                                                                                                                                                                                            window.removeOverlayHTML();
                                                                                                                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["pxstream.tv"])) { 
                                                                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                                                                onEnd: function () {
                                                                                                                                                                                                                                                                                                                                    if (/^\/embedrouter.php/.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                        setTimeout(function () {
                                                                                                                                                                                                                                                                                                                                            // Skip timer and close ads
                                                                                                                                                                                                                                                                                                                                            Aak.uw.closeAd();
                                                                                                                                                                                                                                                                                                                                        }, 1000);
                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                if (a.domCmp(["sawlive.tv"])) { 
                                                                                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                                                                                    onIdle: function () {
                                                                                                                                                                                                                                                                                                                                        if (/^\/embed\/watch\//i.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                            // Skip timer and close ads
                                                                                                                                                                                                                                                                                                                                            Aak.uw.display = false;
                                                                                                                                                                                                                                                                                                                                            Aak.uw.closeMyAd();
                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["goodcast.co"])) { 
                                                                                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                                                                                        onIdle: function () {
                                                                                                                                                                                                                                                                                                                                            if (/^\/stream.php/.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                                // remove ads allowed by easylist
                                                                                                                                                                                                                                                                                                                                                Aak.uw.$(".advertisement").hide();
                                                                                                                                                                                                                                                                                                                                                Aak.uw.$('.adsky iframe').attr("src", "about:blank");
                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["showsport-tv.com"])) { 
                                                                                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                                                                                            onIdle: function () {
                                                                                                                                                                                                                                                                                                                                                if (/^\/ch.php/.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                                    // remove ads allowed by easylist
                                                                                                                                                                                                                                                                                                                                                    Aak.removeElement('#advertisement, .advertisement");
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["sharecast.to"])) { 
                                                                                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                                                                                                                                                    if (/^\/embed.php/.test(location.pathname)) {

                                                                                                                                                                                                                                                                                                                                                        // Disable popunders
                                                                                                                                                                                                                                                                                                                                                        var interval = setInterval(function () {
                                                                                                                                                                                                                                                                                                                                                            Aak.setCookie('vid_main', true);
                                                                                                                                                                                                                                                                                                                                                            Aak.setCookie('vid_sub', 2);
                                                                                                                                                                                                                                                                                                                                                            Aak.setCookie('vid_delay', true);
                                                                                                                                                                                                                                                                                                                                                        }, 100);

                                                                                                                                                                                                                                                                                                                                                        setTimeout(function () {
                                                                                                                                                                                                                                                                                                                                                            clearInterval(interval);
                                                                                                                                                                                                                                                                                                                                                        }, 5000);

                                                                                                                                                                                                                                                                                                                                                        // Remove transparent overlay
                                                                                                                                                                                                                                                                                                                                                        Aak.removeElement('#table1");
                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=videomega
                                                                                                                                                                                                                                                                                                                                                if (a.domCmp(["videomega.tv"])) { 
                                                                                                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                                                                                                    if (/^\/view.php/.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                                        // prevent popunder
                                                                                                                                                                                                                                                                                                                                                        Aak.setCookie('vid_mainpu', true);
                                                                                                                                                                                                                                                                                                                                                        Aak.setCookie('vid_subpu', true);
                                                                                                                                                                                                                                                                                                                                                        Aak.setCookie('vid_delay', true);
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                onEnd: function () {
                                                                                                                                                                                                                                                                                                                                                    // kill abc
                                                                                                                                                                                                                                                                                                                                                    // fix bug on firefox: The video could not be loaded, either because the server or network failed or because the format is not supported.
                                                                                                                                                                                                                                                                                                                                                    var script = Aak.hasScript('Please disable AdBlock Plugin to watch the video");
                                                                                                                                                                                                                                                                                                                                                    if (script) {
                                                                                                                                                                                                                                                                                                                                                    var source = script.innerHTML;
                                                                                                                                                                                                                                                                                                                                                    var substring = source.substring(source.lastIndexOf('eval('), source.lastIndexOf(')') + 1);
                                                                                                                                                                                                                                                                                                                                                    var deobfuscated = Aak.unpackScript(substring);
                                                                                                                                                                                                                                                                                                                                                    var newScript = 'if(' + deobfuscated.substring(deobfuscated.indexOf('true'));
                                                                                                                                                                                                                                                                                                                                                    Aak.addScript(newScript);
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["videofun.me', 'videobug.net', 'video44.net', 'play44.net', 'byzoo.org', 'playbb.me', 'videowing.me', 'videozoo.me', 'easyvideo.me', 'playpanda.net"])) { 
                                                                                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                                                                                onEnd: function () {

                                                                                                                                                                                                                                                                                                                                                    /*
                                                                                                                                                                                                                                                                                                                                                    http://www.animetoon.tv/black-lagoon-episode-1
                                                                                                                                                                                                                                                                                                                                                    http://videowing.me/embed?w=718&h=438&video=ongoing/yu-gi-oh_arc-v_-_53.mp4
                                                                                                                                                                                                                                                                                                                                                    http://playbb.me/embed.php?w=718&h=438&vid=at/nw/yu-gi-oh_arc-v_-_53.mp4
                                                                                                                                                                                                                                                                                                                                                    http://videozoo.me/embed.php?w=718&h=438&vid=at/nw/yu-gi-oh_arc-v_-_53.mp4
                                                                                                                                                                                                                                                                                                                                                    http://www.easyvideo.me/gogo/?w=718&h=438&file=yu-gi-oh_arc-v_-_53.mp4&sv=1
                                                                                                                                                                                                                                                                                                                                                    http://playpanda.net/embed.php?w=718&h=438&vid=at/nw/yu-gi-oh_arc-v_-_53.mp4
                                                                                                                                                                                                                                                                                                                                                     */

                                                                                                                                                                                                                                                                                                                                                    // allow fullscreen when abp is enabled and remove ad layer
                                                                                                                                                                                                                                                                                                                                                    // ads blocked by abp rule
                                                                                                                                                                                                                                                                                                                                                    if (/^\/(embed|gogo|gplus)/.test(location.pathname)) {
                                                                                                                                                                                                                                                                                                                                                        var Player = new Aak.player();
                                                                                                                                                                                                                                                                                                                                                        Player.editing('#flowplayer_api', {
                                                                                                                                                                                                                                                                                                                                                            setAttributes: {
                                                                                                                                                                                                                                                                                                                                                                allowfullscreen: true
                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues?q=label:R3Z
                                                                                                                                                                                                                                                                                                                                                // source: http://pastebin.com/C159kevn
                                                                                                                                                                                                                                                                                                                                                if (a.domCmp(["cityam.com', 'computerworlduk.com', 'techworld.com', 'v3.co.uk"])) { 
                                                                                                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                                                                                                    /* don't work with chrome
                                                                                                                                                                                                                                                                                                                                                    Object.defineProperty(Aak.uw, '_r3z', {
                                                                                                                                                                                                                                                                                                                                                      enumerable : true,
                                                                                                                                                                                                                                                                                                                                                      writable : false,
                                                                                                                                                                                                                                                                                                                                                      value : {}
                                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                    */
                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                onIdle: function () {
                                                                                                                                                                                                                                                                                                                                                    Aak.uw.$("#r3z-wait").remove();
                                                                                                                                                                                                                                                                                                                                                    Aak.uw.$(".r3z-hide").removeClass("r3z-hide");
                                                                                                                                                                                                                                                                                                                                                    Aak.uw._r3z = null;
                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                // issue: https://greasyfork.org/en/forum/messages/405
                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1343
                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1342
                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/831
                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1274
                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/1262
                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/561
                                                                                                                                                                                                                                                                                                                                                if (a.domCmp(["next-episode.net', 'kingmaker.news', 'gamespowerita.com', 'todayidol.com', 'receive-a-sms.com', 'wakeupcallme.com', 'ringmycellphone.com', 'faqmozilla.org', 'thememypc.com"])) { 
                                                                                                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                                                                                                                                                        Aak.uw.google_jobrunner = {};
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                // fuckadbock customized
                                                                                                                                                                                                                                                                                                                                                fab_dawn_com: {
                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1747
                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["dawn.com"])) { 
                                                                                                                                                                                                                                                                                                                                                        //Inject CSS

                                                                                                                                                                                                                                                                                                                                                        Aak.fakeFuckAdBlock('detectAdBlock', 'DetectAdBlock");
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1217
                                                                                                                                                                                                                                                                                                                                                    // source: http://pastebin.com/SpEN5duS
                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["sports.fr"])) { 
                                                                                                                                                                                                                                                                                                                                                        //Inject CSS

                                                                                                                                                                                                                                                                                                                                                        Aak.fakeFuckAdBlock('fabInstance', 'FabInstance");
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1188
                                                                                                                                                                                                                                                                                                                                                    // source: http://pastebin.com/ULe1vzQR
                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["europe1.fr"])) { 
                                                                                                                                                                                                                                                                                                                                                        //Inject CSS

                                                                                                                                                                                                                                                                                                                                                        Aak.fakeFuckAdBlock('fabInstance', 'FabInstance");
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1177
                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["newyorker.com"])) { 
                                                                                                                                                                                                                                                                                                                                                        //Inject CSS

                                                                                                                                                                                                                                                                                                                                                        Aak.fakeFuckAdBlock('sniffAdBlock', 'SniffAdBlock");
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                    // note: fuckadblock with custom instance name
                                                                                                                                                                                                                                                                                                                                                    // note: also added abp rule
                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/1127
                                                                                                                                                                                                                                                                                                                                                    // issue: https://greasyfork.org/fr/forum/discussion/4132
                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/858
                                                                                                                                                                                                                                                                                                                                                    // source: https://mangas.zlx.com.br/mangazord_lib/js/lib/controllers/Leitor/Leitor.min.js
                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["mangasproject.com.br', 'mangasproject.net.br', 'mangas.zlx.com.br"])) { 
                                                                                                                                                                                                                                                                                                                                                        //Inject CSS

                                                                                                                                                                                                                                                                                                                                                        Aak.fakeFuckAdBlock('mangasLeitorSlider', Aak.generateID());
                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/739
                                                                                                                                                                                                                                                                                                                                                    // issue: https://github.com/reek/anti-adblock-killer/issues/705
                                                                                                                                                                                                                                                                                                                                                    // note: fuckadblock customized
                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["qnimate.com"])) { 
                                                                                                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                                                                                                        onAlways: function () {
                                                                                                                                                                                                                                                                                                                                                            Aak.uw.adBlockDetected = function () { };
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/858
                                                                                                                                                                                                                                                                                                                                                        // note: fuckadblock with custom instance name
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["eurotransport.de"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            Aak.fakeFuckAdBlock('antiAdBlock', Aak.generateID());
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // by: Skr4tchGr3azyMonkiBallllllZzzz
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/784
                                                                                                                                                                                                                                                                                                                                                        // note: fuckadblock with custom instance name
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["tzetze.it', 'beppegrillo.it', 'la-cosa.it"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            Aak.fakeFuckAdBlock('cadetect', 'CADetect");
                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                        // note: fuckadblock with custom instance name
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1257
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1135
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["agario.sx', 'agarabi.com"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            Aak.fakeFuckAdBlock('agario_SX_ads', Aak.generateID());
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // note: fuckadblock with custom instance name
                                                                                                                                                                                                                                                                                                                                                        // source: http://pastebin.com/YAS0As87
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1037
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["filespace.com"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            Aak.fakeFuckAdBlock('fAB', Aak.generateID());
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // note: fuckadblock with custom instance name
                                                                                                                                                                                                                                                                                                                                                        // source: http://pastebin.com/42tUQ9aV
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["topserialy.sk"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            Aak.fakeFuckAdBlock('sratNaVas', Aak.generateID());
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1455
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1657
                                                                                                                                                                                                                                                                                                                                                        // source: http://pastebin.com/N42a5BjE
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["epicurious.com', 'desktopsolution.org', 'indiatimes.com', 'hindustantimes.com', 'happytrips.com"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            Aak.addScript(function () {
                                                                                                                                                                                                                                                                                                                                                                (function () {
                                                                                                                                                                                                                                                                                                                                                                    var _setAttribute = window.Element.prototype.setAttribute;
                                                                                                                                                                                                                                                                                                                                                                    window.Element.prototype.setAttribute = function (name, value) {
                                                                                                                                                                                                                                                                                                                                                                        if (name == 'class' && value.indexOf('text_ads') != -1) {
                                                                                                                                                                                                                                                                                                                                                                            value = '';
                                                                                                                                                                                                                                                                                                                                                                            console.info(this, 'fab intercepted :-)");
                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                        _setAttribute.call(this, name, value);
                                                                                                                                                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                                                                                                                                                })();
                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // site: http://d3xt3r.com/anti-adblock
                                                                                                                                                                                                                                                                                                                                                        // case: http://sport-show.fr/js/advertisement-AdBlock.js
                                                                                                                                                                                                                                                                                                                                                        // case: http://www.2site.me/advertisement-AdBlock.js
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["sport-show.fr', 'vipflash.net', '2site.me"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS

                                                                                                                                                                                                                                                                                                                                                            a.css("#blockblockA {visibility:invisible;display:none;} #blockblockA td {visibility:invisible;display:none;} #blockblockA td p {visibility:invisible;display:none;} #blockblockB {visibility:visible;display:block;}");
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        // by: Skr4tchGr3azyMonkiBallllllZzzz
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1766
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1392
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/1039
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/592
                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues/813
                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["gametransfers.com', 'winandmac.com', 'free-steam-giveaways.com', 'canalwp.com', 'alphahistory.com', 'nordpresse.be', 'sospc.name', 'baboo.com.br"])) { 
                                                                                                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                                                                                                            onAlways: function () {
                                                                                                                                                                                                                                                                                                                                                                Aak.setCookie('anCookie', true);
                                                                                                                                                                                                                                                                                                                                                                Aak.uw.anOptions = {};
                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                            // site: http://lutteadblock.blogspot.com/2014/11/le-script.html
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/938
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/580
                                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["lewebtvbouquetfrancophone.overblog.com', 'webtv.bloguez.com', 'latelegratuite.blogspot.com', 'totaldebrid.org', '37.187.173.205', 'tvgratuite.blogspot.com"])) { 
                                                                                                                                                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                                                                                                                                                a.bait("div", "#my_ad_div");
                                                                                                                                                                                                                                                                                                                                                                Aak.uw.jabbahud = function () { };
                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                            // site: antiblock.org
                                                                                                                                                                                                                                                                                                                                                            // note: customized
                                                                                                                                                                                                                                                                                                                                                            // issue: 
                                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["mybank.pl', 'rapidgrab.pl"])) { 
                                                                                                                                                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                                                                                                                                                Aak.addScript(function () {
                                                                                                                                                                                                                                                                                                                                                                    (function () {
                                                                                                                                                                                                                                                                                                                                                                        var _addEventListener = window.addEventListener;
                                                                                                                                                                                                                                                                                                                                                                        window.addEventListener = function (type, listener, options) {
                                                                                                                                                                                                                                                                                                                                                                            if (listener.toString().indexOf('.nextFunction()}') > -1) {
                                                                                                                                                                                                                                                                                                                                                                                listener = function () {
                                                                                                                                                                                                                                                                                                                                                                                    console.info(['AntiAdbKiller', location.host, 'AntiBlock{customized}']);
                                                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                            _addEventListener.call(this, type, listener, options);
                                                                                                                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                                                                                                                    })();
                                                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                            // site: blockadblock.com
                                                                                                                                                                                                                                                                                                                                                            // note: random instance name
                                                                                                                                                                                                                                                                                                                                                            // source: https://gist.github.com/Watilin/af75e0a2e82a2efb384bde9c7b41dec8
                                                                                                                                                                                                                                                                                                                                                            // issues: https://github.com/reek/anti-adblock-killer/issues?q=label:BlockAdBlock
                                                                                                                                                                                                                                                                                                                                                            // issue: https://greasyfork.org/forum/discussion/8273
                                                                                                                                                                                                                                                                                                                                                            // issue: https://greasyfork.org/forum/discussion/7625
                                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["blockadblock.com', 'linkdrop.net', 'revclouds.com', 'leporno.org', 'uploadshub.com', 'dasolo.org', 'fullstuff.net', 'zeusnews.it', 'cheminots.net', 'lolsy.tv', 'animes-mangas-ddl.com', 'noticiasautomotivas.com.br', 'darkstars.org', 'corepacks.com', 'naturalbd.com', 'coolsoft.altervista.org', 'openload.us', 'cda-online.pl', 'urbanplanet.org', 'mamahd.com', 'sadeempc.com', 'avmoo.com', 'thailande-fr.com', 'btaia.com', 'tusoft.org', 'hisse.net', 'europeup.com', 'nrj.fr', 'srnk.co', 'animmex.co', 'socketloop.com', 'crackhex.com', 'revealedtricks4u.com', 'pizzamaking.com', 'computerworm.net', 'yourlifeupdated.net"])) { 
                                                                                                                                                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                                                                                                                                                Aak.addScript(function () {
                                                                                                                                                                                                                                                                                                                                                                    // variant 1
                                                                                                                                                                                                                                                                                                                                                                    (function () {
                                                                                                                                                                                                                                                                                                                                                                        var _setTimeout = window.setTimeout;
                                                                                                                                                                                                                                                                                                                                                                        window.setTimeout = function (fn, delay) {
                                                                                                                                                                                                                                                                                                                                                                            // console.log(fn.toString())
                                                                                                                                                                                                                                                                                                                                                                            if (typeof fn === 'string' && fn.indexOf('bab_elementid') > -1) {
                                                                                                                                                                                                                                                                                                                                                                                fn = function () {
                                                                                                                                                                                                                                                                                                                                                                                    console.info(['AntiAdbKiller', location.host, 'BlockAdBlock']);
                                                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                            _setTimeout.call(this, fn, delay);
                                                                                                                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                                                                                                                    })();
                                                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                            // by: Reek, Giwayume
                                                                                                                                                                                                                                                                                                                                                            // note: when adblock detected inject new ads, redirect to http://tinyurl.com/zq2z5o6
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1636
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1596
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1297
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1144
                                                                                                                                                                                                                                                                                                                                                            // issue: https://github.com/reek/anti-adblock-killer/issues/1542
                                                                                                                                                                                                                                                                                                                                                            // source: http://pastebin.com/8Ajitfb2
                                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["marketwatch.com', 'deadline.com', 'tweaktown.com', 'nypost.com', 'realgm.com', 'nasdaq.com"])) { 
                                                                                                                                                                                                                                                                                                                                                                //Inject CSS

                                                                                                                                                                                                                                                                                                                                                                a.css(".container--bannerAd, .col--ad { display: none; }");
                                                                                                                                                                                                                                                                                                                                                                Aak.addScript(function () {
                                                                                                                                                                                                                                                                                                                                                                    (function () {
                                                                                                                                                                                                                                                                                                                                                                        // Giwayume 
                                                                                                                                                                                                                                                                                                                                                                        window._sp_ = window._sp_ || {};
                                                                                                                                                                                                                                                                                                                                                                        window._sp_.config = window._sp_.config || {};
                                                                                                                                                                                                                                                                                                                                                                        Object.defineProperty(window._sp_.config, "content_control_callback", {
                                                                                                                                                                                                                                                                                                                                                                            value: function () { },
                                                                                                                                                                                                                                                                                                                                                                            writable: false,
                                                                                                                                                                                                                                                                                                                                                                            configurable: false
                                                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                                                        // Reek
                                                                                                                                                                                                                                                                                                                                                                        var _addEventListener = window.EventTarget.prototype.addEventListener;
                                                                                                                                                                                                                                                                                                                                                                        window.EventTarget.prototype.addEventListener = function (type, listener, options) {
                                                                                                                                                                                                                                                                                                                                                                            if (type == 'sp.blocking') {
                                                                                                                                                                                                                                                                                                                                                                                listener = function () {
                                                                                                                                                                                                                                                                                                                                                                                    console.info(['AntiAdbKiller', location.host, 'GPT{sp-blocking}']);
                                                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                            _addEventListener.call(this, type, listener, options);
                                                                                                                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                                                                                                                    })();
                                                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                            // note: when adblock detected inject new ads
                                                                                                                                                                                                                                                                                                                                                            // source: http://pastebin.com/0HD7N84i
                                                                                                                                                                                                                                                                                                                                                            if (a.domCmp(["commentcamarche.net', 'journaldesfemmes.com', 'linternaute.com"])) { 
                                                                                                                                                                                                                                                                                                                                                                //Inject CSS
                                                                                                                                                                                                                                                                                                                                                                onBeforeScript: function () {
                                                                                                                                                                                                                                                                                                                                                                    return [{
                                                                                                                                                                                                                                                                                                                                                                        detected: 'Krux{asl}',
                                                                                                                                                                                                                                                                                                                                                                        contains: 'Asl.prototype.inject',
                                                                                                                                                                                                                                                                                                                                                                        external: false,
                                                                                                                                                                                                                                                                                                                                                                        remove: true
                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                    ];
                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                // note: when adblock detected inject new ads
                                                                                                                                                                                                                                                                                                                                                                // source: 
                                                                                                                                                                                                                                                                                                                                                                if (a.domCmp(["fourchette-et-bikini.fr', 'meteocity.com"])) { 
                                                                                                                                                                                                                                                                                                                                                                    //Inject CSS

                                                                                                                                                                                                                                                                                                                                                                    Aak.uw.adProtect = 1;
                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                // note: when adblock detected inject new ads
                                                                                                                                                                                                                                                                                                                                                                // note: script anti-adblock obfuscated,
                                                                                                                                                                                                                                                                                                                                                                // issue: https://github.com/reek/anti-adblock-killer/issues/
                                                                                                                                                                                                                                                                                                                                                                // doc: http://tinyurl.com/gl3ghq2
                                                                                                                                                                                                                                                                                                                                                                // source: http://pastebin.com/hsAmdSuf
                                                                                                                                                                                                                                                                                                                                                                if (a.domCmp(["demo-phoenix.com', 'dpstream.net', 'gum-gum-streaming.com', 'jeu.info', 'sofoot.com', 'gaara-fr.com', 'gaytube.com', 'tuxboard.com', 'xstory-fr.com', 'hentaifr.net', 'filmstreaming-hd.com', 'filmvf.net', 'hentaihaven.org', 'narutoshippudenvf.com', 'thebadbuzz.com', 'manga-news.com', 'jeu.video', 'mangas-fr.com"])) { 
                                                                                                                                                                                                                                                                                                                                                                    //Inject CSS
                                                                                                                                                                                                                                                                                                                                                                    onAlways: function () {
                                                                                                                                                                                                                                                                                                                                                                        //Aak.uw.__$dc = function () {};
                                                                                                                                                                                                                                                                                                                                                                        a.css('body {visibility: visible;}");
                                                                                                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                                                                                                    onBeforeScript: function () {
                                                                                                                                                                                                                                                                                                                                                                        return [{
                                                                                                                                                                                                                                                                                                                                                                            detected: 'PhoenixGoyavelab',
                                                                                                                                                                                                                                                                                                                                                                            contains: 'PHENV',
                                                                                                                                                                                                                                                                                                                                                                            external: false,
                                                                                                                                                                                                                                                                                                                                                                            remove: true
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                        ];
                                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                                    // note: when adblock detected inject new ads
                                                                                                                                                                                                                                                                                                                                                                    // source: http://pastebin.com/cFQCp80W
                                                                                                                                                                                                                                                                                                                                                                    if (a.domCmp(["tvspielfilm.de', 'finanzen.ch"])) { 
                                                                                                                                                                                                                                                                                                                                                                        //Inject CSS
                                                                                                                                                                                                                                                                                                                                                                        onBeforeScript: function () {
                                                                                                                                                                                                                                                                                                                                                                            return [{
                                                                                                                                                                                                                                                                                                                                                                                detected: 'AdDefend{UABPInject}',
                                                                                                                                                                                                                                                                                                                                                                                contains: 'UABPInject',
                                                                                                                                                                                                                                                                                                                                                                                external: false,
                                                                                                                                                                                                                                                                                                                                                                                remove: true
                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                            ];
                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                        // note: when adblock detected inject new ads
                                                                                                                                                                                                                                                                                                                                                                        // userscript: https://openuserjs.org/scripts/schwarztee/AdDefend_Klatsche
                                                                                                                                                                                                                                                                                                                                                                        // userscript: https://gist.github.com/anonymous/a9b9956baf1d59a107c5
                                                                                                                                                                                                                                                                                                                                                                        // source: http://pastebin.com/1VyW0u9m, http://pastebin.com/AZqhRxWU
                                                                                                                                                                                                                                                                                                                                                                        // issue: https://github.com/reek/anti-adblock-killer/issues?q=label:AdDefend
                                                                                                                                                                                                                                                                                                                                                                        // pull: https://github.com/reek/anti-adblock-killer/pull/467
                                                                                                                                                                                                                                                                                                                                                                        if (a.domCmp(["watchgeneration.fr', 'turbo.fr', '24matins.fr', 'foot01.com', 'clubic.com', 'macg.co', 'begeek.fr', 'igen.fr', 'gamestar.de', 'focus.de', 'stern.de', 'sat1.', 'prosieben.', 'kabeleins.', 'sat1gold.', 'sixx.', 'prosiebenmaxx.', 'fem.com', 'the-voice-of-germany.', 'wetter.com', 'wetteronline.de', 'pcwelt.de', 'boerse-online.de', 'sportauto.de', 'auto-motor-und-sport.de', 'motor-klassik.de', '4wheelfun.de', 'autostrassenverkehr.de', 'lustich.de', 'spox.com', 'shz.de', 'transfermarkt.de', 'rp-online.de', 'motorradonline.de', '20min.ch', 'main-spitze.de', 'wormser-zeitung.de', 'lampertheimer-zeitung.de', 'wiesbdener-tagblatt.de', 'buerstaedter-zeitung.de', 'wiesbdener-kurier.de', 'rhein-main-presse.de', 'allgemeine-zeitung.de', 'ariva.de', 'spiegel.de', 'brigitte.de', 'dshini.net', 'gala.de', 'gamepro.de', 'gamona.de', 'pnn.de', 'promobil.de', 'sportal.de', 'webfail.com', 'computerbild.de', 'finanzen.net', 'comunio.de', 'medisite.fr"])) { 
                                                                                                                                                                                                                                                                                                                                                                            //Inject CSS
                                                                                                                                                                                                                                                                                                                                                                            onBeforeScript: function () {
                                                                                                                                                                                                                                                                                                                                                                                return [{
                                                                                                                                                                                                                                                                                                                                                                                    detected: 'AdDefend{uabInject}',
                                                                                                                                                                                                                                                                                                                                                                                    contains: 'uabInject',
                                                                                                                                                                                                                                                                                                                                                                                    external: false,
                                                                                                                                                                                                                                                                                                                                                                                    remove: true
                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                ];
                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                        }
