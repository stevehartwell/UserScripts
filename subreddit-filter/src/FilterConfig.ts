//
//
// import '@types/greasemonkey';

export type JSONValue = {
    hiddenSubreddits: string[]
}

export interface Store {
    load(key: 'hiddenSubreddits', defaultValue?: string[]): Promise<string[]>

    save(key: 'hiddenSubreddits', value: string[]): Promise<void>
}


export default class FilterConfig {

    static async loadFromStorage(store: Store) {
        const promises = [
            store.load('hiddenSubreddits', [])
        ]
        return Promise.all(promises).then((values) => {
            // console.info("saved values:", values);
            const config = new FilterConfig(store)
            let subreddits = values[0] as (string | string[])
            if (typeof subreddits === 'string') {
                subreddits = JSON.parse(subreddits) as string[]
            }
            config.hiddenSubreddits = subreddits
            return config
        })
    }

    constructor(store: Store) {
        this._store = store
    }
    private _store: Store
    private _hiddenSubreddits = new Set<string>();

    toJSON(): JSONValue {
        return {
            hiddenSubreddits: this.hiddenSubreddits
        }
    }

    get hiddenSubreddits() {
        return Array.from(this._hiddenSubreddits).sort((first, second) => {
            return first.localeCompare(second,
                undefined, { sensitivity: 'case' })
        })
    }
    set hiddenSubreddits(newValue) {
        this._hiddenSubreddits = new Set(newValue)
    }

    isHidden(sub: string) {
        return this._hiddenSubreddits.has(sub)
    }

    filter(sub: string, hide: boolean) {
        if (this.isHidden(sub) == hide) {
            return false
        }
        if (hide) this._hiddenSubreddits.add(sub)
        else /**/ this._hiddenSubreddits.delete(sub)

        const arrayValue = [...this._hiddenSubreddits]
        this._store?.save('hiddenSubreddits', arrayValue)
        return true
    }
}


function lowerBound<T>(item: T, array: T[], cmp?: (a: T, b: T) => number) {
    const _cmp = cmp || ((a, b) => a < b ? -1 : a > b ? 1 : 0)
    let lo = 0, hi = array.length
    while (lo < hi) {
        const mid = (lo + hi) >> 1
        const ord = _cmp(item, array[mid])
        if (ord == 0) {
            return mid
        }
        if (ord < 0) {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return -lo - 1
}

function sortedInsert<T>(item: T, array: T[], cmp?: (a: T, b: T) => number) {
    const ix = lowerBound(item, array, cmp)
    console.log("item", item, "ix", ix, "value", array[ix])
    if (ix < 0) {
        array.splice(-ix - 1, 0, item)
    }
}
