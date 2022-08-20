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

        this._ul = document.createElement('ul');
        this._ul.classList.add('subfilt-scroll-list');
        this._ul.replaceChildren(...this._filterSet.sorted().map((aSub) => {
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
        configView.append(header, noProLabel, this._ul);

        document.body.append(...this._createConfigDialog(), configView);
    }
    private _filterSet: FilterSet;
    private _ul: HTMLElement;

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

    private _createConfigDialog() {
        const idToggleConfigView = 'subfilt-config-checkbox';

        const toggleViewCheckbox = document.createElement('input');
        toggleViewCheckbox.type = 'checkbox';
        toggleViewCheckbox.id = idToggleConfigView;

        const toggleViewLabel = document.createElement('label');
        toggleViewLabel.classList.add('subfilt-config-toggle');
        toggleViewLabel.setAttribute('for', idToggleConfigView);
        // togLabel.setAttribute('aria-label', '...');

        const configPresent = document.createElement('div');
        configPresent.classList.add('subfilt-config-present');

        return [toggleViewCheckbox, toggleViewLabel, configPresent];
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
