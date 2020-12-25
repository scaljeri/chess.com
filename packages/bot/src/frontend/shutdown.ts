import { Injectable, DI, Inject } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';

@Injectable({ name: 'shutdown', singleton: true })
export class Shutdown {
	@Inject('eh') eh: EventHub;

	constructor() {
		setTimeout(() => { // timeout needed so DI can do its magic first
			this.eh.on('destroy', () => this.now())
		})
	}

	now(): void {
		console.log('SHUTDOWN....');

		this.stopEngine();

		DI.get('dom.stop-observers');
		DI.get('eh').reset();
		DI.get('dom.observer').reset()
		DI.get('heartbeat').reset();
	}

	stopEngine(): void {
		const engine = DI.get('chess.bot');
		engine.stop();
	}
}
