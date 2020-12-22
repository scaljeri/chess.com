import { Injectable, Inject, DI } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';

declare var window: { __: DI, setInterval: any }

@Injectable({ name: 'basic.heartbeat', singleton: true })
export class Heartbeat {
    private actions: (() => void)[] = [];

    private id: number;
    private delay = 2000;

    set interval(delay: number) {
        this.delay = delay;

        if (this.id) {
            this.start();
        }
    }

    add(action: () => void): number {
        this.actions.push(action);
        return this.actions.length - 1;
    }

    remove(id: any): () => void {
        const index = this.actions.indexOf(id);

        id = index >= 0 ?  index : id;
        const action = this.actions[id];
        delete this.actions[id];

        return action;
		}
		
		reset(): void {
			this.stop();
			this.actions.length = 0;
		}

    start(action?: () => void): number | null {
				this.stop();
				let id = null;

        if (action) {
            id = this.add(action);
        }


        this.id = window.setInterval(() => {
            this.actions.forEach(action => action());
				}, this.delay);
				
				return id;
    }

    stop(): void {
        clearInterval(this.id);
        this.id = null;
    }
}
