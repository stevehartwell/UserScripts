//

import FilterSet from './FilterSet';
import FilterConfigView from './FilterConfigView';

export default class SubredditFilter {
    static async run() {
        let filterSet = await FilterSet.load();
        console.log(filterSet);
        return new SubredditFilter(filterSet);
    }

    private _filterSet: FilterSet;
    private _configView: FilterConfigView;
    private _addedNodesObserver: MutationObserver;

    constructor(filterSet: FilterSet) {
        this._filterSet = filterSet;
        this._configView = new FilterConfigView(filterSet);

        if (document.readyState == 'complete') {
            this._applyFilters(document.body);
        }
        else {
            window.addEventListener('load', () => {
                this._applyFilters(document.body);
            });
        }

        this._addedNodesObserver = new MutationObserver((mutations) => {
            for (const aMutation of mutations) {
                for (const anAddedNode of aMutation.addedNodes) {
                    this._applyFilters(anAddedNode as HTMLElement);
                }
            }
        });
        this._addedNodesObserver.observe(document.body, {
            childList: true, subtree: true
        });
    }

    private _applyFilters(root: HTMLElement) {
        if (!('querySelectorAll' in root)) {
            console.log("!!! applyFilters: no querySelectorAll():", root);
            return;
        }
        for (const post of root.querySelectorAll('.scrollerItem')) {
            this._applyFilter(post as HTMLElement)
        }
    }

    // filter the post if sub in list of filters
    // add filter button to post
    private _applyFilter(post: HTMLElement) {
        if (post.style.display == 'none') {
            return;
        }
        const subLink = post.querySelector('[data-click-id=subreddit]');
        if (!subLink) {
            if (this._filterSet.hidePromoted
                && (post.textContent as string).indexOf('promoted') >= 0) {
                // SHH: maybe doable by .some-style {display: 'none' !important}?
                // console.log("Filtering Promoted");
                post.style.display = 'none';
            }
            return;
        }

        const subreddit = (subLink as HTMLAnchorElement).pathname;
        // console.log('post in subreddit:', subreddit);
        if (this._filterSet.isHidden(subreddit)) {
            // console.log("^^^ Hiding");
            post.style.display = 'none';
            return;
        }

        const btnloc = subLink.parentNode;
        if (!btnloc?.querySelector('.subButton')) {
            btnloc?.appendChild(this._makeFilterButton(subreddit));
        }
        // else {
        //     console.log("^^^ already has subButton");
        // }
    }

    private _makeFilterButton(subreddit: string) {
        let button = document.createElement('button');
        button.classList.add('subButton');
        button.innerHTML = '🚫';
        button.title = 'hide this subreddit from feed';
        button.addEventListener('click', () => {
            this._hideSubreddit(subreddit);
        });
        return button;
    }

    // add sub to list of filters
    private _hideSubreddit(sub: string) {
        this._configView.filter(sub, true);
        this._applyFilters(document.body);
    }
}
