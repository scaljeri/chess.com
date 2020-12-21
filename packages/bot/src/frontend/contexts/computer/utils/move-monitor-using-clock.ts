import { Injectable, Inject, DI } from 'di-xxl';

import { IDomObserver } from '../../../interfaces/dom-observer';

import { EventHub } from 'eventhub-xxl';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { getS } from '../../../utils/find';
import { IMonitor } from '../../../../models/monitor';
import { Heartbeat } from '../../../heartbeat';
import { EVENT_TYPES } from '../../../event-types';

@Injectable({ name: 'monitor.live.move-using-clock' })
export class ComputerMoveMonitorClock implements IMonitor {
	private gameMoveObserver: IDomObserver;
	private clockState: boolean | null = null;

  @Inject('eh') private eh: EventHub;
  @Inject('settings') settings: IBrowserSettings;
  @Inject('heartbeat') heartbeat: Heartbeat;

  cleanup = () => {};

  start(cb: () => void = () => {}): IMonitor {
		const el = getS(this.settings.PLAYER_DETAILS);
		this.gameMoveObserver = DI.get<IDomObserver>('browser.dom.observer').observe(this.settings.PLAYER_DETAILS, () => {
			const clockState =  !!el.querySelector(this.settings.PLAYER_CLOCK_INACTIVE);

			if (clockState !== this.clockState) { // something happend on the board, our clock html changed
				if (this.clockState === null) {
					this.eh.trigger(EVENT_TYPES.GAME_START);
				}
				if (clockState) {
					this.eh.trigger(EVENT_TYPES.MOVE_END);
				} else {
					this.eh.trigger(EVENT_TYPES.MOVE_START);
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
