import { Injectable, Inject, DI } from 'di-xxl';
import { getS } from './find';
import { EventHub } from 'eventhub-xxl';
import { IDomObserver } from '../interfaces/dom-observer';

const observers: DomObserver[] = [];

DI.set({
    name: 'browser.dom.stop-observers',
    ref: () => {
        observers.forEach(o => o.disconnect());
        observers.length = 0;
    },
    action: DI.ACTIONS.INVOKE
});

@Injectable('browser.dom.observer')
export class DomObserver implements IDomObserver {
    private observer: MutationObserver;
    @Inject('eh') private eh: EventHub;

    constructor() {
        observers.push(this);
    }

    disconnect(): void {
        this.observer.disconnect();
        observers.splice(observers.indexOf(this), 1);
    }

    observe(selector: string, eventName: ((el: HTMLElement) => void) | string, config?: MutationObserverInit): IDomObserver {
        const target = getS(selector);

        // creëer een observer instantie
        this.observer = new MutationObserver(mutations => {
            const el = mutations[0].target as HTMLElement;
            // console.log(selector, mutations);

            if (typeof eventName === 'string' ) {
                this.eh.trigger(eventName, el);
            } else {
                eventName(el);
            }
        });

        if (!config) {
            config = {
                attributes: true,
                childList: true,
                subtree: false,
                attributeOldValue: true,
                attributeFilter: ['class']
            };
        }

        this.observer.observe(target, config);
        observers.push(this);

        return this;
    }
}