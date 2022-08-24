//
//
// import '@types/greasemonkey';

export default class FilterConfig {

    static async load() {
        const promises = [
            GM.getValue(_hiddenSubredditsKey, "[]"),
            GM.getValue(_hidePromotedKey, true)
        ];
        return Promise.all(promises).then((values) => {
            // console.info("saved values:", values);
            let subreddits = values[0] as (string | string[]);
            if (typeof subreddits === 'string') {
                subreddits = JSON.parse(subreddits) as string[];
            }
            const hidePromoted = values[1] as boolean;
            return new FilterConfig(new Set(subreddits), hidePromoted);
        });
    }

    constructor(hiddenSubreddits: Set<string>, hidePromoted: boolean) {
        this._hiddenSubreddits = hiddenSubreddits;
        this._hidePromoted = hidePromoted;
    }
    private _hiddenSubreddits: Set<string>;
    private _hidePromoted: boolean;

    get hidePromoted() {
        return this._hidePromoted;
    }
    set hidePromoted(newValue) {
        if (this._hidePromoted == newValue) {
            return;
        }
        this._hidePromoted = newValue;
        GM.setValue(_hidePromotedKey, newValue);
        // TODO refresh
    }

    sorted() {
        return Array.from(this._hiddenSubreddits).sort((first, second) => {
            return first.localeCompare(second);
        });
    }

    isHidden(sub: string) {
        return this._hiddenSubreddits.has(sub)
    }

    filter(sub: string, hide: boolean) {
        if (this.isHidden(sub) == hide) {
            return false;
        }
        if (hide) this._hiddenSubreddits.add(sub);
        else /**/ this._hiddenSubreddits.delete(sub);

        const arrayValue = [...this._hiddenSubreddits];
        try {
            GM.setValue(_hiddenSubredditsKey, arrayValue as any);
        }
        catch {
            GM.setValue(_hiddenSubredditsKey, JSON.stringify(arrayValue));
        }
        return true;
    }

    async getConfig() {

    }
}

const _hidePromotedKey = 'hidePromoted';
const _hiddenSubredditsKey = 'hiddenSubreddits';
