(() => {
    if (a.uBOExtraExcluded) {
        return;
    }



/*******************************************************************************

    uBO-Extra - A companion extension to uBlock Origin: to gain ability to
                foil early hostile anti-user mechanisms working around
                content blockers.
    Copyright (C) 2016-2018 Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBO-WebSocket
*/

'use strict';

/* global HTMLDocument, XMLDocument */

/*******************************************************************************

    All scriptlets to inject: the scriptlets to inject are to foil or work
    around hostile anti-user mechanism used by some web sites.

**/

var scriptlets = [],
    hostname = window.location.hostname,
    contentScriptSecret =
        String.fromCharCode(Date.now() % 26 + 97) +
        Math.floor(Math.random() * 982451653 + 982451653).toString(36);

/*******************************************************************************

    Don't run on non-HTML documents.

**/

var abort = (function() {
    var doc = document;
    if ( doc instanceof HTMLDocument === false ) {
        if (
            doc instanceof XMLDocument === false ||
            doc.createElement('div') instanceof HTMLDivElement === false
        ) {
            return true;
        }
    }
    if ( (doc.contentType || '').lastIndexOf('image/', 0) === 0 ) {
        return true; 
    }
    return false;
})();

/*******************************************************************************

    Fetch hostname from ancestors if none available (we could be executed from
    inside an anonymous frame).

**/

if ( !abort ) {
    if ( hostname === '' ) {
        hostname = (function() {
            var win = window, hn = '', max = 10;
            try {
                for (;;) {
                    hn = win.location.hostname;
                    if ( hn !== '' ) { return hn; }
                    if ( win.parent === win ) { break; }
                    win = win.parent;
                    if ( !win ) { break; }
                    if ( (max -= 1) === 0 ) { break; }
                }
            } catch(ex) {
            }
            return hn;
        })();
    }
    // Don't inject if document is from local network.
    abort = /^192\.168\.\d+\.\d+$/.test(hostname);
}

/*******************************************************************************

    Instart Logic defuser

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36),
            targets = [
                'atob',
                'console.error',
                'INSTART',
                'INSTART_TARGET_NAME',
                'navigator.userAgent',
                'performance',
                'require'
            ],
            reScriptText = /\b(?:Instart-|I10C|I11C|IXC_|INSTART)/,
            reScriptSrc = /\babd.*?\/instart.js|\?i10c\./,
            thisScript = document.currentScript;
        var validate = function() {
            var script = document.currentScript;
            if ( script instanceof HTMLScriptElement === false ) { return; }
            if ( script === thisScript ) { return; }
            if ( script.src === '' ) {
                if ( reScriptText.test(script.textContent) ) {
                    throw new ReferenceError(magic);
                }
            } else if ( reScriptSrc.test(script.src) ) {
                throw new ReferenceError(magic);
            }
        };
        var makeGetterSetter = function(owner, prop) {
            var value = owner[prop];
            return {
                get: function() {
                    validate();
                    return value;
                },
                set: function(a) {
                    validate();
                    value = a;
                }
            };
        };
        var i = targets.length,
            owner, target, chain, prop;
        while ( i-- ) {
            owner = window;
            target = targets[i];
            chain = target.split('.');
            for (;;) {
                prop = chain.shift();
                if ( chain.length === 0 ) { break; }
                owner = owner[prop];
            }
            Object.defineProperty(owner, prop, makeGetterSetter(owner, prop));
        }
        var oe = window.onerror;
        window.onerror = function(msg) {
            if ( typeof msg === 'string' && msg.indexOf(magic) !== -1 ) {
                return true;
            }
            if ( oe instanceof Function ) {
                return oe.apply(this, arguments);
            }
        }.bind();
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            'afterellen.com',
            'americanphotomag.com',
            'atvrider.com',
            'baggersmag.com',
            'baltimoresun.com',
            'boatingmag.com',
            'boston.com',
            'cafemom.com',
            'calgaryherald.com',
            'calgarysun.com',
            'capitalgazette.com',
            'carrollcountytimes.com',
            'cattime.com',
            'cbssports.com',
            'chicagotribune.com',
            'chowhound.com',
            'chron.com',
            'chroniclelive.co.uk',
            'citypaper.com',
            'cnet.com',
            'comingsoon.net',
            'computershopper.com',
            'courant.com',
            'craveonline.com',
            'cruisingworld.com',
            'csgoutpost.com',
            'ctnow.com',
            'cycleworld.com',
            'dailydot.com',
            'dailypress.com',
            'dayzdb.com',
            'deathandtaxesmag.com',
            'delmartimes.net',
            'destinationweddingmag.com',
            'dirtrider.com',
            'diversitybestpractices.com',
            'dogtime.com',
            'dotaoutpost.com',
            'download.cnet.com',
            'edmontonjournal.com',
            'edmontonsun.com',
            'edmunds.com',
            'emedicinehealth.com',
            'esohead.com',
            'everydayhealth.com',
            'everquest.allakhazam.com',
            'extremetech.com',
            'fieldandstream.com',
            'financialpost.com',
            'floridatravellife.com',
            'flyingmag.com',
            'focus.de',
            'gamepedia.com',
            'gamerevolution.com',
            'gamespot.com',
            'geek.com',
            'goal.com',
            'gofugyourself.com',
            'growthspotter.com',
            'hearthhead.com',
            'hockeysfuture.com',
            'hotbikeweb.com',
            'hoylosangeles.com',
            'ibtimes.com',
            'ign.com',
            'infinitiev.com',
            'islands.com',
            'lajollalight.com',
            'laptopmag.com',
            'latintimes.com',
            'leaderpost.com',
            'legacy.com',
            'lifewire.com',
            'livescience.com',
            'lolking.net',
            'mcall.com',
            'mamaslatinas.com',
            'marlinmag.com',
            'medicaldaily.com',
            'medicinenet.com',
            'metacritic.com',
            'metrolyrics.com',
            'mmo-champion.com',
            'momtastic.com',
            'montrealgazette.com',
            'motorcyclecruiser.com',
            'motorcyclistonline.com',
            'motortrend.com',
            'msn.com',
            'musicfeeds.com.au',
            'mustangandfords.com',
            'mysanantonio.com',
            'nasdaq.com',
            'nationalpost.com',
            'newsarama.com',
            'newsweek.com',
            'orlandosentinel.com',
            'ottawacitizen.com',
            'ottawasun.com',
            'outdoorlife.com',
            'pcmag.com',
            'playstationlifestyle.net',
            'popphoto.com',
            'popsci.com',
            'ranchosantafereview.com',
            'range365.com',
            'ranker.com',
            'realclearpolitics.com',
            'realitytea.com',
            'redeyechicago.com',
            'salon.com',
            'saltwatersportsman.com',
            'sandiegouniontribune.com',
            'saveur.com',
            'scubadiving.com',
            'scubadivingintro.com',
            'seattlepi.com',
            'sfgate.com',
            'sherdog.com',
            'slate.com',
            'slickdeals.net',
            'southflorida.com',
            'space.com',
            'spin.com',
            'sporcle.com',
            'sportdiver.com',
            'sportfishingmag.com',
            'sportingnews.com',
            'sportrider.com',
            'spox.com',
            'stereogum.com',
            'streetchopperweb.com',
            'sun-sentinel.com',
            'superherohype.com',
            'superstreetbike.com',
            'tenplay.com.au',
            'tf2outpost.com',
            'thebalance.com',
            'thefashionspot.com',
            'theprovince.com',
            'thespruce.com',
            'thestarphoenix.com',
            'thoughtcatalog.com',
            'thoughtco.com',
            'timeanddate.com',
            'timesunion.com',
            'tomsguide.com',
            'tomsguide.fr',
            'tomshardware.co.uk',
            'tomshardware.com',
            'tomshardware.de',
            'tomshardware.fr',
            'torontosun.com',
            'totalbeauty.com',
            'trustedreviews.com',
            'tv.com',
            'tvguide.com',
            'tvtropes.org',
            'twincities.com',
            'utvdriver.com',
            'vancouversun.com',
            'vg.no',
            'vibe.com',
            'wakeboardingmag.com',
            'washingtonpost.com',
            'waterskimag.com',
            'webmd.com',
            'wetteronline.de',
            'wibc.com',
            'wikia.com',
            'windowscentral.com',
            'windsorstar.com',
            'winnipegsun.com',
            'workingmother.com',
            'wowhead.com',
            'wrestlezone.com',
            'xda-developers.com',
            'yachtingmagazine.com',
            'zam.com',
        ]
    });
})();

/*******************************************************************************

    Instart Logic buster: v2

    https://github.com/uBlockOrigin/uAssets/issues/227#issuecomment-268409666

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36);
        var makeNanovisorProxy = function() {
            return new Proxy({}, {
                get: function(target, name) {
                    switch ( name ) {
                    case 'HtmlStreaming':
                        return {
                            InsertTags: function(a, b) {
                                document.write(b); // jshint ignore:line
                            },
                            InterceptNode: function() {
                            },
                            PatchBegin: function() {
                            },
                            PatchEnd: function() {
                            },
                            PatchInit: function() {
                            },
                            ReloadWithNoHtmlStreaming: function() {
                                window.location.reload(true);
                            },
                            RemoveTags: function() {
                            },
                            UpdateAttributes: function() {
                            }
                        };
                    default:
                        return target[name];
                    }
                },
                set: function(target, name, value) {
                    switch ( name ) {
                    case 'CanRun':
                        target.CanRun = function() {
                            return false;
                        };
                        break;
                    default:
                        target[name] = value;
                    }
                }
            });
        };
        var instartInit;
        window.I10C = window.I11C = makeNanovisorProxy();
        window.INSTART = new Proxy({}, {
            get: function(target, name) {
                switch ( name ) {
                case 'Init':
                    return function(a) {
                        if (
                            a instanceof Object &&
                            typeof a.nanovisorGlobalNameSpace === 'string' &&
                            a.nanovisorGlobalNameSpace !== ''
                        ) {
                            window[a.nanovisorGlobalNameSpace] = makeNanovisorProxy();
                        }
                        a.enableHtmlStreaming = false;
                        a.enableQSCallDiffComputationConfig = false;
                        a.enableQuerySelectorMonitoring = false;
                        a.serveNanovisorSameDomain = false;
                        a.virtualDomains = 0;
                        a.virtualizeDomains = [];
                        instartInit(a);
                    };
                default:
                    if ( target[name] === undefined ) {
                        throw new Error(magic);
                    }
                    return target[name];
                }
            },
            set: function(target, name, value) {
                switch ( name ) {
                case 'Init':
                    instartInit = value;
                    break;
                default:
                    target[name] = value;
                }
            }
        });
        var oe = window.error;
        window.onerror = function(msg, src, line, col, error) {
            if ( msg.indexOf(magic) !== -1 ) {
                return true;
            }
            if ( oe instanceof Function ) {
                return oe(msg, src, line, col, error);
            }
        }.bind();
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            'calgaryherald.com',
            'edmontonjournal.com',
            'financialpost.com',
            'leaderpost.com',
            'montrealgazette.com',
            'nationalpost.com',
            'ottawacitizen.com',
            'theprovince.com',
            'thestarphoenix.com',
            'windsorstar.com',
        ]
    });
})();

/*******************************************************************************

    Instart Logic console detection defuser.

    To allow using the dev tools to investigate IL's code:
    - Un-comment out the block of code
    - Add the site you wish to investigate in the `targets` array.

**/


(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var realConsole = console,
            realLog = console.log;
        console.log = function () {
            for ( var i = 0; i < arguments.length; i++ ) {
                if ( arguments[i] instanceof HTMLElement ) { return; }
            }
            return realLog.apply(realConsole, arguments);
        }.bind(console);
        Object.defineProperty(console.log, 'name', { value: 'log' });
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            'laptopmag.com'
        ]
    });
})();

