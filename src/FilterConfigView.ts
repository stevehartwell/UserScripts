//
import FilterSet from './FilterSet';

import configViewStyles from 'bundle-text:./FilterConfigView.css';

export default class FilterConfigView {

    constructor(filterSet: FilterSet) {
        this._filterSet = filterSet;

        const styles = document.createElement('style');
        styles.textContent = configViewStyles;
        document.head.appendChild(styles);

        const configView = document.createElement('div');
        configView.classList.add('subfilt-config-view');

        const header = document.createElement('div');
        header.append("Subreddit Filters");

        const noProLabel = document.createElement('label');
        const noProCheckbox = document.createElement('input');
        noProCheckbox.type = 'checkbox';
        noProCheckbox.checked = this._filterSet.hidePromoted;
        noProCheckbox.addEventListener('change', (event) => {
            const cxb = event?.target as HTMLInputElement;
            this._filterSet.hidePromoted = cxb.checked;
        });
        noProLabel.append(noProCheckbox, "Hide Promoted posts");

        this._filteredSubreddits = document.createElement('ul');
        this._filteredSubreddits.classList.add('subfilt-scroll-list');
        this._filteredSubreddits.replaceChildren(...this._filterSet.sorted()
            .map((aSub) => {
                return _createLI(aSub);
            }));
        this._filteredSubreddits.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (!target?.matches('input[type=checkbox]')) {
                console.log(`!!! ignoring change event on ${target?.nodeName}`);
                return;
            }
            const sub = target?.parentElement?.textContent; // enclosing label
            this.filter(sub as string, target.checked);
        });
        configView.append(header, noProLabel, this._filteredSubreddits);

        document.body.append(..._createConfigDialog(), configView);
    }
    private _filterSet: FilterSet;
    private _filteredSubreddits: HTMLElement;

    filter(sub: string, hide: boolean) {
        if (!this._filterSet.filter(sub, hide)) {
            return;
        }
        if (hide) {
            // SHH FIXME insert in sort order
            this._filteredSubreddits.insertBefore(_createLI(sub),
                this._filteredSubreddits.firstChild);
        }
        // else {
        //     // leave in list for now.
        // }
    }
}


function _createConfigDialog(): Node[] {
    const idToggle = 'subfilt-config-checkbox';
    return [
        _html('input', { type: 'checkbox', id: idToggle }),
        _html('label', { className: 'subfilt-config-toggle', for: idToggle }),
        _html('div', { className: 'subfilt-config-present' })
    ]
}

function _createLI(sub: string) {
    return (
        _html('li', {},
            _html('label', {},
                _html('input', { type: 'checkbox', checked: true }),
                sub
            )
        )
    );
}

function _html(tag: string, attrs?: Object, ...children: (string | Node)[]) {
    const elem = document.createElement(tag);
    for (const [attr, value] of Object.entries(attrs || {})) {
        if (typeof value === 'function'
            || (typeof value === 'object' && 'handleEvent' in value)) {
            const name = attr.startsWith('on') ? attr.slice(2) : attr;
            document.addEventListener(name, value);
            continue;
        }
        if (attr in elem) {
            (elem as any)[attr] = value;
        } else {
            elem.setAttribute(attr, value);
        }
    }
    elem.append(...children);
    return elem;
}