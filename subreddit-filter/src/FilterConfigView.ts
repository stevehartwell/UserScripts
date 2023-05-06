//
/// <reference path="../../@types/parcel.d.ts" />

import FilterConfig from './FilterConfig'
import _htm from './html'

import configViewStyles from 'bundle-text:./FilterConfigView.css'

export default class FilterConfigView {

    constructor(config: FilterConfig) {
        this._config = new Proxy(config, {
            set: (target, prop, value) => {
                return false
            }
        })

        document.head.appendChild(_htm('style', {
            textContent: configViewStyles
        }))

        this._filteredSubreddits = (
            _htm('ul', {
                onchange: (event: Event) => {
                    const target = event.target as HTMLInputElement
                    if (!target?.matches('input[type=checkbox]')) {
                        console.info(`?? event on ${target?.nodeName}`)
                        return
                    }
                    // enclosing label
                    const sub = target?.parentElement?.textContent
                    this.filter(sub as string, target.checked)
                }
            })
        )

        const dialog = _createConfigDialog()
        dialog.appendChild(this._createConfigPane())
        document.body.append(dialog)
        this._reload()
    }
    private _config: FilterConfig
    private _filteredSubreddits: HTMLElement   // ul

    filter(sub: string, hide: boolean) {
        if (!this._config.filter(sub, hide)) {
            return
        }
        if (hide) {
            // SHH FIXME insert in sort order
            this._filteredSubreddits.insertBefore(_createLI(sub),
                this._filteredSubreddits.firstChild)
        }
        // else {
        //     // leave in list for now.
        // }
    }

    private _reload() {
        this._filteredSubreddits.replaceChildren() // first free up old
        this._filteredSubreddits.replaceChildren(
            ...this._config.hiddenSubreddits.map((aSub) => _createLI(aSub))
        )
    }

    private _createConfigPane() {
        return (
            _htm('div', { className: 'subfilt-config-pane' },
                _htm('header', {},
                    _htm('h1', {}, "Subreddit Filters"),
                ),
                this._filteredSubreddits,
                _htm('footer', {},
                    _htm('button', { type: 'button' },
                        _htm('label', {},
                            "import…",
                            _htm('input', {
                                type: 'file',
                                onchange: this._importConfig
                            })
                        )
                    ),
                    _htm('button',
                        {
                            type: 'button',
                            onclick: this._exportConfig
                        },
                        _htm('label', {},
                            "export…",
                            _htm('a')
                        )
                    )
                )
            )
        )
    }

    private _importConfig(ev: Event) {
        let target = ev.target as HTMLInputElement
        const r = new FileReader()
        r.onloadend = () => {
            console.log(r.error, r.result)
        }
        if (target.files && target.files.length) {
            r.readAsText(target.files[0])
        }
    }

    private _exportConfig(ev: Event) {
        let target = ev.target as HTMLElement
        if (target.tagName !== 'LABEL') {
            return // ignore a.click() bubble up
        }
        const a = target.querySelector('a')
        if (!a) return
        a.download = "subreddit-filters.json"
        a.href = URL.createObjectURL(
            new Blob([JSON.stringify(this._config)], {
                type: 'application/json'
            })
        )
        a.click()
    }
}

function _createConfigDialog() {
    const idToggle = 'subfilt-config-checkbox'
    return (
        _htm('aside', { className: 'subfilt-config' },
            _htm('input', { type: 'checkbox', id: idToggle }),
            _htm('label', {
                className: 'subfilt-config-backdrop',
                htmlFor: idToggle
            }),
            _htm('label', {
                className: 'subfilt-config-toggle',
                htmlFor: idToggle
            })
        )
    )
}

function _createLI(sub: string) {
    return (
        _htm('li', {},
            _htm('label', {},
                _htm('input', { type: 'checkbox', checked: true }),
                sub
            )
        )
    )
}

