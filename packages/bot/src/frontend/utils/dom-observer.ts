import { Injectable, Inject } from 'di-xxl';
import { getM } from './find';
import { EventHub } from 'eventhub-xxl';
import { IDomObserver } from '../interfaces/dom-observer';

@Injectable('browser.dom.observer')
export class DomObserver implements IDomObserver {
	static observers: MutationObserver[] = [];
	private observer: MutationObserver;

	@Inject('eh') private eh: EventHub;

	reset(): void {
		DomObserver.observers.forEach(o => o.disconnect());
		DomObserver.observers.length = 0;
	}

	disconnect(): void {
		console.log('DOM_OBSERVE DISCONNECT', this.observer);
		this.observer.disconnect();
		DomObserver.observers.splice(DomObserver.observers.indexOf(this.observer), 1);
	}

	observe(selector: string, eventName: ((el: HTMLElement) => void) | string, config?: MutationObserverInit): IDomObserver {
		const targets = getM(selector);

		if (targets.length === 0) {
			console.log('selector ' + selector + ' not found');
			return;
		}

		// creëer een observer instantie
		this.observer = new MutationObserver(mutations => {
			const el = mutations[0].target as HTMLElement;
			// console.log(selector, mutations);

			if (typeof eventName === 'string') {
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

		for (let i = 0; i < targets.length; i++) {
			this.observer.observe(targets[i], config);
		}

		DomObserver.observers.push(this.observer);

		return this;
	}
}
