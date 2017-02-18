elahmad_com: {
        host: ['elahmad.com'],
        onStart: function () {
            Aak.addStyle("#adblock { height: 1px; }");
        }
},
mrtzcmp3_net: {
        host: ['mrtzcmp3.net'],
        onStart: function () {
            Aak.addStyle(".rtm_ad { height: 1px; }");
        }
},
height_myTestAd: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1241
    // issue: https://github.com/reek/anti-adblock-killer/issues/983
    // issue: https://github.com/reek/anti-adblock-killer/issues/291
        host: ['bknime.com', 'go4up.com', 'debrido.com'],
        onStart: function () {
            Aak.addStyle(".myTestAd { height: 1px; }");
        }
},
debridfast_network: {
    // issue: https://greasyfork.org/en/forum/discussion/9406
    // issue: https://greasyfork.org/en/forum/discussion/7013
    // issue: https://github.com/reek/anti-adblock-killer/issues/1272
    // issue: https://github.com/reek/anti-adblock-killer/issues/769
        host: ['debridfast.com', 'getdebrid.com', 'debrid.us', 'leecher.us'],
        onStart: function () {
            Aak.addStyle(".myTestAd, .my24Ad, .nabil { height: 1px; }");
        },
        onIdle: function () {
            document.querySelector('#simpleAd').innerHTML = '<p style="display:none;">debridfast.com</p>';
        }
},
bg_gledai_tv: {
        host: ['bg-gledai.tv'],
        onStart: function () {
            Aak.addStyle(".myAd { height: 1px; }");
        }
},
thepcspy_com: { // http://thepcspy.com/read/how_to_block_adblock/
        host: ['thepcspy.com'],
        onStart: function () {
            Aak.addStyle(".myTestAd { height: 1px; }");
            Aak.addStyle(".blocked { display: none; }");
        },
        onIdle: function () {
            Aak.removeElement('.blocked');
        }
},
vg_e24_no: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/292
        host: ['vg.no', 'e24.no'],
        onStart: function () {
            // Add this rule, because EasyList allow all hidden elements.
            Aak.addStyle(".ad { display: none; }");
        }
},
automobile_sportive_com: {
        host: ['automobile-sportive.com'],
        onStart: function () {
            Aak.addStyle(".myTestAd { height: 51px; display: none; }");
        }
},
snsw_us: {
        host: ['snsw.us'],
        onStart: function () {
            Aak.addStyle("#ad_1 { height: 1px; }");
        }
},
urlchecker_net: {
        host: ['urlchecker.net'],
        onStart: function () {
            Aak.addStyle("#adchecker { height: 20px; }");
        }
},
skiplimite_tv: {
        host: ['skiplimite.tv'],
        onStart: function () {
            Aak.addStyle("div.addthis_native_toolbox + div[id] { height: 12px; }");
        }
},
filecore_co_nz: {
        host: ['filecore.co.nz'],
        onStart: function () {
            Aak.addStyle(".adsense { height: 5px; }");
        }
},
thomas_n_ruth_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1111
    // source: http://pastebin.com/fu7vkUA1
        host: ['thomas-n-ruth.com'],
        onStart: function () {
            Aak.addStyle(".Google { height: 5px; }");
        }
},
interfans_org: {
    // test: http://www.interfans.org/forum/
        host: ['interfans.org'],
        onStart: function () {
            Aak.addStyle(".ad_global_header { height: 1px; display: none; }");
        }
},
maxdebrideur_com: {
        host: ['maxdebrideur.com'],
        onStart: function () {
            Aak.addStyle(".clear + div[id] { height: 12px; }");
        }
},
topzone_it: {
        host: ['topzone.lt'],
        onStart: function () {
            Aak.addStyle(".forumAd { height: 1px; display: none; }");
        }
},
nana10_co_il: {
        host: ['.nana10.'],
        onStart: function () {
            Aak.addStyle("#advert-tracker { height: 1px; }");
        }
},
plej_tv: {
        host: ['plej.tv'],
        onStart: function () {
            Aak.addStyle(".advert_box { height: 1px; }");
        }
},
mangamint_com: {
    // note: added rule to allow ".ad728"
    // issue: https://greasyfork.org/id/forum/discussion/8524
        host: ['mangamint.com'],
        onStart: function () {
            Aak.addStyle(".ad728 { height: 31px; }");
        }
},
debrideurstream_fr: {
        host: ['debrideurstream.fr'],
        onStart: function () {
            Aak.addStyle("#content div[id][align=center] { height: 12px; }");
        }
},
preemlinks_com: {
        host: ['preemlinks.com'],
        onStart: function () {
            Aak.addStyle("#divads { height: 1px; }");
        }
},
hentai_to: {
        host: ['hentai.to'],
        onStart: function () {
            Aak.addStyle("#hentaito123 { height: 11px; }");
        }
},
prototurk_com: {
        host: ['prototurk.com'],
        onStart: function () {
            Aak.addStyle("#reklam { height: 1px; }");
        }
},
mufa_de: {
        host: ['mufa.de'],
        onStart: function () {
            Aak.addStyle("#leaderboard { height: 5px; }");
            Aak.addStyle("#large-rectangle { height: 5px; }");
            Aak.addStyle("#ad-header-468x60 { height: 5px; }");
        }
},
watcharab_com: {
        host: ['watcharab.com'],
        onStart: function () {
            // + adp rule watcharab.com#@##adblock
            Aak.addStyle("#adblock { height: 5px; }");
        }
},
freedomip_com: {
        host: ['freedom-ip.com'],
        onStart: function () {
            Aak.addStyle(".pub_vertical ins, .pub_vertical div { height: 11px; }");
        }
},
wakanim_tv: {
        host: ['wakanim.tv'],
        onStart: function () {
            Aak.addStyle("#detector { display: none; }");
            Aak.addStyle("#nopub { display: block; }");
        }
},
simply_debrid_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/332
    // source: http://pastebin.com/b7MAYXs4
        host: ['simply-debrid.com'],
        onStart: function () {
            Aak.uw.adsbygoogle = {};
            Aak.uw.adsbygoogle.loaded = true;
        }
},
manga9_com: {
        host: ['manga9.com', 'mangabee.co'],
        onStart: function () {
            Aak.addStyle(".adblock { height: 31px; }");
        }
},
onemanga2_com: {
        host: ['onemanga2.com'],
        onStart: function () {
            Aak.addStyle(".afs_ads { height: 5px; }");
        }
},
mangabird_com: {
        host: ['mangabird.com'],
        onStart: function () {
            Aak.addStyle(".afs_ads { height: 5px; }");
        }
},
kodilive_eu: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1528
    // source: http://pastebin.com/ZxvXKqtc
        host: ['kodilive.eu'],
        onStart: function () {
            Aak.addStyle(".Ad { height: 5px; }");
        }
},
backin_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=backin.net
        host: ['backin.net'],
        onStart: function () {
            Aak.addStyle("#divad { height: 31px; }");
        }
},
mobile_tracker_free_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1082
        host: ['mobile-tracker-free.com'],
        onStart: function () {
            Aak.addStyle("#myAds { height: 1px; }");
        }
},
workupload_com: {
    // note: obfuscated
    // issue: https://github.com/reek/anti-adblock-killer/issues/1334
    // issue: https://github.com/reek/anti-adblock-killer/issues/1290
    // source: http://pastebin.com/CPzd2Swx
        host: ['workupload.com'],
        onAlways: function () {
            Aak.addStyle(".adBlock, .adsbygoogle, #sad { height: 11px; }");
        }
},
today_in: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=intoday.in
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=businesstoday.in
    // source: http://pastebin.com/gz539G7m
        host: ["intoday.in", "businesstoday.in"],
        onStart: function () {
            Aak.addStyle('#adbocker_alt { display: none; }');
            Aak.uw.openPopup = function () { };
        }
},
jc_mp_com: {
    // by: Giwayume
    // issue: https://github.com/reek/anti-adblock-killer/issues/1597
        host: ["jc-mp.com"],
        onStart: function () {
            Aak.addStyle('.adsense {width: 1px; height: 1px; visibility: hidden; display: block; position: absolute;}');
        }
},
mariage_franco_marocain_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=mariage-franco-marocain.net
        host: ["mariage-franco-marocain.net"],
        onStart: function () {
            Aak.addStyle('#my_ad_div {height: 1px;}');
        }
},
happy_hack_ru: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=happy-hack.ru
        host: ['happy-hack.ru'],
        onStart: function () {
            Aak.addStyle("#blockblockF4 {visibility:invisible;display:none;} #blockblockF4 td {visibility:invisible;display:none;} #blockblockF4 td p {visibility:invisible;display:none;} #blockblockD3 {visibility:visible;display:block;}");
        }
},
forbes_com: {
    // by: Giwayume
    // issue: https://github.com/reek/anti-adblock-killer/issues/865
        host: ['forbes.com'],
        onStart: function () {
            if (window.location.pathname.indexOf('/welcome') > -1) {
                Aak.setCookie('welcomeAd', 'true', 86400000, '/');
                Aak.setCookie('dailyWelcomeCookie', 'true', 86400000, '/');
                window.location = Aak.getCookie('toUrl') || 'http://www.forbes.com/';
            }
        }
},
bait_adsbygoogle: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/547
        host: ['bitcoinaliens.com'],
        onStart: function () {
            Aak.addBaitElement('ins.adsbygoogle');
        }
},
bait_tester: {
        host: ['osoarcade.com', 'd3brid4y0u.info', 'fileice.net', 'nosteam.ro', 'openrunner.com', 'easybillets.com', 'spox.fr', 'yovoyages.com', 'tv3.co.nz', 'freeallmusic.info', 'putlocker.com', 'sockshare.com', 'dramapassion.com', 'yooclick.com', 'online.ua'],
        onStart: function () {
            Aak.addBaitElement('div#tester');
        }
},
bait_add: {
        host: ['filecom.net', 'upshare.org', 'skippyfile.com', 'mwfiles.net', 'up-flow.org'],
        onStart: function () {
            Aak.addBaitElement('div#add');
        }
},
bait_adpbtest: {
        host: ['leaguesecretary.com', 'teknogods.com', 'hellsmedia.com'],
        onStart: function () {
            Aak.addBaitElement('div#adpbtest');
        }
},
bait_adtester: {
        host: ['freesportsbet.com', 'sportsplays.com'],
        onStart: function () {
            Aak.addBaitElement('div#ad-tester');
        }
},
tgo_tv_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/303
        host: ['tgo-tv.com'],
        onStart: function () {
            Aak.addStyle("#adb, #bannerad1, .load_stream { display: none; }");
            Aak.addBaitElement('div#tester');
        },
        onEnd: function () {
            Aak.uw.threshold = 1000;
            Aak.removeElement('.chat_frame'); // bug reload iframe
        }
},
freegamehosting_nl: {
        host: ['freegamehosting.nl'],
        onStart: function () {
            Aak.addBaitElement('div#adtest');
        }
},
theweatherspace_com: {
        host: ['theweatherspace.com'],
        onStart: function () {
            Aak.addBaitElement('div#ab-bl-advertisement');
        }
},
cleodesktop_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/711
        host: ['cleodesktop.com'],
        onStart: function () {
            Aak.addBaitElement('div#myTestAd');
        }
},
imageraider_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/826
        host: ['imageraider.com'],
        onStart: function () {
            Aak.addBaitElement('div#myGContainer');
        }
},
voici_fr: {
    // issue: https://greasyfork.org/fr/forum/discussion/10093
    // issue: https://github.com/reek/anti-adblock-killer/issues/826
    // source: http://pastebin.com/zEVQHTiD
        host: ['voici.fr', 'programme-tv.net'],
        onStart: function () {
            Aak.addBaitElement('div#sas_script2');
        }
},
mil_ink: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1652
    // source: http://pastebin.com/474NZzPJ
        host: ['mil.ink'],
        onStart: function () {
            Aak.addBaitElement('div#ads_div');
        }
},
cubeupload_com: {
    // issue: https://greasyfork.org/en/forum/discussion/5919
        host: ['cubeupload.com'],
        onStart: function () {
            Aak.createElement({
                tag: 'iframe',
                name: 'iframe',
                src: 'about:blank',
                style: 'display:none;',
                append: document.documentElement
            });
        }
},
stream4free_eu: {
        host: ['stream4free.eu'],
        onStart: function () {
            // +abp alt solution
            Aak.addBaitElement('div#jpayday');
            Aak.uw.jpayday_alert = 1;
        }
},
_3dnews_ru: {
    // issue: https://greasyfork.org/ru/forum/discussion/5750
        host: ['3dnews.ru'],
        onStart: function () {
            Aak.setCookie('adblockwarn', 1);
            Aak.addStyle("#earAds { width: 401px; }");
            Aak.addBaitElement('div#earAds');
            Aak.uw.__AT_detected = true;
        }
},
_3dsthem_es: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=3dsthem
        host: ['3dsthem.es'],
        onStart: function () {
            //Aak.addScript(function () {});
        },
        onBeforeScript: function () {
            /*
              return [{
                  contains : 'main.js',
                  external : true,
                  override : '//pastebin.com/raw/2yGRPhRZ'
                }
              ];
            */
        }
},
_8muses_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=8muses
    // issue: https://greasyfork.org/forum/discussion/8515
    // issue: https://greasyfork.org/en/forum/discussion/6407
    // source: http://pastebin.com/bMNDxecs
        host: ['8muses.com'],
        onBeforeScript: function () {
            return [{
                contains: "typeof exo",
                external: false,
                remove: true
            }
            ];
        }
},
lg_firmware_rom_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=lg-firmware-rom.com
        host: ['lg-firmware-rom.com'],
        onStart: function () {
            Aak.setReadOnly('killads', true);
        }
},
badtv_network: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=badtv.it
        host: ['badtv.it', 'badtaste.it', 'badgames.it', 'badcomics.it'],
        onStart: function () {
            Aak.setCookie('adBlockChecked', 'disattivo');
        }
},
independent_co_uk: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=independent.co.uk
        host: ['independent.co.uk'],
        onStart: function () {
            Aak.setCookie('adblock_detected', 'ignored');
        }
},
esmas_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=esmas.com
        host: ['esmas.com'],
        onStart: function () {
            Aak.setReadOnly('opened_adbblock', false);
        }
},
pinoy1tv_network: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=pinoy1tv
        host: ['pinoy1tv.'],
        onStart: function () {
            Aak.setReadOnly('allowads', 1);
        }
},
business_standard_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=business-standard.com
        host: ['business-standard.com'],
        onStart: function () {
            Aak.setReadOnly('adsLoaded', 1);
            Aak.setCookie('_pw', 't');
        }
},
indiatimes_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=indiatimes
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=malayalam.samayam.com
    // test: http://tinyurl.com/zxusvyf, 
        host: ['indiatimes.com', 'samayam.com', 'bangaloremirror.com'],
        onBeforeScript: function () {
            return [{
                contains: '\\\\x61\\\\x64\\\\x62',
                external: false,
                remove: true
            }, {
                contains: 'function initBlock',
                external: false,
                remove: true
            }
            ];
        }
},
thechive_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1453
    // source: http://pastebin.com/TdpPyrbb
        host: ['thechive.com'],
        onStart: function () {
            Aak.addScript(function () {
                Object.defineProperties(window, {
                    stephaneDetector: {
                        value: {
                            hook: function (cb) {
                                cb(false);
                            },
                            init: function () { },
                            broadcastResult: function () { }
                        },
                        writable: false
                    }
                });
            });
        }
},
richonrails_com: {
    // by: Giwayume
    // issue: https://github.com/reek/anti-adblock-killer/issues/1447
    // source: http://pastebin.com/Ewfwg8BG
        host: ['richonrails.com'],
        onIdle: function () {
            Aak.addScript(function () {
                var adsByGoogleHtml = '"<ins+id="aswift_0_expand"+style="display:inline-table;border:none;height:90px;margin:0;padding:0;position:relative;visibility:visible;width:750px;background-color:transparent"><ins+id="aswift_0_anchor"+style="display:block;border:none;height:90px;margin:0;padding:0;position:relative;visibility:visible;width:750px;background-color:transparent"><iframe+marginwidth="0"+marginheight="0"+vspace="0"+hspace="0"+allowtransparency="true"+scrolling="no"+allowfullscreen="true"+onload="var+i=this.id,s=window.google_iframe_oncopy,H=s&amp;&amp;s.handlers,h=H&amp;&amp;H[i],w=this.contentWindow,d;try{d=w.document}catch(e){}if(h&amp;&amp;d&amp;&amp;(!d.body||!d.body.firstChild)){if(h.call){setTimeout(h,0)}else+if(h.match){try{h=s.upd(h,i)}catch(e){}w.location.replace(h)}}"+id="aswift_0"+name="aswift_0"+style="left:0;position:absolute;top:0;"+width="750"+frameborder="0"+height="90"></iframe></ins></ins>"';
                $.ajax({
                    url: $(".article-content").data("url"),
                    dataType: "script",
                    method: "post",
                    data: {
                        html: adsByGoogleHtml
                    },
                    success: function (result) {
                        var exec = result.replace("$('.article-content')", "$('.article-content-2')");
                        new Function(exec)();
                    }
                });
                $(".article-content").after('<div class="article-content-2"></div>').remove();
            });
        }
},
rmprepusb_com: {
        host: ['rmprepusb.com'],
        onStart: function () {
            Aak.setCookie('jot_viewer', 3);
        }
},
neodrive_co: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1001
        host: ['neodrive.co'],
        onAlways: function () {
            // Prevent popunder
            Aak.setCookie('KifPopCnt', 1, null, '/embed/');
        }
},
hentaihaven_org: {
    // issue: https://github.com/gorhill/uBlock/issues/1340
        host: ['hentaihaven.org'],
        onAlways: function () {
            // Prevent popunder
            Aak.setCookie('hh_ppndr1', 1);
            Aak.setCookie('hh_ppndr2', 1);
        }
},
primeshare_tv: {
        host: ['primeshare.tv'],
        onStart: function () {
            Aak.addBaitElement('div#adblock');
        }
},
debridnet_and_livedebrid: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=debridnet
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=livedebrid
        host: ['debridnet.com', 'livedebrid.com'],
        onStart: function () {
            Aak.addStyle(".myTestAd2 { height: 5px; }");
            Aak.addBaitElement('div.myTestAd2');
        }
},
bluesatoshi_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/873
        host: ['bluesatoshi.com'],
        onStart: function () {
            Aak.addStyle("#test { height: 280px; }");
            Aak.addBaitElement('div#test');
        }
},
razercrypt_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/870
        host: ['razercrypt.com'],
        onStart: function () {
            Aak.addStyle("#test { height: 250px; }");
            Aak.addBaitElement('div#test');
        }
},
satoshiempire_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/872
        host: ['satoshiempire.com'],
        onStart: function () {
            Aak.addStyle("#test { height: 250px; }");
            Aak.addBaitElement('div#test');
        }
},
oneadfaucet_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/871
        host: ['oneadfaucet.com'],
        onStart: function () {
            Aak.addStyle("#test { height: 250px; }");
            Aak.addBaitElement('div#test');
        }
},
jkanime_net: {
        host: ['jkanime.net'],
    // @@||jkanime.net/assets/js/advertisement2.js
        onStart: function () {
            Aak.addBaitElement('div#reco');
        }
},
_720pmkv_com: {
        host: ['720pmkv.com'],
        onStart: function () {
            Aak.addBaitElement('div#advert');
        }
},
paidverts_com: {
        host: ['paidverts.com'],
        onStart: function () {
            Aak.addBaitElement('div.afs_ads');
        }
},
italiatv_org: {
        host: ['italiatv.org'],
        onStart: function () {
            Aak.addBaitElement('div#fab13');
        }
},
chrissmoove_com: {
        host: ['chrissmoove.com'],
        onStart: function () {
            //Aak.addBaitElement('div#adserver');
        }
},
eventhubs_com: {
        host: ['eventhubs.com'],
        onStart: function () {
            Aak.addBaitElement('div#blahyblaci1');
        }
},
superanimes_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1295
    // source: http://pastebin.com/FDPAKjTQ
        host: ['superanimes.com'],
        onStart: function () {
            Aak.addBaitElement('div#bannerLoja');
        }
},
forum_pac_rom_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/243
        host: ['forum.pac-rom.com'],
        onStart: function () {
            Aak.addBaitElement('div.banner_ads');
        }
},
litv_tv: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1299
    // source: http://pastebin.com/zcddvTuC
        host: ['litv.tv'],
        onStart: function () {
            Aak.addBaitElement('div.player_mask');
        }
},
leveldown_fr: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/595
        host: ['leveldown.fr'],
        onStart: function () {
            Aak.addBaitElement('div#adblock');
            Aak.addBaitElement('div#adblocktest');
        }
},
globeslot_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/924
        host: ['globeslot.com'],
        onStart: function () {
            Aak.addBaitElement('div#add');
            Aak.addBaitElement('div#add1');
        }
},
antennesport_com: {
        host: ['antennesport.com', 'serverhd.eu'],
        onIdle: function () { // for antennesport
            // Remove Pub
            Aak.removeElement("#pub .pubclose");
            // Redirect to Player
            Aak.setElement('#pub .embed iframe', {
                src: '/embed/embed.php'
            });
        }
},
disableAlertbox: {
    // issue: https://greasyfork.org/en/forum/discussion/8611
        host: ['drivearabia.com', 'putlocker.com', 'doatoolsita.altervista.org', 'sockshare.com', 'free-movie-home.com', 'pc.online143.com', 'kooora.com', 'str3amtv.co.nr', 'str3amtv.altervista.org', 'str3am.altervista.org', 'filecom.net', 'pipocas.tv', 'generatupremium.biz', 'mega-debrid.eu', 'premiumst0re.blogspot.com', 'dl-protect.com', 'newsinlevels.com', 'vipracing.biz', 'businesstoday.in'],
        onAlways: function () {
            Aak.uw.alert = function () { };
        }
},
generatupremium_biz: {
        host: ['generatupremium.biz'],
        onStart: function () {
            // Disable Confirm Box
            //Aak.uw.confirm = function (){};
            Aak.setCookie('genera', false);
        }
},
newstatesman_com: {
        host: ['newstatesman.com'],
        onStart: function () {
            Aak.setCookie('donationPopup', 'hide');
        }
},
adswizz_com: {
    // by: Skr4tchGr3azyMonkiBallllllZzzz
    // issue: https://github.com/reek/anti-adblock-killer/issues/809
        host: ['yes.fm'],
        onStart: function () {
            Aak.addScript(function () {
                window.com_adswizz_synchro_initialize = function () { };
            });
        }
},
derstandard_at: {
    // by: Alexander255
    // patch: http://pastebin.com/raw.php?i=r7Q4DrfB
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=derstandard
        host: ['derstandard.at'],
        onStart: function () {

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
                        var pos = assignment.indexOf('=');
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
},
tek_domains: {
    // by: Reek, Alexander255
    // issue: https://github.com/reek/anti-adblock-killer/issues/788
    // issue: https://github.com/reek/anti-adblock-killer/issues/512
        host: ['tek.no', 'gamer.no', 'teknofil.no', 'insidetelecom.no', 'prisguide.no', 'diskusjon.no', 'teknojobb.no', 'akam.no', 'hardware.no', 'amobil.no'],
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
},
planetatvonlinehd_network: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1467
    // issue: https://github.com/reek/anti-adblock-killer/issues/159
        host: ['planetatvonlinehd.blogspot.', 'planetatvonlinehd.com'],
        onStart: function () {
            Aak.addStyle('.adsantilok { height: 1px; }');
            //Aak.uw.jQAntiAdsBlock = function (){}; // don't work
        }
},
beta_speedtest_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/628
    // issue: https://github.com/reek/anti-adblock-killer/issues/562
    // issue: https://github.com/reek/anti-adblock-killer/issues/484
    // source: http://paste2.org/53ymghX1
        host: ['beta.speedtest.net'],
        onAlways: function () {
            Aak.uw.adsOoklaComReachable = true;
            Aak.uw.scriptsLoaded = function () { };
        }
},
binbucks_com: {
    // by: Alexander255
    // issue: https://github.com/reek/anti-adblock-killer/issues/545
        host: ['binbucks.com'],
        onIdle: function () {
            Aak.uw.testJuicyPay = true;
            Aak.uw.testSensePay = true;
        }
},
whiskyprices_domains: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1284
    // source: http://pastebin.com/Epr5tREL
        host: ['whiskyprijzen.com', 'whiskyprices.co.uk', 'whiskypreise.com', 'whiskyprix.fr'],
        onAlways: function () {
            Aak.uw.OA_show = true;
        }
},
nicoblog_org: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1184
    // source: http://pastebin.com/MNHpLs2V
        host: ['nicoblog.org'],
        onIdle: function () {
            var el = document.querySelector('.src');
            el.removeAttribute('class');
        }
},
di_se: {
    // note: add this rule for chrome user
    // issue: https://github.com/reek/anti-adblock-killer/issues/1319
    // source: http://pastebin.com/9bDPQzMX
        host: ['di.se'],
        onIdle: function () {
            Aak.removeElement('#header_overlay');
            Aak.removeElement('#message_modal');
        }
},
libertaddigital_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1642
    // source: http://pastebin.com/6Fzp0vrE
        host: ['libertaddigital.com'],
        onStart: function () {
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
},
folha_uol_com_br: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1396
    // source: f( ( typeof paywall_access == "undefined" || paywall_access != true ) && ( typeof folha_ads == "undefined" || folha_ads != true ) ) {
        host: ['folha.uol.com.br'],
        onStart: function () {
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
},
gamer_com_tw: {
    // by: mmis1000
    // userscript: https://greasyfork.org/en/scripts/16525
    // issue: : https://github.com/reek/anti-adblock-killer/issues/975
        host: ['gamer.com.tw'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'AntiAd', {
                enumerable: true,
                writable: false,
                value: null
            });
        }
},
armorgames_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/845
        host: ['armorgames.com'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'ga_detect', {
                enumerable: true,
                writable: false,
                value: null
            });
        }
},
mangahost_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/957
    // issue: https://github.com/reek/anti-adblock-killer/issues/558
    // source: http://pastebin.com/GrpbJENA
        host: ['mangahost.com'],
        onStart: function () {
            Object.defineProperty(Aak.uw, "testDisplay", {
                enumerable: true,
                writable: false,
                value: false
            });
        }
},
videowood_tv: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1339
    // source: http://videowood.tv/build/assets/js/pembed-97a640f625.js
        host: ['videowood.tv'],
        onStart: function () {
            Aak.uw.open = function () { }; // prevent popup
            Aak.uw.config = {};
            Object.defineProperty(Aak.uw.config, "adb_remind", {
                enumerable: true,
                writable: false,
                value: false
            });
        }
},
infojobs_com_br: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1339
    // source: http://pastebin.com/LPg6093U
    // redirect: http://www.infojobs.com.br/nopublicity.aspx
        host: ['infojobs.com.br'],
        onStart: function () {
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
},
cloudwebcopy_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/714
        host: ['cloudwebcopy.com'],
        onStart: function () {
            var setTimeoutClone = Aak.uw.setTimeout;
            Aak.uw.setTimeout = null;
            setTimeout(function () {
                Aak.uw.setTimeout = setTimeoutClone;
            }, 5000);
        }
},
narkive_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/569
        host: ['narkive.com'],
        onAlways: function () {
            Aak.uw.adblock_status = function () {
                return false;
            };
        }
},
pregen_net: {
        host: ['pregen.net'],
        onStart: function () {
            // skip page info
            Aak.setCookie('pgn', 1);
        }
},
phys_org: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/768
        host: ['phys.org'],
        onAlways: function () {
            Aak.uw.chkAB = function () { };
        }
},
onvasortir_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=onvasortir.com
        host: ['onvasortir.com'],
        onAlways: function () {
            // +abp rule alt solution
            Aak.uw.JeBloque = function () { };
        }
},
fullhdzevki_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=fullhdzevki.com
        host: ['fullhdzevki.com'],
        onAlways: function () {
            // +abp rule alt solution
            Aak.uw.check = function () { };
        }
},
ville_ideale_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/258
    // source: http://pastebin.com/16mnmeMc
        host: ['ville-ideale.com'],
        onAlways: function () {
            // +abp rule alt solution
            Aak.uw.execsp = function () { };
        }
},
notre_planete_info: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/258
    // source: http://pastebin.com/qrS6QGGE
        host: ['notre-planete.info'],
        onAlways: function () {
            // +abp rule alt solution
            Aak.uw.pubpop = function () { };
        }
},
apkmirror_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/378
    // issue: https://github.com/reek/anti-adblock-killer/issues/224
    // issue: https://github.com/reek/anti-adblock-killer/issues/78
        host: ['apkmirror.com'],
        onAlways: function () {
            Aak.uw.doCheck = function () { };
        }
},
mtlblog_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/948
    // issue: https://greasyfork.org/forum/discussion/7753
    // source: http://pastebin.com/BFrDPM6b
        host: ['mtlblog.com'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'puabs', {
                enumerable: true,
                value: function () { }
            });
        }
},
anizm_com: {
    // issue:
        host: ['anizm.com'],
        onAlways: function () {
            Aak.uw.stopAdBlock = {};
        }
},
diarioinformacion_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1550
        host: ['diarioinformacion.com'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'pr_okvalida', {
                enumerable: true,
                value: true
            });
        }
},
cnbeta_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1301
    // source: http://pastebin.com/vXNCztwx
        host: ['cnbeta.com'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'JB', {
                enumerable: true,
                value: function () { }
            });
        }
},
themarker_haaretz: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1292
    // source: http://pastebin.com/m08dkDT4
        host: ['themarker.com', 'haaretz.co.il'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'AdBlockUtil', {
                enumerable: true,
                value: {}
            });
        }
},
pipocas_tv: {
    // issue:
        host: ['pipocas.tv'],
        onStart: function () {
            // Also added in disableAlertbox
            // No popup
            Aak.setCookie('popup_user_login', 'yes');
        }
},
_15min_lt: {
    // note: regulary update script
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=15min.it
    // source: http://pastebin.com/YWf3HTqr
    // test: http://tinyurl.com/h6c4336
        host: ['15min.lt'],
        onStart: function () {
            Object.defineProperty(Aak.uw, 'ROUTE', {
                enumerable: true,
                writable: false,
                value: '_be_reklamos'
            });
        }
},
sc2casts_com: {
    // by: Giwayume
    // issue: https://github.com/reek/anti-adblock-killer/issues/1599
        host: ['sc2casts.com'],
        onStart: function () {
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
},
vgunetwork_com: {
    // issue:
        host: ['vgunetwork.com'],
        onIdle: function () {
            Aak.setCookie('stopIt', 1);
            var close = Aak.getElement('#some_ad_block_key_close');
            if (close) {
                close.click();
            }
        }
},
linkcrypt_ws: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/286
    // issue: https://github.com/reek/anti-adblock-killer/pull/67
        host: ['linkcrypt.ws'],
        onIdle: function () {
            Aak.setElement('#ad_cont', {
                id: '',
                style: 'display:block;'
            });
            Aak.setElement('#container_check', {
                style: 'display:none;'
            });
        }
},
eventosppv_me: {
    // issue: 
        host: ['eventosppv.me'],
        onIdle: function () {
            Aak.removeElement('#nf37');
        }
},
bolor_toli_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/552
        host: ['bolor-toli.com'],
        onEnd: function () {
            var ads = document.getElementsByClassName('banner');
            for (var i = 0; i < ads.length; i++) {
                var ad = ads[i];
                ad.innerHTML = '<br>';
                ad.style.height = '1px';
            }
        }
},
vivo_sx: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/280
        host: ['vivo.sx'],
        onEnd: function () {
            var alert = Aak.getElement('#alert-throttle');
            if (alert) {
                Aak.removeElement(alert);
            }
            var button = Aak.getElement('button#access');
            if (button) {
                button.removeAttribute('id');
                button.removeAttribute('disabled');
                button.innerHTML = 'Continue to video';
            }
            setTimeout(function () {
                var input = Aak.getElement('input[name="throttle"]');
                if (input) {
                    Aak.removeElement(input);
                }
            }, 1000);
        }
},
luxyad_com: { // skip redirect myanimes.li
    // issue:
        host: ['luxyad.com'],
        onIdle: function () {
            if ('/Information.php' == location.pathname) {
                var href = location.href;
                location.href = href.substr(href.indexOf('url=') + 4, href.length);
            }
        }
},
mrpiracy_domains: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1405
        host: ['mrpiracy.xyz', 'mrpiracy.club'],
        onBeforeScript: function () {
            return [{
                contains: 'Desativa o AdBlock para continuar',
                external: false,
                remove: true
            }
            ];
        }
},
dbplanet_net: {
    // issue: PM
        host: ['dbplanet.net'],
        onStart: function () {
            Aak.setCookie('newnoMoreAdsNow', 1);
        }
},
aidemu_fr: {
    // issue:
        host: ['aidemu.fr'],
        onStart: function () {
            Aak.setCookie('adblockPopup', true);
        }
},
eami_in: {
    // issue:
        host: ['eami.in'],
        onAlways: function () {
            Aak.setCookie('ad_locked', 1);
        }
},
bigdownloader_com: {
    // issue:
        host: ['bigdownloader.com'],
        onIdle: function () {
            Aak.removeElement('#anti_adblock');
        }
},
freeskier_com: {
    // by: Gorhill
    // issue: https://github.com/reek/anti-adblock-killer/issues/639
    // note: also added list rule
        host: ['freeskier.com'],
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
},
gametrailers_com: {
    // issue:
        host: ['gametrailers.com'],
        onIdle: function () {
            Aak.removeElement('#ad_blocking');
        }
},
scan_onepiece_naruto_mx: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/582
    // issue: https://github.com/reek/anti-adblock-killer/issues/279
        host: ['scan-mx.com', 'onepiece-mx.net', 'naruto-mx.net'],
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
        host: ['bitcoinker.com'],
        onStart: function () {
            Aak.uw.claim = function () {
                return true;
            };
        },
        onIdle: function () {
            Aak.removeElement('#E33FCCcX2fW');
        }
},
moondoge_co_in: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/384
    // issue: https://github.com/reek/anti-adblock-killer/issues/232
    // issue: https://github.com/reek/anti-adblock-killer/issues/233
    // issue: https://github.com/reek/anti-adblock-killer/issues/236
        host: ['moondoge.co.in', 'moonliteco.in', 'moonbit.co.in', 'bitcoinzebra.com'],
        onIdle: function () {
            Aak.removeElement('#AB, #E442Dv, #eCC5h');
        }
},
bitcoiner_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/349
        host: ['bitcoiner.net', 'litecoiner.net'],
        onStart: function () {
            Aak.addBaitElement('div#tester');
            Aak.addBaitElement('div#ad-top');
        }
},
bitcoins_nx_tc: {
    // issue:
        host: ['freebitcoins.nx.tc', 'getbitcoins.nx.tc'],
        onAlways: function () {
            Aak.uw.ad_block_test = function () {
                return false;
            };
        }
},
freecoins4_me: {
    // issue:
        host: ['freecoins4.me'],
        onAlways: function () {
            Aak.uw.check = function () {
                return false;
            };
        }
},
torrent_tv_ru: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/537
        host: ['torrent-tv.ru'],
        onAlways: function () {
            Aak.uw.c_Oo_Advert_Shown = true;
        }
},
cwtv_com: {
    // by: Kalbasit
    // pull: https://github.com/reek/anti-adblock-killer/pull/763
    // issue: https://github.com/reek/anti-adblock-killer/issues/340
    // issue: https://github.com/reek/anti-adblock-killer/issues/762
        host: ['cwtv.com'],
        onAlways: function () {
            Aak.uw.CWTVIsAdBlocking = undefined;
        }
},
bild_de: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=bild
        host: ['bild.de'],
        onBeforeScript: function () {
            return [{
                contains: 'http://www.bild.de/wa/ll/bild-de/unangemeldet-42925516.bild.html',
                external: false,
                replace: ['javascript', 'void(0);'].join(':')
            }
            ];
        }
},
inn_co_il: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/532
        host: ['inn.co.il'],
        onStart: function () {
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
},
bhaskar_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=bhaskar
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=divyabhaskar.co.in
        host: ['bhaskar.com', 'divyabhaskar.co.in'],
        onAlways: function () {
            Aak.uw.openPopUpForBreakPage = function () { };
            Aak.uw.canABP = true;
            Aak.uw.canRunAds = true;
            Aak.uw.canCheckAds = true;
        }
},
turkanime_tv: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/446
    // issue: https://github.com/reek/anti-adblock-killer/issues/139
    // issue: https://greasyfork.org/tr/forum/discussion/4282/
        host: ['turkanime.tv'],
        onAlways: function () {
            Aak.uw.adblockblock = function () { };
            Aak.uw.BlokKontrol = {};
        }
},
wtfbit_ch: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/407
        host: ['wtfbit.ch'],
        onAlways: function () {
            Aak.uw.writeHTMLasJS = function () { };
        }
},
aranzulla_it: {
    // by: Robotex
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=aranzulla.it
    // source: http://pastebin.com/yMM6YgxW
        host: ['aranzulla.it'],
        onStart: function () {
            Aak.addStyle('#abt1 + STYLE + div[id][class] {display:none;}');
        },
        onBeforeScript: function () {
            return [{
                contains: 'navigator.userAgent||navigator.vendor||window.opera',
                external: false,
                remove: true
            }
            ];
        }
},
ndtv_com: {
    // note: canRunAds inverted value
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=ndtv.com
    // test: http://tinyurl.com/hcfncdv
        host: ['ndtv.com'],
        onStart: function () {
            Aak.setReadOnly('___p__p', 1);
            Aak.setReadOnly('getNoTopLatestNews', function () { });
        }
},
lesechos_fr: {
    // Reek, Giwayume
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=lesechos.fr
    // source: http://pastebin.com/CMM8WGLj
        host: ['lesechos.fr', 'lesechos.com'],
        onStart: function () {
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
},
bitvisits_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/266
        host: ['bitvisits.com'],
        onAlways: function () {
            Aak.uw.blockAdblockUser = function () { };
        }
},
exrapidleech_info: {
    // by: Alexander255, Reek, Giwayume
    // patch: http://pastebin.com/Q664diQ2
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=exrapidleech
    // source: http://pastebin.com/5e27syjA
        host: ['exrapidleech.info'],
        onStart: function () {

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            // prevent popup
            Aak.setCookie('popcashpuCap', 1);
            Aak.setCookie('popcashpu', 1);
            Aak.setCookie('nopopatall', tomorrow.getTime().toString());
            Aak.setCookie('noadvtday', 0);
            //Aak.setCookie('bv_DSKskdck_s1d', 'bvDSKskdcks1d');

            // hide notice
            Aak.addStyle('div.alert.alert-danger.lead {opacity:0;}');

            // prevent redirect to verify page
            Aak.setReadOnly('bdvbnr_pid', []);
            Aak.setReadOnly('PopAds', 1);

            Aak.addScript(function () {
                (function () {
                    // prevent popup
                    window.open = function () { };

                    // prevent redirect to verify page
                    var frame1 = document.createElement('iframe');
                    frame1.src = 'http://bdfrm.bidvertiser.com/BidVertiser.dbm?pid=383865&bid=1737418&RD=';
                    frame1.id = 'bdvi';
                    frame1.style = 'display:none';
                    document.documentElement.appendChild(frame1);
                })();
            });
        }
},
vipleague_domains: {
    // note: also killed by AakList
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=vipbox
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=vipleague
    // source: http://pastebin.com/NERVzHzS
        host: ["vipleague.is", "vipleague.ws", "vipleague.tv", "vipleague.se", "vipleague.tv", "vipleague.me", "vipleague.mobi", "vipleague.co", "vipleague.sx", "vipleague.ch", "vipbox.tv", "vipbox.co", "vipbox.biz", "vipbox.sx", "vipbox.eu", "vipbox.so", "vipbox.nu", "vipboxsa.co", "strikeout.co", "strikeout.me", "homerun.re", "vipboxtv.co", "vipapp.me"],
        onStart: function () {
            Aak.uw.iExist = true;
            Aak.setCookie('xclsvip', 1);
            Aak.addStyle(".vip_052x003 { height: 250px; }");
            Aak.addStyle(".vip_09x827 { height: 26px; }");
            Aak.addStyle("#overlay { display: none; }");
        }
},
zoomtv_me: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=zoomtv.me
    // source: http://pastebin.com/m4zAXGcw
        host: ['zoomtv.me'],
        onAlways: function () {
            Aak.uw.iaxpEnabled = true;
        }
},
vg_no: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/292
    // +abp rule
        host: ['vg.no', 'e24.no'],
        onAlways: function () {
            Aak.uw.__AB__ = function () { };
        }
},
pornve_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/947
    // source: http://pastebin.com/7TPPkq12
        host: ['pornve.com'],
        onAlways: function () {
            Aak.uw.adxjwupdate = 1;
        }
},
lol_moa_tw: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1114
        host: ['lol.moa.tw'],
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
},
multiup_org: {
    // by: Watilin
    // note: alternative solution
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=multiup.org
        host: ['multiup.org'],
        onStart: function () {
            Aak.setCookie('visit', 1); // prevent popup
            Aak.setReadOnly('hi', function () { });
        }
},
dailybitcoins_org: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/107
        host: ['dailybitcoins.org'],
        onIdle: function () {
            Aak.removeElement('.ad-img');
        }
},
kozaczek_zeberka: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/414
        host: ['kozaczek.pl', 'zeberka.pl'],
        onStart: function () {
            Aak.setCookie('ablc', 1);
            Aak.setCookie('cookie_policy', 1);
        }
},
spankwire_sites: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/887
    // source: http://pastebin.com/TFB1dtgb
        host: ['spankwire.com', 'keezmovies.com', 'extremetube.com', 'mofosex.com'],
        onStart: function () {
            Aak.setCookie("abClosed", "true");
            Aak.setCookie("hide_ad_msg", "1");
        }
},
youporn_network: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/887
    // source: http://pastebin.com/TFB1dtgb
        host: ['youporn.com', 'youporngay.com'],
        onStart: function () {
            Aak.setCookie("adblock_message", "closed");
        }
},
citationmachine_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=citationmachine.net
        host: ['citationmachine.net'],
        onStart: function () {
            Aak.setCookie("sbm_cm_citations", 0);
        }
},
psarips_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/153
        host: ['psarips.com'],
        onStart: function () {
            Aak.addBaitElement('div#advert');
        }
},
extratorrent_domains: {
        host: ['extratorrent.cc', 'extratorrent.com'],
        onStart: function () {
            // prevent popup
            // source are obfuscated in external js
            Aak.setCookie('ppu_delay', 1);
            Aak.setCookie('ppu_main', 1);
            Aak.setCookie('ppu_sub', 1);
            Aak.setCookie('ppu_show_on', 1);
        }
},
tny_cz: {
        host: ['tny.cz', 'pasted.co'],
        onStart: function () {
            // prevent popup
            Aak.setCookie('__.popunderCap', 1);
            Aak.setCookie('__.popunder', 1);
        }
},
clubedohardware_com_br: { // two antiadblock
        host: ['clubedohardware.com.br'],
        onStart: function () {
            if (Aak.contains(location.host, 'forum')) {
                // Solution 1
                Aak.addStyle("#banner, script { height: 51px; }");
                Aak.addBaitElement('div#banner');
            } else { // Website
                // Solution 1
                Aak.addBaitElement('div.banner_topo');
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
                Aak.removeElement('.adblock');
            }
        }
},
debrastagi_com: {
        host: ['debrastagi.com'],
        onIdle: function () {
            Aak.removeElement('#stp-main');
            Aak.removeElement('#stp-bg');
        }
},
ddlfrench_org: {
        host: ['ddlfrench.org'],
        onIdle: function () {
            // Fix bug display content
            Aak.setElement('#dle-content .d-content', {
                'class': ''
            });
            Aak.setElement('#content', {
                'id': ''
            });
        }
},
megadebrid_eu: {
        host: ['mega-debrid.eu'],
        onEnd: function () {
            // Activate button debrid
            Aak.setElement('.realbutton', {
                'onclick': '',
                'type': 'submit'
            });
        }
},
slideplayer_domains: {
    // by: Alexander255
    // issue: https://github.com/reek/anti-adblock-killer/issues/1333
    // issue: https://github.com/reek/anti-adblock-killer/issues/515
    // issue: https://github.com/reek/anti-adblock-killer/issues/296
    // demo: http://slideplayer.fr/slide/1304026/#
        host: ['slideplayer.*'],
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
},
bokepspot_com: {
        host: ['bokepspot.com'],
        onStart: function () {
            // Hide Disclaimer
            Aak.setCookie('hideDialog', 'hide');
        },
        onIdle: function () {
            // Remove Disable AdBlock
            Aak.removeElement('#tupiklan');
        }
},
picload_com: {
        host: ['picload.org'],
        onStart: function () {
            Aak.setCookie('pl_adblocker', false);
        },
        onIdle: function () {
            Aak.uw.ads_loaded = true;
            Aak.uw.imageAds = false;
            Aak.removeElement('div[oncontextmenu="return false;"]');
        }
},
freezedownload_com: {
        host: ['freezedownload.com'],
        onIdle: function () {
            if (/freezedownload.com\/download\//.test(location.href)) {
                Aak.removeElement('body > div[id]');
            }
        }
},
monnsutogatya_com: {
    // issue: PM
    // source: http://pastebin.com/1Lw60h6k
        host: ['monnsutogatya.com'],
        onIdle: function () {
            Aak.addStyle("#site-box {display:block;}");
            Aak.removeElement('#for-ad-blocker');
        }
},
rapid8_com: {
        host: ['rapid8.com'],
        onIdle: function () {
            Aak.removeElement('div.backk + #blcokMzg');
            Aak.removeElement('div.backk');
        }
},
turkdown_com: {
        host: ['turkdown.com'],
        onIdle: function () {
            // remove facebook box
            Aak.removeElement('#duyuru');
        }
},
filmovizija_domains: {
        host: ['filmovizija.me', 'filmovizija.com', 'filmovizija.in', 'filmovizija.net'],
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
},
hackintosh_zone: {
    // by: Alexander255
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=hackintosh.zone
    // source: http://paste2.org/DnB9Oj4f
        host: ['hackintosh.zone'],
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

            var elems = document.querySelectorAll('.adsensegrey');
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
},
privateinsta_com: {
        host: ['privateinsta.com'],
        onIdle: function () {
            // + abp rule
            Aak.uw.dont_scroll = false;
            Aak.removeElement("#overlay_div");
            Aak.removeElement("#overlay_main_div");
        }
},
risikogesundheit_de: {
        host: ['risiko-gesundheit.de'],
        onIdle: function () {
            setTimeout(function () {
                window.stop();
            }, 5000);
        }
},
oneplaylist_eu_pn: {
        host: ['oneplaylist.eu.pn'],
        onIdle: function () {
            // kill popunder
            Aak.uw.makePopunder = false;
        }
},
onmeda_de: {
    // note: script obfuscated line 1110
    // issue: https://greasyfork.org/forum/discussion/8576
    // issue: https://github.com/reek/anti-adblock-killer/issues/1067
    // source: http://pastebin.com/qf46bN3z
    // source: http://pastebin.com/RwHyF0NL
        host: ['onmeda.de'],
        onAlways: function () {
            Aak.uw.$ADP = true;
            Aak.uw.sas_callAd = function () { };
            Aak.uw.sas_callAds = function () { };
        }
},
turbodebrideur_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/599
    // issue: https://github.com/reek/anti-adblock-killer/issues/563
    // issue: https://github.com/reek/anti-adblock-killer/issues/526
        host: ['turbodebrideur.com'],
        onIdle: function () {
            Aak.createElement({
                tag: 'div',
                id: 'pubdirecte',
                html: '<img  src="' + Aak.imgBait + '"/><a  href="#">&nbsp;</a>',
                append: 'body'
            });
        }
},
rockfile_eu: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1256
        host: ['rockfile.eu'],
        onIdle: function () {
            Aak.createElement({
                tag: 'iframe',
                src: 'about:blank',
                style: 'visibility:hidden;',
                append: 'body'
            });
        }
},
linkbucks_antiadblock: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/932
    // issue: https://github.com/reek/anti-adblock-killer/issues/469
    // issue: https://github.com/reek/anti-adblock-killer/issues/277
    // v3: http://pastebin.com/0gh8LMGH
    // note: no solution, anti-adblock difficult to bypass --> http://pastebin.com/1NRq7WvZ
        host: ['linkbucks.com', 'miniurls.co', 'picbucks.com', 'picturesetc.net', 'placepictures.com', 'poontown.net', 'qqc.co', 'qvvo.com', 'realfiles.net', 'rqq.co', 'seriousdeals.net', 'seriousfiles.com', 'seriousurls.com', 'sexpalace.gs', 'theseblogs.com', 'thesefiles.com', 'theseforums.com', 'thosegalleries.com', 'tinybucks.net', 'tinylinks.co', 'tnabucks.com', 'tubeviral.com', 'uberpicz.com', 'ubervidz.com', 'ubucks.net', 'ugalleries.net', 'ultrafiles.net', 'urlbeat.net', 'urlpulse.net', 'whackyvidz.com', 'youfap.me', 'yyv.co', 'zxxo.net', 'zff.co', 'linkbucksdns.co', 'miniurls.com', 'dyo.gs', 'goneviral.com', 'eafyfsuh.net', 'sasontnwc.net'],
        onStart: function () {
            // do nothing...
        }
},
linkbucks_visitscript: {
    // issue:
        host: ['referencemega.com', 'fpabd.com', 'crackacc.com'],
        onStart: function () {
            // Skip visitScript when site use CloudFlare Rocket Script
            Aak.setCookie('_lbGatePassed', true);
        }
},
link_tl: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=link.tl
    // issue: https://greasyfork.org/fr/forum/discussion/8437
    // source: http://pastebin.com/1MkCnmL7
        host: ['link.tl'],
        onStart: function () {
            Aak.addStyle('.adblock { height:1px; }');
            Aak.uw.adblocker = false;
        }
},
wstream_video: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1382
    // source: http://pastebin.com/EiARVQXt
        host: ['wstream.video'],
        onStart: function () {
            Aak.addStyle('#adiv { height:4px; }');
        }
},
_4shared_com: {
        host: ['4shared.com'],
        onIdle: function () {
            // Hide "Disable AdBlodk" messages
            document.querySelector('body').classList.remove("jsBlockDetect");
        }
},
pro_domains: {
        host: ['pro-zik.ws', 'pro-tect.ws', 'pro-ddl.ws', 'pro-sport.ws'],
        onStart: function () {
            Aak.setCookie('visitedf', true);
            Aak.setCookie('visitedh', true);
        }
},
comptoirhardware_com: {
        host: ['comptoir-hardware.com'],
        onAlways: function () {
            Aak.uw.adblock = 'non';
        }
},
bakersfield_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/657
    // note: also solution to AakList
        host: ['bakersfield.com'],
        onAlways: function () {
            Aak.uw.AD_SLOT_RENDERED = true;
        }
},
ekstrabladet_dk: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=ekstrabladet
    // source: http://pastebin.com/R029XpCr
        host: ['ekstrabladet.dk', 'eb.dk'],
        onAlways: function () {
            Aak.uw.ADTECH = {};
        }
},
pcgames_download_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1451
    // issue: https://greasyfork.org/forum/discussion/9328
    // source: http://pastebin.com/EBVZg3VB
        host: ['pcgames-download.net'],
        onAlways: function () {
            Aak.setCookie('noAdblockNiceMessage', 1);
            Aak.uw.mgCanLoad30547 = true;
        }
},
lachainemeteo_com: {
    // note: also killed by AakList
    // issue: https://github.com/reek/anti-adblock-killer/issues/590
    // issue: https://github.com/reek/anti-adblock-killer/issues/245
    // issue: https://github.com/reek/anti-adblock-killer/issues/215
        host: ['lachainemeteo.com'],
        onAlways: function () {
            Aak.uw.js_loaded = true;
        }
},
mac4ever_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/997
    // source: http://pastebin.com/RQnCEYK6
        host: ['mac4ever.com'],
        onAlways: function () {
            Aak.uw.coquinou = function () { };
        }
},
_5278bbs_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=5278bbs.com
        host: ['5278bbs.com'],
        onAlways: function () {
            Aak.uw.myaabpfun12 = function () { };
        }
},
thesimsresource_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=thesimsresource.com
    // source: http://pastebin.com/DE9rbjxY
        host: ['thesimsresource.com'],
        onAlways: function () {
            Aak.uw.gadsize = true;
            Aak.uw.iHaveLoadedAds = true;
        }
},
yellowbridge_com: {
        host: ['yellowbridge.com'],
        onAlways: function () {
            Aak.uw.finalizePage = function () {
                return;
            };
        }
},
game_debate_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1366
    // source: http://pastebin.com/UzsiX0FK
        host: ['game-debate.com'],
        onAlways: function () {
            Aak.uw.ad_block_test = function () { };
        }
},
adscendmedia: {
        host: ['adscendmedia.com'],
        onStart: function () {
            // adscendmedia - https://www.adscendmedia.com/
            var ref = document.createElement('a').href = document.referrer;
            var host = location.host;
            var path = location.pathname;
            if (Aak.contains(path, '/widget_adblock.php') && !Aak.contains(ref.host, host)) {
                // Auto report
                Aak.detected('Adscendmedia', ref.host, host);
                // Notification
                Aak.notification('You must subscribe to <b>AakList (Anti-Adblock Killer )</b> <a href="' + Aak.subscribeURL + '" target="_blank">Subscribe</a>');
            }
        }
},
adworkmedia: {
        host: ['adworkmedia.com', 'loxtk.com', 'contentlockingnetworks.com'],
        onStart: function () {
            // AdWorkMedia - https://www.adworkmedia.com/
            var ref = document.createElement('a').href = document.referrer;
            var host = location.host;
            var path = location.pathname;
            if (Aak.contains(path, '/help/removeAB.php') && !Aak.contains(ref.host, host)) {
                // Auto report
                Aak.info('Adworkmedia', ref.host, host);
                // Notification
                Aak.notification('You must subscribe to <b>AakList (Anti-Adblock Killer )</b> <a href="' + Aak.subscribeURL + '" target="_blank">Subscribe</a>');
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
        host: ['kissanime.com', 'kissanime.to', 'kissanime.ru'],  //https://github.com/reek/anti-adblock-killer/issues/2828
        onStart: function () {
            // Masking ads
            Aak.addStyle('iframe[id^="adsIfrme"], .divCloseBut { display:none; }');
            // Solution 1
            Aak.uw.DoDetect2 = null;
        },
        onIdle: function () {

            // Solution 1 abp rule
            // @@||kissanime.com^$elemhide

            var divContentVideo = document.querySelector('#divContentVideo');

            // Solution 2
            if (Aak.uw.DoDetect2) {
                Aak.uw.DoDetect2 = null;
                Aak.uw.CheckAdImage = null;
                Aak.info('Solution 2');
            } //Solution 3
            else if (divContentVideo) {

                var divDownload = document.querySelector('#divDownload').cloneNode(true);

                setTimeout(function () {
                    divContentVideo.innerHTML = '';
                    Aak.uw.DoHideFake();
                    divContentVideo.appendChild(divDownload);
                    Aak.removeElement('iframe[id^="adsIfrme"], .divCloseBut');
                    Aak.info('Solution 3');
                }, 5500);
            }
        }
},
Kisscartoon_me: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/488
        host: ['kisscartoon.me', 'kisscartoon.se'], //https://github.com/reek/anti-adblock-killer/issues/2828
        onAlways: function () {
            Aak.uw.xaZlE = function () { };
        },
        onIdle: function () {
            Aak.removeElement('iframe[id^="adsIfrme"]');
        }
},
openload_domains: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=openload
        host: ['openload.co', 'openload.io', 'openload.tv'],
        onStart: function () {
            Aak.uw.adblock = false;
            Aak.uw.adblock2 = false;
            Aak.uw.popAdsLoaded = true;
            // hide fake play button used to open popunder
            //Aak.addStyle('#videooverlay { display:none; }')
        }
},
youwatch_org: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=youwatch
    // test: http://youwatch.org/embed-59p7i3cdkse0-453x320.html
    // test: http://youwatch.org/59p7i3cdkse0
        host: ['youwatch.org', 'chouhaa.info', 'ahzahg6ohb.com', 'ahzahg6ohb.com'],
        onStart: function () {
            // skip anti-adblock
            Aak.uw.adsShowPopup1 = 1;
        },
        onIdle: function () {
            // renove ads + fake play button
            Aak.removeElement('#player_imj, #player_imj + div[id]');
        }
},
exashare_com: {
    // by: Watilin
    // pull: https://github.com/reek/anti-adblock-killer/pull/519
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=exashare.com
    // test:  http://exashare.com/galw2ge2kzsv
        host: ['exashare.com', 'chefti.info', 'bojem3a.info', 'ajihezo.info', 'yahmaib3ai.com', 'yahmaib3ai.com'],
        onStart: function () {
            // skip anti-adblock
            Aak.uw.adsShowPopup1 = 1;
        },
        onIdle: function () {
            // renove ads + fake play button
            Aak.removeElement('#player_gaz, #player_gaz + div[id]');
        }
},
an1me_se: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/190
        host: ['an1me.se'],
        onIdle: function () {
            setTimeout(function () {
                Aak.uw.isBlockAds2 = false;
            }, 10000);
        }
},
hqq_tv: { // putlocker.is
        host: ['hqq.tv'],
        onIdle: function () {
            // + abp rule
            // http://hqq.tv/player/embed_player.php?vid=R3DGHG3GKXX7&autoplay=no
            if ('/player/embed_player.php' == location.pathname) {
                document.querySelector('form[id^="form-"]').submit();
            }
        }
},
// Poland
wp_domains: {
    // Note: disable EasyPrivacy
    // issue: https://github.com/reek/anti-adblock-killer/issues/956
    // issue: https://github.com/reek/anti-adblock-killer/issues/905
    // issue: https://github.com/reek/anti-adblock-killer/issues/300
        host: ['biztok.pl', 'wp.tv', 'wp.pl', 'sportowefakty.pl', 'kafeteria.tv', 'kafeteria.pl', '.wrzuta.pl', 'pudelek.tv', 'komediowo.pl', 'sfora.pl', 'autokrata.pl', 'sportfan.pl', 'wawalove.pl', 'hotmoney.pl', 'aleseriale.pl', 'babol.pl', 'snobka.pl', 'nocoty.pl', 'money.pl', 'abczdrowie.pl', 'gadzetomania.pl', 'autokult.pl', 'komorkomania.pl'],
        onStart: function () {
            // prevent popup anti-adblock from abczdrowie.pl
            Aak.setCookie('ABCABC', true);
        },
        onIdle: function () {
            return; //Fixed in AdBlock Protector

            Aak.hasElement('.wp-player', function () {

                var replacePlayerWP = function (mid, player) {
                    /* Request
                    http://get.wp.tv/?mid=1661056
                    http://wp.tv/player/mid,1661056,embed.json
                    http://get.wp.tv/?f=2896462.1426329056904.l.webm&rnd=1
                    https://wp.tv/player/mid,1747117,embed.json
                     */
                    Aak.request({
                        url: 'http://wp.tv/player/mid,' + mid + ',embed.json',
                        onload: function (result) {
                            var res = result.responseText;
                            var obj = JSON.parse(res);
                            Aak.log(obj);

                            var Player = new Aak.player();
                            Player.videojs(player, {
                                source: Aak.fixProtocolURL(obj.clip.url[1].url), // HD
                                type: 'mp4',
                                autoplay: false
                            });
                        }
                    });
                };

                var replacePlayerWrzuta = function (key, channel, elem) {
                    Aak.request({
                        // http://www.wrzuta.pl/npp/embed/wolnapolska2/0I0HQ2mutJc
                        url: 'http://www.wrzuta.pl/npp/embed/' + channel + '/' + key,
                        onload: function (result) {
                            var res = result.responseText;
                            var obj = JSON.parse(res);
                            Aak.log(obj);

                            var Player = new Aak.player();
                            Player.videojs(elem, {
                                source: Aak.fixProtocolURL(obj.url[0].url), //HD
                                type: 'mp4',
                                autoplay: false
                            });
                        }
                    });
                };

                // Using an external flash player is impossible because protected by crossdomain.xml
                var players = document.querySelectorAll('.wp-player'); //  #Player0, #Player1, #mainPlayer
                if (players.length) {
                    // fixbug gm_xhr loop request - http://tinyurl.com/pqa9htq
                    for (var i = 0; i < players.length; i++) {
                        var mid = null;
                        var player = players[i];
                        var parent = player.parentNode;
                        var script = player.previousSibling;
                        var title = player.querySelector('.titleCont a.title');
                        var embedvideos = document.querySelectorAll('script[src*="/embed_video.js"]');
                        Aak.log(player, parent, script, title);

                        if (embedvideos.length) {
                            // pudelek.wrzuta.pl: http://tinyurl.com/l8jo5v2
                            // pudelek.tv: http://tinyurl.com/klyzh6r, http://tinyurl.com/z7fr89v
                            // pudelek.tv (triple): http://tinyurl.com/n9b27o2
                            // film.wp.pl: http://tinyurl.com/q7k5bxp
                            var embedvideo = embedvideos[i];
                            var key = /key=(\w+)/.exec(embedvideo.src)[1];
                            var channel = /login=(\w+)/.exec(embedvideo.src)[1];
                            var autostart = /autoplay/.test(embedvideo.src);
                            replacePlayerWrzuta(key, channel, player, autostart);
                            Aak.log('embed_video.js');
                        } else if (title && /mid/.test(title.href)) {
                            // sportowefakty.pl: http://tinyurl.com/l6zabcx
                            mid = title.href.match(/mid[=,]([0-9]+)/);
                            Aak.log('title.href');
                        } else if (parent.id) {
                            if (parent.dataset.url) {
                                // wp.tv: http://tinyurl.com/pzde29t
                                mid = parent.dataset.url.match(/mid[=,]([0-9]+)/);
                                Aak.log('parent.dataset.url');
                            } else {
                                if (parent.previousSibling.innerHTML) {
                                    // wiadomosci.wp.pl: http://tinyurl.com/gqtt9ca
                                    mid = parent.previousSibling.innerHTML.match(/mid[=,]([0-9]+)/);
                                    Aak.log('script.inline.innerHTML');
                                } else {
                                    // kafeteria.tv: http://tinyurl.com/nofp58a
                                    // abczdrowie.pl: http://tinyurl.com/hx6s5et
                                    mid = parent.innerHTML.match(/mid[=,]([0-9]+)/);
                                    Aak.log('parent.innerHTML');
                                }
                            }
                        } else if (script && script.tagName == 'SCRIPT') {
                            // film.wp.pl: http://tinyurl.com/mh9onfw
                            // pudelek.tv (double): http://tinyurl.com/lefvwtx
                            mid = script.innerHTML.match(/mid[=,]([0-9]+)/);
                            Aak.log('script.src.innerHTML');
                        }
                        if (mid !== null && mid.length == 2) {
                            replacePlayerWP(mid[1], player);
                        }
                    }
                }
            });
        }
},
moje_filmy_network: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1010
    // source: http://pastebin.com/7G2RBnqq
        host: ['moje-filmy.tk', 'moje-filmy.live'],
        onIdle: function () {
            var searchvalue = ['var playerInstance', '});'];
            var script = Aak.hasScript(searchvalue[0]);

            if (script) {
                var source = script.innerHTML;
                var str = source.substring(source.lastIndexOf(searchvalue[0]), source.lastIndexOf(searchvalue[1]) + searchvalue[1].length);
                Aak.addScript(str);
            }
        }
},
tvn_pl: {
    // by: Reek, Marek
    // solution: http://tinyurl.com/ohbvz4r, http://tinyurl.com/jq8s462
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=tvn.pl
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=tvn24.pl
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=player.pl
    // test: http://tinyurl.com/o6d9h66, http://tinyurl.com/z77m4zh
        host: ['tvn.pl', 'tvn24.pl', 'player.pl'],
        onEnd: function () {
            return; //Fixed in AdBlock Protector

            Aak.hasElement('header.detailImage', function (thisElement) {
                if (Aak.getCookie('country_code') && Aak.getSession('generateToken')) {
                    var parts = document.location.href.split(/[.,]/);
                    var id = parts[parts.length - 2];
                    var params = {
                        platform: "Mobile",
                        terminal: "Android",
                        format: "json",
                        v: "2.0",
                        authKey: "b4bc971840de63d105b3166403aa1bea",
                        type: "episode",
                        id: id,
                        sort: "newest",
                        m: "getItem",
                        deviceScreenHeight: 1600,
                        deviceScreenWidth: 2560
                    };
                    var api = 'https://api.tvnplayer.pl/api/?' + Aak.serialize(params);
                    var proxy = 'http://www.proxy.xmc.pl/index.php?hl=3e5&q=';

                    // Get videoUrl
                    Aak.request({
                        url: Aak.getCookie('country_code') != 'PL' ? proxy + Aak.encodeURI(api) : api,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Linux; U; Android 4.2; en-us; Nexus 10 Build/JVP15I) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30"
                        },
                        onload: function (result) {
                            var res = result.responseText;
                            Aak.log(res);
                            var o = JSON.parse(res);
                            var videoUrl = o.item.videos.main.video_content[Number(Aak.opts.videoHD)].url;
                            var generateToken = new Function('videoUrl', Aak.getSession('generateToken'));
                            var videoUrlWithSeed = generateToken(videoUrl);
                            var Player = new Aak.player();
                            Player.videojs(thisElement, {
                                source: videoUrlWithSeed,
                                type: 'mp4',
                                autoplay: false
                            }, {}, { insert: 'inner' });
                        }
                    });
                } else {
                    Aak.request({ // get and store generateToken function
                        url: 'http://pastebin.com/raw/D9qM4DR3',
                        onload: function (response) {
                            var res = response.responseText;
                            Aak.setSession('generateToken', res);
                            Aak.request({ // get user ip
                                url: 'http://ip-api.com/json',
                                onload: function (response) {
                                    var res = response.responseText;
                                    var json = JSON.parse(res);
                                    Aak.setCookie('country_code', json.countryCode);
                                    Aak.refresh();
                                }
                            });
                        }
                    });
                }
            });
        }
},
ipla_tv: {
    // by: Marek
    // solution: http://tinyurl.com/ptb4ybg
    // issue. https://github.com/reek/anti-adblock-killer/issues/522
    // test: http://tinyurl.com/hz7gpxx
        host: ['ipla.tv'],
        onIdle: function () {
            Aak.addStyle('.html5-player-wrapper { display:none; }'); // chrome/opera
            var oldPlayer = document.querySelector('.html5-player-wrapper, #vod-player');
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
},
koscian_net: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/914
    // source: http://pastebin.com/yGSPBRqe
        host: ['koscian.net'],
        onIdle: function () {
            var elems = document.querySelectorAll('.ban');
            for (var i = 0; i < elems.length; i++) {
                elems[i].remove();
                //elems[i].innerHTML = '<br>';
            }
        }
},
// France
playtv_fr: { // research solution
        host: ['play.tv', 'playtv.fr'],
        onAlways: function () { },
        onEnd: function () { }
},
rmcsportbfmtv_com: { // webradio
        host: ['rmcsport.bfmtv.com'],
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
},
eclypsia_com: {
        host: ['eclypsia.com'],
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
            var element = document.querySelector('div[id^="webtv_iframe_"]');
            if (element !== null) {
                var videoId = element.id.split('_')[2];
                setTimeout(function () {
                    element.innerHTML = '<iframe frameborder="0" width="812" height="500" src="http://www.dailymotion.com/embed/video/' + videoId + '?logo=0&autoPlay=1&autoMute=0"></iframe>';
                }, 1000);
            }
        }
},
m6web_fr: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/461
    // test: http://tinyurl.com/ptn2vrl
        host: ['m6web.fr'],
        onEnd: function () {
            var player = document.querySelector('object[id$="_flash_api"]');
            var script = Aak.hasScript('M6.Player.config');

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
},
gamingroom_tv: {
        host: ['gamingroom.tv'],
        onAlways: function () {
            Aak.uw.adblock_detect = function () { };
            Aak.uw.GR_adblock_hide_video = function () { };
            Aak.uw.adblock_video_msg_start = function () { };
            Aak.uw.adblock_video_msg_stop = function () { };
            Aak.uw.disable_chat = function () { };
        }
},
// Germany
now_domains: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/336
    // test: http://tinyurl.com/peeobou
    // test: http://jsbin.com/vucobejofo
        host: ['voxnow.de', 'rtl-now.rtl.de', 'rtl2now.rtl2.de', 'n-tvnow.de', 'superrtlnow.de', 'rtlnitronow.de', 'nowtv.de'],
        onIdle: function () {
            /*
            var Player = new Aak.player();
            Player.editing('#videoplayer', {
            unsetFlashvars : 'abcheck_enabled,adcall,adclasses,adconfig,admeta,adslog,agof,ama,angebot,as,asparts,breakad,connectioncheck,cslog,dev,dimmer,errorlog,feedback,fmsident,gtv,highlights,ivw,ivw_play,js,js_event_function,logo,logo_basewidth,logopos,nielsen,ord,osmf,svm,tile,videoplaza,videoplaza_base_url,videoplaza_share,videoplaza_tag,vpEnvironmentURL,xl'
            });
             */
        }
},
rtl_de: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1541
    // test: http://tinyurl.com/h7ccvqq
        host: ['rtl.de'],
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
},
myspass_de: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/76
    // test: http://tinyurl.com/lto9pyd
        host: ['myspass.de'],
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
                        Aak.removeElement('div.loadingGif');

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
},
// Nederland
rtlxl_nl: {
    // test: http://tinyurl.com/l2zkv3d
        host: ['rtlxl.nl', 'rtlnieuws.nl'],
        onEnd: function () {
            var Player = new Aak.player();
            Player.editing('#_rtlosmf0', {
                setFlashvars: {
                    adblock: false
                }
            });
        }
},
// Norway
vgtv_network: {
    // note: skip video ads + anti-adblock
    // jwplayer: http://tinyurl.com/zyv79hg
    // issue: https://github.com/reek/anti-adblock-killer/issues/1402
    // issue: https://github.com/reek/anti-adblock-killer/issues/367
    // test: http://tinyurl.com/nwp85t, http://tinyurl.com/nwp85t
        host: ['vgtv.no', 'vg.no'],
        onEnd: function () {
            return; //Code commented out by Reek

            var oldHash = null;
            var videoId = null;
            var videoIdRegex = /#\!\/video\/(\d+)\//;

            // check if the location hash changes
            setInterval(function () {
                var player = Aak.getElement('.video-player');

                if (player && location.hash != oldHash && videoIdRegex.test(location.hash)) {
                    oldHash = location.hash;
                    videoId = oldHash.match(videoIdRegex)[1];
                    /*
                                  var hlsurl = 'https://svpsecurehdvod-vh.akamaihd.net/i/2016/03/20160312_56e421f86af45_vg01/,1280_720_3500,960_540_1500,640_360_800,480_270_500,.mp4.csmil/master.m3u8';
                                  console.log(player)
                    
                                  // don't work with chrome
                                  // player.innerHTML = '<div id="noAdPlayer">This text will be replaced with a player.</div>';
                    
                    
                                  // can't load m3u8 4032 status code
                                  //console.log(unsafeWindow.jwplayer)
                    
                                  Aak.request({
                                    url : 'http://svp.vg.no/svp/api/v1/vgtv/assets/' + videoId + '?additional=settings|chapters|cuePoints|externalId|barrels|externalCategoryId|nextAsset&appName=vgtv-website',
                                    onload : function (result) {
                                      var res = result.responseText;
                                      var obj = JSON.parse(res);
                                      Aak.log(obj);
                    
                                      // replace player
                                      var Player = new Aak.player();
                                      Player.vlc(player, {
                                        source : obj.streamUrls.hls, // m3u8
                                        type : 'hls',
                                        autoplay : false
                                      });
                                    }
                                  }, {}, {
                                    insert : 'inner'
                                  });
                    */
                }
            }, 1e3);
        }
},
mtg_radio: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1495
        host: ['play.radio1.se', 'play.bandit.se', 'play.lugnafavoriter.com', 'play.rixfm.se'],
        onEnd: function () {
            Aak.addScript(function () {
                setTimeout(function () {
                    window.player_load_live(window.stream_id);
                }, 1000);
            });
        }
},
dplay_network: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1463
        host: ['dplay.com', 'dplay.dk', 'dplay.se'],
        onStart: function () {
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
},
viasat_tv: {
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
        host: ['tv3play.no', 'tv3play.dk', 'tv3play.se', 'tv6play.se', 'tv8play.se', 'tv10play.se', 'tvplay.skaties.lv', 'play.tv3.lt', 'tv3play.tv3.ee'],
        onIdle: function () {
            Aak.hasElement('#video-player', function (thisElement) {
                thisElement.id = '';
                //var videoId = location.pathname.split('/').pop();
                var videoId = thisElement.getAttribute('data-video-id');
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
},
// Russia
rutube_ru: { // research solution
    /* test: http://rutube.ru/video/bd5f6047657f0bdcbfbb0edad2bb7c61/ */
        host: ['rutube.ru'],
        onEnd: function () {
            Aak.hasElement('#rutubePlayerHolder', function () {            //dmFyIG9wdHMgPSBBYWsuZ2V0RWxlbWVudCgiI29wdGlvbnMiKTsNCiAgICAgICAgICAgIHZhciBvID0gQWFrLmludG9PYmplY3Qob3B0cy5kYXRhc2V0LnZhbHVlKTsNCiAgICAgICAgICAgIHZhciBtM3U4VXJsID0gby52aWRlb19iYWxhbmNlci5tM3U4Ow0KICAgICAgICAgICAgY29uc29sZS5sb2cobTN1OFVybCk7DQoNCiAgICAgICAgICAgIHZhciBQbGF5ZXIgPSBuZXcgQWFrLnBsYXllcigpOw0KICAgICAgICAgICAgUGxheWVyLnZpZGVvanMoJyNydXR1YmVQbGF5ZXJIb2xkZXInLCB7DQogICAgICAgICAgICAgICAgc291cmNlIDogbTN1OFVybCwNCiAgICAgICAgICAgICAgICB0eXBlIDogJ2hscycsDQogICAgICAgICAgICAgICAgLy9wcm94eTogdHJ1ZSwNCiAgICAgICAgICAgICAgICBhdXRvcGxheSA6IHRydWUNCiAgICAgICAgICAgICAgfTsgKTs=
                /* decode: 
                var opts = Aak.getElement("#options");
    var o = Aak.intoObject(opts.dataset.value);
    var m3u8Url = o.video_balancer.m3u8;
    console.log(m3u8Url);

    var Player = new Aak.player();
    Player.videojs('#rutubePlayerHolder', {
        source : m3u8Url,
        type : 'hls',
        //proxy: true,
        autoplay : true
      }; );*/
            });
        }
},
// Italy
rai_tv: { // research solution
        host: ['rai.tv'],
        onStart: function () { },
        onIdle: function () { }
},
// TV Stream
block_streams_tv: {
    // note: redirect to http://block.streams.tv/
        host: ['firstrow.co', 'firstrows.ru', 'firstrows.tv', 'firstrows.org', 'firstrows.co', 'firstrows.biz', 'firstrowus.eu', 'firstrow1us.eu', 'firstsrowsports.eu', 'firstrowsportes.tv', 'firstrowsportes.com', 'justfirstrowsports.com', 'hahasport.me', 'wiziwig.ru', 'wiziwig.sx', 'wiziwig.to', 'wiziwig.tv', 'myp2p.biz', 'myp2p.tv', 'myp2p.la', 'myp2p.ec', 'myp2p.eu', 'myp2p.sx', 'myp2p.ws', 'myp2p.com', 'atdhe.ru', 'atdhe.se', 'atdhe.bz', 'atdhe.top', 'atdhe.to', 'atdhe.me', 'atdhe.mx', ' atdhe.li', 'atdhe.al'],
        onAlways: function () {
            Aak.setCookie("adb", 1); // prevent anti-adblock
            Aak.uw.open = function () { }; // prevent popup
            Aak.addStyle("#bannerInCenter, #hiddenBannerCanvas { display: none; }"); // hide ads
        }
},
buzina_xyz: {
    // note: disable refcontrol, used by firstrowsports
    // issue: https://github.com/reek/anti-adblock-killer/issues/1268
    // issue: https://github.com/reek/anti-adblock-killer/issues/1243
    // issue: https://github.com/reek/anti-adblock-killer/issues/889
    // issue: https://greasyfork.org/forum/discussion/8975
    // source: http://pastebin.com/8VTrkvS9
        host: ['buzina.xyz', 'farmet.info', 'rimladi.com', 'kitorelo.com', 'omnipola.com', 'porosin.co.uk', 'rimleno.com', 'simple4alls.com', 'arsopo.com'],
        onStart: function () {
            Aak.addStyle("#adsframe { height: 151px; }");
        },
        onIdle: function () {
            if (/buzina.xyz/.test(location.host)) { // keeps same host stream
                Aak.hasElement('iframe[src*=".php?hash="]', function (thisElement) {
                    // http://arsopo.com/w2.php?hash=panda58
                    // http://www.buzina.xyz/nana1v1.php?onthetop
                    var parts = thisElement.src.split('/');
                    parts[2] = Aak.rules.buzina_xyz.host.pop();
                    Aak.log(thisElement, parts);
                    thisElement.src = parts.join('/');

                    /*	dmFyIG8gPSB7CgkJCSAgICAicGxheWxpc3QiIDogW3sKCQkJICAgICAgICAicHJvdmlkZXIiIDogInJ0bXAiLAoJCQkgICAgICAgICJ1cmwiIDogInBhbmRhMT9lJTNEMTQ2NTA3MDMyNiUyNnN0JTNEUHJ0SFl5dkJ6ZDlaZDdoRF9mUkhUZzExMTEzMCIKCQkJICAgICAgfQoJCQkgICAgXSwKCQkJICAgICJwbHVnaW5zIiA6IHsKCQkJICAgICAgInJ0bXAiIDogewoJCQkgICAgICAgICJ1cmwiIDogImZsb3dwbGF5ZXIucnRtcC0zLjIuMTEuc3dmIiwgCgkJCQkJLy8idXJsIjogImh0dHA6Ly9yZWxlYXNlcy5mbG93cGxheWVyLm9yZy9zd2YvZmxvd3BsYXllci5ydG1wLTMuMi4xMS5zd2YiLAoJCQkgICAgICAgICJuZXRDb25uZWN0aW9uVXJsIiA6ICJydG1wOi8vMTg1LjgyLjIxNS40NTozNTc5L3ZvZC8iCgkJCSAgICAgIH0sCgkJCSAgICAgICJjb250cm9scyIgOiB7CgkJCQkgICAgInVybCI6ICJodHRwOi8vcmVsZWFzZXMuZmxvd3BsYXllci5vcmcvc3dmL2Zsb3dwbGF5ZXIuY29udHJvbHMtMy4yLjE2LnN3ZiIsIC8vIGFkZGVkIGJlY2F1c2UgbWlzc2luZwoJCQkgICAgICAgICJwbGF5IiA6IGZhbHNlLAoJCQkgICAgICAgICJzY3J1YmJlciIgOiBmYWxzZQoJCQkgICAgICB9CgkJCSAgICB9LAoJCQkgICAgInBsYXllcklkIiA6ICJwbGF5ZXIiLAoJCQkgICAgImNsaXAiIDogewoJCQkgICAgICAidXJsIiA6ICJwYW5kYTE/ZSUzRDE0NjUwNzAzMjYlMjZzdCUzRFBydEhZeXZCemQ5WmQ3aERfZlJIVGcxMTExMzAiCgkJCSAgICB9CgkJCSAgfQoKCQkJICB2YXIgbmV3VXJsID0gcGFydHMuc2xpY2UoMCwgMykuam9pbignLycpICsgJy9mbG93cGxheWVyLTMuMi4xNi5zd2Y/Y29uZmlnPScgKyBlc2NhcGUoSlNPTi5zdHJpbmdpZnkobykpOwoJCQkgIC8vdmFyIG5ld1VybCA9ICdodHRwOi8vcmVsZWFzZXMuZmxvd3BsYXllci5vcmcvc3dmL2Zsb3dwbGF5ZXItMy4yLjE2LnN3Zj9jb25maWc9JyArIGVzY2FwZShKU09OLnN0cmluZ2lmeShvKSk7CgkJCSAgY29uc29sZS5sb2cobmV3VXJsKTsKCQkJICB0aGlzRWxlbWVudC5zcmMgPSBuZXdVcmw7
                    */

                });
            } else { // skip anti-adblock
                Aak.removeElement('#adsframe');
                Aak.getElement('#remove-over').click();
            }
        }
},
allmyvideos_net: {
    // note: obfuscated
    // issue: https://github.com/reek/anti-adblock-killer/issues/274
        host: ['allmyvideos.net', 'amvtv.net'],
        onStart: function () {
            // skip fake play button
            Aak.setCookie('_favbt33', 1);
        }
},
ilive_domains: {
        host: ['ilive.to', 'streamlive.to'],
        onEnd: function () {
            if (/^\/embedplayer.php/i.test(location.pathname)) {
                setTimeout(function () {
                    // Skip timer
                    Aak.uw.removeOverlayHTML();
                }, 1000);
            }
        }
},
micast_tv: {
        host: ['micast.tv'],
        onStart: function () {
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
},
pxstream_tv: {
        host: ['pxstream.tv'],
        onEnd: function () {
            if (/^\/embedrouter.php/.test(location.pathname)) {
                setTimeout(function () {
                    // Skip timer and close ads
                    Aak.uw.closeAd();
                }, 1000);
            }
        }
},
sawlive_tv: {
        host: ['sawlive.tv'],
        onIdle: function () {
            if (/^\/embed\/watch\//i.test(location.pathname)) {
                // Skip timer and close ads
                Aak.uw.display = false;
                Aak.uw.closeMyAd();
            }
        }
},
goodcast_co: {
        host: ['goodcast.co'],
        onIdle: function () {
            if (/^\/stream.php/.test(location.pathname)) {
                // remove ads allowed by easylist
                Aak.uw.$(".advertisement").hide();
                Aak.uw.$('.adsky iframe').attr("src", "about:blank");
            }
        }
},
showsport_tv_com: {
        host: ['showsport-tv.com'],
        onIdle: function () {
            if (/^\/ch.php/.test(location.pathname)) {
                // remove ads allowed by easylist
                Aak.removeElement('#advertisement, .advertisement');
            }
        }
},
sharecast_to: {
        host: ['sharecast.to'],
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
                Aak.removeElement('#table1');
            }
        }
},
videomega_tv: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=videomega
        host: ['videomega.tv'],
        onStart: function () {
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
            var script = Aak.hasScript('Please disable AdBlock Plugin to watch the video');
            if (script) {
                var source = script.innerHTML;
                var substring = source.substring(source.lastIndexOf('eval('), source.lastIndexOf(')') + 1);
                var deobfuscated = Aak.unpackScript(substring);
                var newScript = 'if(' + deobfuscated.substring(deobfuscated.indexOf('true'));
                Aak.addScript(newScript);
            }
        }
},
flowplayer_antiadblock: {
        host: ['videofun.me', 'videobug.net', 'video44.net', 'play44.net', 'byzoo.org', 'playbb.me', 'videowing.me', 'videozoo.me', 'easyvideo.me', 'playpanda.net'],
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
},
r3z: {
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=label:R3Z
    // source: http://pastebin.com/C159kevn
        host: ['cityam.com', 'computerworlduk.com', 'techworld.com', 'v3.co.uk'],
        onStart: function () {
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
},
google_jobrunner: {
    // issue: https://greasyfork.org/en/forum/messages/405
    // issue: https://github.com/reek/anti-adblock-killer/issues/1343
    // issue: https://github.com/reek/anti-adblock-killer/issues/1342
    // issue: https://github.com/reek/anti-adblock-killer/issues/831
    // issue: https://github.com/reek/anti-adblock-killer/issues/1274
    // issue: https://github.com/reek/anti-adblock-killer/issues/1262
    // issue: https://github.com/reek/anti-adblock-killer/issues/561
        host: ['next-episode.net', 'kingmaker.news', 'gamespowerita.com', 'todayidol.com', 'receive-a-sms.com', 'wakeupcallme.com', 'ringmycellphone.com', 'faqmozilla.org', 'thememypc.com'],
        onAlways: function () {
            Aak.uw.google_jobrunner = {};
        }
},
// fuckadbock customized
fab_dawn_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1747
        host: ['dawn.com'],
        onStart: function () {
            Aak.fakeFuckAdBlock('detectAdBlock', 'DetectAdBlock');
        }
},
fab_sports_fr: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1217
    // source: http://pastebin.com/SpEN5duS
        host: ['sports.fr'],
        onStart: function () {
            Aak.fakeFuckAdBlock('fabInstance', 'FabInstance');
        }
},
fab_europe1_fr: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1188
    // source: http://pastebin.com/ULe1vzQR
        host: ['europe1.fr'],
        onStart: function () {
            Aak.fakeFuckAdBlock('fabInstance', 'FabInstance');
        }
},
fab_newyorker_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1177
        host: ['newyorker.com'],
        onStart: function () {
            Aak.fakeFuckAdBlock('sniffAdBlock', 'SniffAdBlock');
        }
},
fab_wired_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1061
    // issue: https://greasyfork.org/fr/forum/discussion/8235
    // source: http://pastebin.com/Pq14v4FC
        host: ['wired.com'],
        onStart: function () {
            Aak.fakeFuckAdBlock('sniffAdBlock', 'SniffAdBlock');
        }
},
fab_mangasproject_domains: {
    // note: fuckadblock with custom instance name
    // note: also added abp rule
    // issue: https://github.com/reek/anti-adblock-killer/issues/1127
    // issue: https://greasyfork.org/fr/forum/discussion/4132
    // issue: https://github.com/reek/anti-adblock-killer/issues/858
    // source: https://mangas.zlx.com.br/mangazord_lib/js/lib/controllers/Leitor/Leitor.min.js
        host: ['mangasproject.com.br', 'mangasproject.net.br', 'mangas.zlx.com.br'],
        onStart: function () {
            Aak.fakeFuckAdBlock('mangasLeitorSlider', Aak.generateID());
        }
},
fab_qnimate_com: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/739
    // issue: https://github.com/reek/anti-adblock-killer/issues/705
    // note: fuckadblock customized
        host: ['qnimate.com'],
        onAlways: function () {
            Aak.uw.adBlockDetected = function () { };
        }
},
fab_eurotransport_de: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/858
    // note: fuckadblock with custom instance name
        host: ['eurotransport.de'],
        onStart: function () {
            Aak.fakeFuckAdBlock('antiAdBlock', Aak.generateID());
        }
},
fab_cadetect: {
    // by: Skr4tchGr3azyMonkiBallllllZzzz
    // issue: https://github.com/reek/anti-adblock-killer/issues/784
    // note: fuckadblock with custom instance name
        host: ['tzetze.it', 'beppegrillo.it', 'la-cosa.it'],
        onStart: function () {
            Aak.fakeFuckAdBlock('cadetect', 'CADetect');
        }
},
fab_agar_game: {
    // note: fuckadblock with custom instance name
    // issue: https://github.com/reek/anti-adblock-killer/issues/1257
    // issue: https://github.com/reek/anti-adblock-killer/issues/1135
        host: ['agario.sx', 'agarabi.com'],
        onStart: function () {
            Aak.fakeFuckAdBlock('agario_SX_ads', Aak.generateID());
        }
},
fab_filespace_com: {
    // note: fuckadblock with custom instance name
    // source: http://pastebin.com/YAS0As87
    // issue: https://github.com/reek/anti-adblock-killer/issues/1037
        host: ['filespace.com'],
        onStart: function () {
            Aak.fakeFuckAdBlock('fAB', Aak.generateID());
        }
},
fab_topserialy_sk: {
    // note: fuckadblock with custom instance name
    // source: http://pastebin.com/42tUQ9aV
        host: ['topserialy.sk'],
        onStart: function () {
            Aak.fakeFuckAdBlock('sratNaVas', Aak.generateID());
        }
},
fab_customized: {
    // issue: https://github.com/reek/anti-adblock-killer/issues/1455
    // issue: https://github.com/reek/anti-adblock-killer/issues/1657
    // source: http://pastebin.com/N42a5BjE
        host: ['epicurious.com', 'desktopsolution.org', 'indiatimes.com', 'hindustantimes.com', 'happytrips.com'],
        onStart: function () {
            Aak.addScript(function () {
                (function () {
                    var _setAttribute = window.Element.prototype.setAttribute;
                    window.Element.prototype.setAttribute = function (name, value) {
                        if (name == 'class' && value.indexOf('text_ads') != -1) {
                            value = '';
                            console.info(this, 'fab intercepted :-)');
                        }
                        _setAttribute.call(this, name, value);
                    };
                })();
            });
        }
},
d3xt3er_antiadblock: {
    // site: http://d3xt3r.com/anti-adblock
    // case: http://sport-show.fr/js/advertisement-AdBlock.js
    // case: http://www.2site.me/advertisement-AdBlock.js
        host: ['sport-show.fr', 'vipflash.net', '2site.me'],
        onStart: function () {
            Aak.addStyle("#blockblockA {visibility:invisible;display:none;} #blockblockA td {visibility:invisible;display:none;} #blockblockA td p {visibility:invisible;display:none;} #blockblockB {visibility:visible;display:block;}");
        }
},
adblock_notify: {
    // by: Skr4tchGr3azyMonkiBallllllZzzz
    // issue: https://github.com/reek/anti-adblock-killer/issues/1766
    // issue: https://github.com/reek/anti-adblock-killer/issues/1392
    // issue: https://github.com/reek/anti-adblock-killer/issues/1039
    // issue: https://github.com/reek/anti-adblock-killer/issues/592
    // issue: https://github.com/reek/anti-adblock-killer/issues/813
        host: ['gametransfers.com', 'winandmac.com', 'free-steam-giveaways.com', 'canalwp.com', 'alphahistory.com', 'nordpresse.be', 'sospc.name', 'baboo.com.br'],
        onAlways: function () {
            Aak.setCookie('anCookie', true);
            Aak.uw.anOptions = {};
        }
},
lutte_adblock: {
    // site: http://lutteadblock.blogspot.com/2014/11/le-script.html
    // issue: https://github.com/reek/anti-adblock-killer/issues/938
    // issue: https://github.com/reek/anti-adblock-killer/issues/580
        host: ['lewebtvbouquetfrancophone.overblog.com', 'webtv.bloguez.com', 'latelegratuite.blogspot.com', 'totaldebrid.org', '37.187.173.205', 'tvgratuite.blogspot.com'],
        onStart: function () {
            Aak.addBaitElement('div#my_ad_div');
            Aak.uw.jabbahud = function () { };
        }
},
antiblock: {
    // site: antiblock.org
    // note: customized
    // issue: 
        host: ['mybank.pl', 'rapidgrab.pl'],
        onStart: function () {
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
},
blockadblock: {
    // site: blockadblock.com
    // note: random instance name
    // source: https://gist.github.com/Watilin/af75e0a2e82a2efb384bde9c7b41dec8
    // issues: https://github.com/reek/anti-adblock-killer/issues?q=label:BlockAdBlock
    // issue: https://greasyfork.org/forum/discussion/8273
    // issue: https://greasyfork.org/forum/discussion/7625
        host: ['blockadblock.com', 'linkdrop.net', 'revclouds.com', 'leporno.org', 'uploadshub.com', 'dasolo.org', 'fullstuff.net', 'zeusnews.it', 'cheminots.net', 'lolsy.tv', 'animes-mangas-ddl.com', 'noticiasautomotivas.com.br', 'darkstars.org', 'corepacks.com', 'naturalbd.com', 'coolsoft.altervista.org', 'openload.us', 'cda-online.pl', 'urbanplanet.org', 'mamahd.com', 'sadeempc.com', 'avmoo.com', 'thailande-fr.com', 'btaia.com', 'tusoft.org', 'hisse.net', 'europeup.com', 'nrj.fr', 'srnk.co', 'animmex.co', 'socketloop.com', 'crackhex.com', 'revealedtricks4u.com', 'pizzamaking.com', 'computerworm.net', 'yourlifeupdated.net'],
        onStart: function () {
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
},
gpt_sp: {
    // by: Reek, Giwayume
    // note: when adblock detected inject new ads, redirect to http://tinyurl.com/zq2z5o6
    // issue: https://github.com/reek/anti-adblock-killer/issues/1636
    // issue: https://github.com/reek/anti-adblock-killer/issues/1596
    // issue: https://github.com/reek/anti-adblock-killer/issues/1297
    // issue: https://github.com/reek/anti-adblock-killer/issues/1144
    // issue: https://github.com/reek/anti-adblock-killer/issues/1542
    // source: http://pastebin.com/8Ajitfb2
        host: ['marketwatch.com', 'deadline.com', 'tweaktown.com', 'nypost.com', 'realgm.com', 'nasdaq.com'],
        onStart: function () {
            Aak.addStyle(".container--bannerAd, .col--ad { display: none; }");
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
},
krux_asl: {
    // note: when adblock detected inject new ads
    // source: http://pastebin.com/0HD7N84i
        host: ['commentcamarche.net', 'journaldesfemmes.com', 'linternaute.com'],
        onBeforeScript: function () {
            return [{
                detected: 'Krux{asl}',
                contains: 'Asl.prototype.inject',
                external: false,
                remove: true
            }
            ];
        }
},
krux_adp: {
    // note: when adblock detected inject new ads
    // source: 
        host: ['fourchette-et-bikini.fr', 'meteocity.com'],
        onStart: function () {
            Aak.uw.adProtect = 1;
        }
},
phoenix_goyavelab: {
    // note: when adblock detected inject new ads
    // note: script anti-adblock obfuscated,
    // issue: https://github.com/reek/anti-adblock-killer/issues/
    // doc: http://tinyurl.com/gl3ghq2
    // source: http://pastebin.com/hsAmdSuf
        host: ['demo-phoenix.com', 'dpstream.net', 'gum-gum-streaming.com', 'jeu.info', 'sofoot.com', 'gaara-fr.com', 'gaytube.com', 'tuxboard.com', 'xstory-fr.com', 'hentaifr.net', 'filmstreaming-hd.com', 'filmvf.net', 'hentaihaven.org', 'narutoshippudenvf.com', 'thebadbuzz.com', 'manga-news.com', 'jeu.video', 'mangas-fr.com'],
        onAlways: function () {
            //Aak.uw.__$dc = function () {};
            Aak.addStyle('body {visibility: visible;}');
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
},
ad_defend_uabp: {
    // note: when adblock detected inject new ads
    // source: http://pastebin.com/cFQCp80W
        host: ['tvspielfilm.de', 'finanzen.ch'],
        onBeforeScript: function () {
            return [{
                detected: 'AdDefend{UABPInject}',
                contains: 'UABPInject',
                external: false,
                remove: true
            }
            ];
        }
},
ad_defend_uab: {
    // note: when adblock detected inject new ads
    // userscript: https://openuserjs.org/scripts/schwarztee/AdDefend_Klatsche
    // userscript: https://gist.github.com/anonymous/a9b9956baf1d59a107c5
    // source: http://pastebin.com/1VyW0u9m, http://pastebin.com/AZqhRxWU
    // issue: https://github.com/reek/anti-adblock-killer/issues?q=label:AdDefend
    // pull: https://github.com/reek/anti-adblock-killer/pull/467
        host: ['watchgeneration.fr', 'turbo.fr', '24matins.fr', 'foot01.com', 'clubic.com', 'macg.co', 'begeek.fr', 'igen.fr', 'gamestar.de', 'focus.de', 'stern.de', 'sat1.', 'prosieben.', 'kabeleins.', 'sat1gold.', 'sixx.', 'prosiebenmaxx.', 'fem.com', 'the-voice-of-germany.', 'wetter.com', 'wetteronline.de', 'pcwelt.de', 'boerse-online.de', 'sportauto.de', 'auto-motor-und-sport.de', 'motor-klassik.de', '4wheelfun.de', 'autostrassenverkehr.de', 'lustich.de', 'spox.com', 'shz.de', 'transfermarkt.de', 'rp-online.de', 'motorradonline.de', '20min.ch', 'main-spitze.de', 'wormser-zeitung.de', 'lampertheimer-zeitung.de', 'wiesbdener-tagblatt.de', 'buerstaedter-zeitung.de', 'wiesbdener-kurier.de', 'rhein-main-presse.de', 'allgemeine-zeitung.de', 'ariva.de', 'spiegel.de', 'brigitte.de', 'dshini.net', 'gala.de', 'gamepro.de', 'gamona.de', 'pnn.de', 'promobil.de', 'sportal.de', 'webfail.com', 'computerbild.de', 'finanzen.net', 'comunio.de', 'medisite.fr'],
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
