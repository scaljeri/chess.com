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
		console.log('SHUTDOWN');

		this.engine();

		DI.get('dom.stop-observers');
		DI.get('heartbeat').reset();
	}

	engine(): void {
		const engine = DI.get('chess.bot');
		console.log('stopping engine.....');
		engine.stop();
	}
}
