//
import FilterSet from './FilterSet';

import cssText from 'bundle-text:./FilterView.css';

export default class FilterView {

    constructor(filterSet: FilterSet) {
        this._filterSet = filterSet;

        const styles = document.createElement('style');
        styles.textContent = cssText;
        document.head.appendChild(styles);

        this._view = document.createElement('div');
        this._view.classList.add('listFilter');

        const h2 = document.createElement('div');
        h2.classList.add('headerFilter');
        h2.append("Subreddit Filters");

        const noProLabel = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = filterSet.hidePromoted;
        cb.addEventListener('change', (event) => {
            const cxb = event?.target as HTMLInputElement;
            filterSet.hidePromoted = cxb.checked;
        });
        noProLabel.append(cb, "Hide Promoted posts");

        this._ul = document.createElement('ul');
        this._ul.classList.add('ulFilter');
        this._ul.replaceChildren(...filterSet.sorted().map((aSub) => {
            return this._createLI(aSub);
        }));
        this._ul.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (!target?.matches('input[type=checkbox]')) {
                console.log(`!!! ignoring change event on ${target?.nodeName}`);
                return;
            }
            const sub = target?.parentElement?.textContent; // enclosing label
            this.filter(sub as string, target.checked);
        });

        this._view.append(h2, noProLabel, this._ul);

        //button to show or hide UI
        this._button = document.createElement('button');
        this._button.classList.add('toggleFilter');
        this._button.innerHTML = '+';
        this._button.title = 'show subreddit filters';
        this._button.addEventListener('click', () => {
            this._toggle();
        });

        document.body.append(this._view, this._button)
    }
    private _filterSet: FilterSet;
    private _view: HTMLElement;
    private _ul: HTMLElement;
    private _button: HTMLElement;
    private _show = false;

    private _toggle() {
        this._show = !this._show;
        this._view.style.display = this._show ? 'block' : 'none';
        this._button.innerHTML = this._show ? 'x' : '+';
    }

    filter(sub: string, hide: boolean) {
        this._filterSet.filter(sub, hide);
        if (hide) {
            // SHH FIXME insert in sort order
            this._ul.insertBefore(this._createLI(sub), this._ul.firstChild);
        }
        // else {
        //     // leave in list for now.
        // }
    }

    private _createLI(sub: string) {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = true;
        label.append(checkbox, sub);
        li.append(label);
        return li;
    }
}
