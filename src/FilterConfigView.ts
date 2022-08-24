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

        const configView = (
            _html('aside', { className: 'subfilt-config-pane' },
                _html('header', {},
                    _html('h1', {}, "Subreddit Filters"),
                    _html('hr'),
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
                    ),
                    _html('hr')
                ),
                this._filteredSubreddits,
                _html('hr'),
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

        document.body.append(..._createConfigDialog(), configView);
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
        alert('export');
    }
}

function _createConfigDialog(): Node[] {
    const idToggle = 'subfilt-config-checkbox';
    return [
        _html('input', { type: 'checkbox', id: idToggle }),
        _html('label', { className: 'subfilt-config-toggle', htmlFor: idToggle }),
        _html('div', { className: 'subfilt-config-dialog' })
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

