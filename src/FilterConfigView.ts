//
import FilterConfig from './FilterConfig';
import _html from './html';

import configViewStyles from 'bundle-text:./FilterConfigView.css';

export default class FilterConfigView {

    constructor(config: FilterConfig) {
        this._config = config;

        document.head.appendChild(_html('style', {
            textContent: configViewStyles
        }));

        this._filteredSubreddits = (
            _html('ul',
                {
                    onchange: (event: Event) => {
                        const target = event.target as HTMLInputElement;
                        if (!target?.matches('input[type=checkbox]')) {
                            console.info(`?? event on ${target?.nodeName}`);
                            return;
                        }
                        // enclosing label
                        const sub = target?.parentElement?.textContent;
                        this.filter(sub as string, target.checked);
                    },
                },
                ...this._config.sorted().map((aSub) => _createLI(aSub))
            )
        );

        const configPane = (
            _html('div', { className: 'subfilt-config-pane' },
                _html('header', {},
                    _html('h1', {}, "Subreddit Filters"),
                    _html('label', {},
                        _html('input', {
                            type: 'checkbox',
                            checked: this._config.hidePromoted,
                            onchange: (event: Event) => {
                                const cxb = event.target as HTMLInputElement;
                                this._config.hidePromoted = cxb.checked;
                            }
                        }),
                        "Hide Promoted posts"
                    )
                ),
                this._filteredSubreddits,
                _html('footer', {},
                    _html('button',
                        {
                            type: 'button',
                            onclick: () => this.import()
                        },
                        "import"),
                    _html('button',
                        {
                            type: 'button',
                            onclick: () => this.export()
                        },
                        "export"),
                )
            )
        );

        const dialog = _createConfigDialog();
        dialog.appendChild(configPane);
        document.body.append(dialog);
    }
    private _config: FilterConfig;
    private _filteredSubreddits: HTMLElement;

    filter(sub: string, hide: boolean) {
        if (!this._config.filter(sub, hide)) {
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

    import() {
        alert('import');
    }
    export() {
        let saveAs: string | null = "subreddit-filters.json";
        saveAs = window.prompt("Download filter settings?", saveAs);
        if (!saveAs) {
            return;
        }
        let a = document.createElement('a');
        a.download = saveAs!;
        a.href = URL.createObjectURL(
            new Blob([JSON.stringify(this._config)], {
                type: 'application/json'
            })
        );
        a.onclick = () => a.remove();
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
    }
}

function _createConfigDialog() {
    const idToggle = 'subfilt-config-checkbox';
    return (
        _html('aside', { className: 'subfilt-config' },
            _html('input', { type: 'checkbox', id: idToggle }),
            _html('label', {
                className: 'subfilt-config-backdrop',
                htmlFor: idToggle
            }),
            _html('label', {
                className: 'subfilt-config-toggle',
                htmlFor: idToggle
            })
        )
    )
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

