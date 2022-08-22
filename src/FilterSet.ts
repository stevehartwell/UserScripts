//
//
// import 'greasemonkey';

export default class FilterSet {

    private static get _hiddenSubredditsKey() { return 'hiddenSubreddits'; }
    private static get _hidePromotedKey() { return 'hidePromoted'; }

    static async load() {
        const promises = [
            GM.getValue(this._hiddenSubredditsKey, "[]"),
            GM.getValue(this._hidePromotedKey, true)
        ];
        return Promise.all(promises).then((values) => {
            console.info("saved values:", values);
            let subreddits = values[0] as (string | string[]);
            if (typeof subreddits === 'string') {
                subreddits = JSON.parse(subreddits) as string[];
            }
            const hidePromoted = values[1] as boolean;
            return new FilterSet(new Set(subreddits), hidePromoted);
        });
    }

    private _hiddenSubreddits: Set<string>;
    private _hidePromoted: boolean;

    constructor(hiddenSubreddits: Set<string>, hidePromoted: boolean) {
        this._hiddenSubreddits = hiddenSubreddits;
        this._hidePromoted = hidePromoted;
    }

    get hidePromoted() {
        return this._hidePromoted;
    }
    set hidePromoted(newValue) {
        if (this._hidePromoted == newValue) {
            return;
        }
        this._hidePromoted = newValue;
        GM.setValue(FilterSet._hidePromotedKey, newValue);
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
            GM.setValue(FilterSet._hiddenSubredditsKey, arrayValue as any);
        }
        catch (err) {
            console.log("!!! GM.setValue array:", err);
            const stringValue = JSON.stringify(arrayValue);
            GM.setValue(FilterSet._hiddenSubredditsKey, stringValue);
        }
        return true;
    }
}
