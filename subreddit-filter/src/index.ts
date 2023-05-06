// ==UserScript==
// @name            Subreddit Filter 
// @namespace       https://github.com/stevehartwell
// @description     Filter subreddits from your reddit feed.
// @updateURL       https://raw.githubusercontent.com/stevehartwell/UserScripts/master/subreddit-filter/dist/subreddit-filter.user.js
// @homepageURL     https://github.com/stevehartwell/UserScripts/subreddit-filter
// @supportURL      https://github.com/stevehartwell/UserScripts/issues
// @version         1.0.74
// @author          Steve Hartwell
// @match           https://www.reddit.com/
// @match           https://www.reddit.com/best*
// @match           https://www.reddit.com/hot*
// @match           https://www.reddit.com/new*
// @match           https://www.reddit.com/top*
// @match           https://www.reddit.com/rising*
// @match           https://www.reddit.com/r/all*
// @match           https://www.reddit.com/r/popular*
// @noframes
// @run-at          document-end
// @grant           GM.getValue
// @grant           GM.setValue
// ==/UserScript==

import FilterConfig, { Store as FilterConfigStore } from './FilterConfig'
import SubredditFilter from './SubredditFilter'

class GMFilterConfigStore implements FilterConfigStore {

    async load(key: string, dv?: any) {
        return GM.getValue(key, dv).then((value) => {
            // todo
            return value
        })
    }

    async save(key: string, value: any) {
        try {
            return GM.setValue(key, value as any)
        }
        catch {
            return GM.setValue(key, JSON.stringify(value))
        }
    }
}

(async () => {
    const store = new GMFilterConfigStore()
    const config = await FilterConfig.loadFromStorage(store)
    const srf = new SubredditFilter(config)
    srf.run()
})()
