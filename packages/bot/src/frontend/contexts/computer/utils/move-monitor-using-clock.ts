import { Injectable, Inject, DI } from 'di-xxl';

import { IDomObserver } from '../../../interfaces/dom-observer';

import { EventHub } from 'eventhub-xxl';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { getS } from '../../../utils/find';
import { IMonitor } from '../../../../models/monitor';
import { Heartbeat } from '../../../heartbeat';

@Injectable({ name: 'monitor.live.move-using-clock' })
export class ComputerMoveMonitorClock implements IMonitor {
	private gameMoveObserver: IDomObserver;
	private clockState = true;

  @Inject('eh') private eh: EventHub;
  @Inject('settings') settings: IBrowserSettings;
  @Inject('heartbeat') heartbeat: Heartbeat;

  cleanup = () => {};

  start(cb: () => void = () => {}): IMonitor {
		const el = getS(this.settings.PLAYER_DETAILS);
		this.gameMoveObserver = DI.get<IDomObserver>('browser.dom.observer').observe(this.settings.PLAYER_DETAILS, () => {
			const clockState =  !!el.querySelector(this.settings.PLAYER_CLOCK_INACTIVE);

			console.log('move check', this.clockState, clockState);
			if (clockState !== this.clockState) { // changed
				if (clockState) {
					this.eh.trigger('move.end');
				} else {
					this.eh.trigger('move.start');
					cb();
				}
				this.clockState = clockState;
			}
		}, { subtree: true, childList: true, attributes: true });

    return this;
  }

  stop(): void {
    this.gameMoveObserver && this.gameMoveObserver.disconnect();
  }
}
