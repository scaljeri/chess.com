import { Injectable, Inject, DI } from 'di-xxl';

import { IMoveObserver } from '../../../interfaces/move-observer';

import { IDomObserver } from '../../../interfaces/dom-observer';

import { EventHub } from 'eventhub-xxl';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Side, Move, switchSide } from '@scaljeri/chess-shared';

import { IGameState } from '../../../interfaces/game-state';

@Injectable({ name: 'browser.context.live.utils.board-monitor', singleton: true })
export class LiveGameBoardMonitor implements IMoveObserver {
    private observeBotClock: IDomObserver;
    private startGameObserver: IDomObserver;

    private gameOverTimeoutId: number;

    id = Math.random();

    @Inject('eh') private eh: EventHub;
    // @Inject('game.draw-offer') private drawOffer: DrawOffer;

    @Inject('settings') settings: IBrowserSettings;
    private lastMoveColor: Side;
    private lastMoveIndex: number;

    cleanup = () => {
        if (this.observeBotClock) {
            this.observeBotClock.disconnect();
        }

        this.eh.off('disconnect', this.cleanup);
    }

    start(): void {
        this.stop(); // Just to make sure!
        this.lastMoveColor = null;
        this.lastMoveColor = null;

        // Move triggers
        this.startGameObserver = DI.get<IDomObserver>('dom.observer').observe(this.settings.BOARD_NAME, () => {

            window.setTimeout(() => {
                const gameState = DI.get<IGameState>('game.state');
                let game = gameState.update().get();

                if (game.gameOver) {
                    window.clearTimeout(this.gameOverTimeoutId);
                    setTimeout(() => this.eh.trigger('game.over', game));
                    return;
                }

                const move = game.moves.slice(-1)[0];
                if (!move) {
                    if (!this.lastMoveColor) {
                        this.eh.trigger('game.start', game);

                        if (game.bot === Side.w) {
                            this.eh.trigger('game.move.bot', game);
                        }
                        this.lastMoveColor = Side.w; // fake move -> white to move
                        this.lastMoveIndex = 0;
                    }

                    return;
                }

                if (this.lastMoveIndex < game.moves.length) { // A move happend!!
                    if (this.lastMoveColor === move.color) {
                        this.lastMoveColor = switchSide(move.color);
                    }
                }

                if (move.color !== this.lastMoveColor) { // new move
                    if (move.color !== game.bot) {
                        this.eh.trigger('game.move.bot', game);
                    } else {
                        this.eh.trigger('game.move.opponent', game)
                    }
                    this.lastMoveColor = move.color;
                    this.lastMoveIndex = game.moves.length;
                }

                window.clearTimeout(this.gameOverTimeoutId);
                this.gameOverTimeoutId = window.setTimeout(() => {
                    game = gameState.update().get();

                    if (game.gameOver) {
                        this.eh.trigger('game.over', game); 
                    }
                }, 2000);
            })
        });
    }

    stop(): void {
        this.startGameObserver && this.startGameObserver.disconnect();
    }
}