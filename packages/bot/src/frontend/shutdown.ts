import { Injectable, DI, Inject } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';

@Injectable({ name: 'shutdown', singleton: true})
export class Shutdown {
    @Inject('eh') eh: EventHub;

    constructor() {
        setTimeout(() => {
            this.eh.on('destroy', () => this.now())
        })
    }

    now(): void {
        console.log('SHUTDOWN');

        const engine = DI.get('chess.bot');
        engine.stop();

        DI.get('dom.stop-observers');
        DI.get('heartbeat').stop();
    }
}