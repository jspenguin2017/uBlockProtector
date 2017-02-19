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

if (a.domCmp(["viafree.no", "viafree.dk",  "viafree.se", "tvplay.skaties.lv", "play.tv3.lt", "tv3play.tv3.ee"])) { 
    //Replace player
    var  onIdle= function () {
        Aak.hasElement('#video-player', function (thisElement) {
            thisElement.id = '';
            //var videoId = location.pathname.split('/').pop();
            var videoId = thisElement.getAttribute("data-video-id");
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
    };
}

// note: redirect to http://block.streams.tv/
if (a.domCmp(["firstrow.co', 'firstrows.ru', 'firstrows.tv', 'firstrows.org', 'firstrows.co', 'firstrows.biz', 'firstrowus.eu', 'firstrow1us.eu', 'firstsrowsports.eu', 'firstrowsportes.tv', 'firstrowsportes.com', 'justfirstrowsports.com', 'hahasport.me', 'wiziwig.ru', 'wiziwig.sx', 'wiziwig.to', 'wiziwig.tv', 'myp2p.biz', 'myp2p.tv', 'myp2p.la', 'myp2p.ec', 'myp2p.eu', 'myp2p.sx', 'myp2p.ws', 'myp2p.com', 'atdhe.ru', 'atdhe.se', 'atdhe.bz', 'atdhe.top', 'atdhe.to', 'atdhe.me', 'atdhe.mx', ' atdhe.li', 'atdhe.al"])) { 
    //Inject CSS
    onAlways: function () {
        a.cookie("adb", 1); // prevent anti-adblock
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
        a.cookie('_favbt33', 1);
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
            a.cookie('vid_main', true);
            a.cookie('vid_sub', true);
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
                                        a.cookie('vid_main', true);
                                        a.cookie('vid_sub', 2);
                                        a.cookie('vid_delay', true);
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
                                    a.cookie('vid_mainpu', true);
                                    a.cookie('vid_subpu', true);
                                    a.cookie('vid_delay', true);
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
                                            a.cookie('anCookie', true);
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
