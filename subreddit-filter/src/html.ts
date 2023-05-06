

type HTMLTag = keyof HTMLElementTagNameMap;
type HTMLElementCommonAttributes = {
    style?: Partial<CSSStyleDeclaration> | string
}
type HTMLProps<T extends HTMLTag> = Partial<HTMLElementTagNameMap[T]>;
type HTMLElements = (string | HTMLElement)[];

interface Component<T = undefined | {}> {
    (props: T, ...children: any[]): Element
}
type P<T extends (...args: any) => any> = Parameters<T> | null;


function html<T extends HTMLTag = HTMLTag>
    (tag: T, props?: HTMLProps<T>, ...children: HTMLElements): HTMLElement;

function html(
    fn: Component, props?: Parameters<typeof fn> | null, ...children: Node[])
    : Node;

function html(tag: any, props: any, ...children: any[]): any {

    if (typeof tag === 'function') {
        return tag(props, children);
    }

    const elem = document.createElement(tag);
    for (const [prop, value] of Object.entries(props || {})) {
        if (typeof value === 'function'
            || (typeof value === 'object' && 'handleEvent' in value!)) {
            const name = prop.startsWith('on') ? prop.slice(2) : prop;
            elem.addEventListener(name, value as any);
            continue;
        }
        if (prop in elem) {
            (elem as any)[prop] = value;
        } else {
            elem.setAttribute(prop, value);
        }
    }
    elem.append(...children);
    return elem;
}

export default html;