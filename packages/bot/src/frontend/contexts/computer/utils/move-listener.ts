// vertical-move-list
import { Injectable, Inject, DI } from 'di-xxl';

import { EventHub } from 'eventhub-xxl';

import { IDomObserver } from '../../../interfaces/dom-observer';
import { IBrowserSettings } from '../../../../models/browser-settings';
import { IMonitor } from '../../../../models/monitor';
import { EVENT_TYPES } from '../../../event-types';
import { IGameState } from '../../../interfaces/game-state';

@Injectable({ name: 'monitor.live.move-trigger', singleton: true })
export class ComputerMoveMonitorClock implements IMonitor {
	private gameMoveObserver: IDomObserver;

	@Inject('eh') private eh: EventHub;
	@Inject('settings') settings: IBrowserSettings;
	@Inject('browser.context.live.utils.game-state') gameState: IGameState;

	cleanup = () => { };

	async waitForSelector(selector) {
		return new Promise(r => {
			const id = setInterval(() => {
				if (document.querySelector(selector)) {
					window.clearInterval(id);
					r(null);
				}
			}, 100);
		})
	}

	async start() {
		const selector = 'vertical-move-list';
		await this.waitForSelector(selector);

		this.stop();

		this.gameMoveObserver = DI.get<IDomObserver>('browser.dom.observer').observe(selector, (mutation) => {
			this.handleMutations(mutation);
		}, { subtree: true, childList: true, attributes: true });

		return this;
	}

	private handleMutations(mutation: HTMLElement): void {
		const game = this.gameState.update().get();
		const lastMove = game.moves[game.moves.length - 1];

		if (lastMove.color !== game.bot) {
			this.eh.trigger(EVENT_TYPES.MOVE_START);
		}
	}

	stop(): void {
		console.log('stop listening to moves');
		this.gameMoveObserver && this.gameMoveObserver.disconnect();
	}
}
