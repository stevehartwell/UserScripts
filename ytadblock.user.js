// ==UserScript==
// @name         Youtube adblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  enough with the ads!
// @author       4v3ngR
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

if (window.Oxdeadbeef === true) return;
window.Oxdeadbeef = true;


// Patches the ads for cold loading
(function() {
    var ytInitialPlayerResponse = null;

    function getter() {
        return ytInitialPlayerResponse;
    }

    function setter(data) {
        ytInitialPlayerResponse = { ...data, adPlacements: [] };
    }

    Object.defineProperty(window, 'ytInitialPlayerResponse', {
        get: getter,
        set: setter,
        configurable: true
    });
})();

// FETCH POLYFILL
(function() {
    const {fetch: origFetch} = window;
    window.fetch = async (...args) => {
        const response = await origFetch(...args);

        if (response.url.includes('/youtubei/v1/player')) {
            const text = () =>
                response
                    .clone()
                    .text()
                    .then((data) => data.replace(/adPlacements/, 'odPlacement'));

            response.text = text;
            return response;
        }
        return response;
    };
})();

// OTHER STUFF - just in case an ad gets through
(function() {
    window.autoClick = setInterval(function() {
        try {
            const btn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button')
            if (btn) {
                btn.click()
            }
            const ad = document.querySelector('.ad-showing');
            if (ad) {
                document.querySelector('video').playbackRate = 10;
            }
        } catch (ex) {}
    }, 100);

    window.inlineAdsInterval = setInterval(function() {
        try {
            const div = document.querySelector('#player-ads');
            if (div) {
                div.parentNode.removeChild(div);
            }
        } catch (ex) {}
    }, 500);
})();