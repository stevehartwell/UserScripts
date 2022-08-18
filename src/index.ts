// ==UserScript==
// @name            Subreddit Filter 
// @namespace       Violentmonkey Scripts
// @description     Filter subreddits from your reddit feed.
// @version         1.0.62
// @author          Steve Hartwell
// @match           https://www.reddit.com/r/popular/*
// @exclude-match   http*://www.reddit.com/user/*
// @match           https://www.reddit.com/*
// @noframes
// @run-at          document-end
// @grant           GM.getValue
// @grant           GM.setValue
// ==/UserScript==

import SubredditFilter from './SubredditFilter';

SubredditFilter.run();
