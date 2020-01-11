export function createMouseEvent(eventType: string, proto: any = {}) {
    proto = Object.assign({ bubbles: true, cancelable: true, view: window }, proto);

    let evt = new MouseEvent(eventType, proto);

    return evt;
}