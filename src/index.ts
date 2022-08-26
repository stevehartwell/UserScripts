// ==UserScript==
// @name            Subreddit Filter 
// @namespace       https://github.com/stevehartwell
// @description     Filter subreddits from your reddit feed.
// @version         1.0.71
// @author          Steve Hartwell
// @match           https://www.reddit.com/r/popular/*
// @match           https://www.reddit.com/
// @noframes
// @run-at          document-end
// @grant           GM.getValue
// @grant           GM.setValue
// ==/UserScript==

import SubredditFilter from './SubredditFilter';

SubredditFilter.run();
