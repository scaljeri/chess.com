export function getM(selector: string, parent?: HTMLElement): NodeListOf<HTMLElement> {
    return (parent || document).querySelectorAll(selector)
}

export function getS(selector: string, parent?: HTMLElement): HTMLElement {
    return (parent || document).querySelector(selector);
}