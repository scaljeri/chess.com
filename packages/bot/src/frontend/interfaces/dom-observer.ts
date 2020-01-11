export interface IDomObserver {
    observe: (selector: string, eventName: ((el: HTMLElement) => void) | string, config?: MutationObserverInit) => IDomObserver;
    disconnect: () => void;
}