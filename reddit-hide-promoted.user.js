// ==UserScript==
// @name         Reddit Hide Promoted Posts
// @namespace    https://github.com/stevehartwell
// @version      1.0.3
// @description  Hides promoted links with CSS
// @author       Steve Hartwell
// @match        https://*.reddit.com/*
// @noframes
// @run-at       document-end
// @grant        none
// ==/UserScript==

(() => {
    const head = document.getElementsByTagName('head')[0];
    if (!head) {
        console.error('no <head> at document-end!');
        return;
    }
    // let config = { hidePromoted: true, hideSidebar: true }
    const frontpage = 'div[data-testid="frontpage-sidebar"],'
    const subreddit = 'div[data-testid="subreddit-sidebar"],'
    const promoted = '.promoted, .promotedlink'
    let css = `
    ${frontpage} ${subreddit} ${promoted} {
        display: none !important;
    }`
    const hidePromoted = document.createElement('style');
    hidePromoted.innerHTML = css;
    head.appendChild(hidePromoted);
})();