/*******************************************************************************

    Upmanager

    https://github.com/uBlockOrigin/uAssets/issues/251#issuecomment-276257642

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36);
        var oe = window.error;
        window.onerror = function(msg, src, line, col, error) {
            if ( msg.indexOf(magic) !== -1 ) { return true; }
            if ( oe instanceof Function ) {
                return oe(msg, src, line, col, error);
            }
        }.bind();
        Object.defineProperty(window, 'upManager', {
            set: function() {
                throw new Error(magic);
            }
        });
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            '101greatgoals.com',
            '4chan.org',
            'allthetests.com',
            'biology-online.org',
            'destructoid.com',
            'eurweb.com',
            'fullmatchesandshows.com',
            'grammarist.com',
            'jerusalemonline.com',
            'lucianne.com',
            'phonesreview.co.uk',
            'thefreethoughtproject.com',
            'veteranstoday.com',
            'walla.co.il',
            'yad2.co.il',
        ]
    });
})();

/*******************************************************************************

    Collate and add scriptlets to document.

**/

(function() {
    if ( scriptlets.length === 0 ) { return; }

    var restrFromString = function(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    var reFromArray = function(aa) {
        return new RegExp('(^|\\.)(' + aa.map(restrFromString).join('|') + ')$');
    };

    var scriptText = [], entry, re;

    while ( (entry = scriptlets.shift()) ) {
        if ( Array.isArray(entry.targets) ) {
            re = reFromArray(entry.targets);
            if ( re.test(hostname) === false ) { continue; }
        } else if ( Array.isArray(entry.exceptions) ) {
            re = reFromArray(entry.exceptions);
            if ( re.test(hostname) ) { continue; }
        }
        scriptText.push('(' + entry.scriptlet.toString() + ')("' + contentScriptSecret + '");');
    }

    if ( scriptText.length === 0 ) { return; }

    var elem = document.createElement('script');
    elem.appendChild(document.createTextNode(scriptText.join('\n')));
    try {
        (document.head || document.documentElement).appendChild(elem);
    } catch(ex) {
    }
    // Remove the script tag once executed (leave a clean DOM behind).
    elem.textContent = '';
    if ( elem.parentNode ) {
        elem.parentNode.removeChild(elem);
    }
})();



})();
