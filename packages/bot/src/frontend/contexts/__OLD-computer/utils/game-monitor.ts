import { Injectable, Inject, DI } from 'di-xxl';

import { IMoveObserver } from '../../../interfaces/move-observer';

import { IDomObserver } from '../../../interfaces/dom-observer';

import { EventHub } from 'eventhub-xxl';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Side, Game } from '@scaljeri/chess-shared';

import { IGameState } from '../../../interfaces/game-state';
import { getS } from '../../../utils/find';

@Injectable({ name: 'browser.context.computer.utils.monitor', singleton: true })
export class ComputerGameMonitor implements IMoveObserver {
    private observeBotClock: IDomObserver;
    private moveObserver: IDomObserver;
    private moveInProgress: boolean;

    @Inject('eh') private eh: EventHub;
    // @Inject('game.draw-offer') private drawOffer: DrawOffer;

    @Inject('settings') settings: IBrowserSettings;
    private oppColor: Side;
    private botColor: Side;
    // private currMover: Side;
    private lastMove: number;

    cleanup = () => {
        if (this.observeBotClock) {
            this.observeBotClock.disconnect();
        }

        this.eh.off('disconnect', this.cleanup);
    }

    start(): void {
        this.stop(); // Just to make sure!

        const game = DI.get<IGameState>('game.state')
            .update()
            .get()

        this.eh.trigger('game.start', game);

        this.botColor = game.bot;

        this.eh.on('chess.game.moved', () => this.moveInProgress = false);

        this.moved();
        this.moveObserver = DI.get<IDomObserver>('dom.observer').observe('.computer-move-list', () => {
            this.moved();
        }, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeOldValue: false
        });
    }

    private moved(game?: Game): void {
        game = game || DI.get<IGameState>('game.state')
            .update()
            .get();

        if (game.gameOver) {
            console.log("GAME OVER");
            this.eh.trigger('game.over', game);
            this.stop();
        } else {

            const lastMove = game.moves.slice(-1)[0];

            if (!lastMove || lastMove.color !== this.botColor) {
                if (!this.moveInProgress) {
                    this.moveInProgress = true;
                    this.eh.trigger('game.move.bot', game);
                }
            }
        }
    }

    stop(): void {
        this.moveInProgress = false;
        if (this.moveObserver) {
            this.moveObserver.disconnect();
        }
    }
}