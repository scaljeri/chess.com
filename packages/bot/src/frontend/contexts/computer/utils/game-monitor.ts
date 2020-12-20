import { Injectable, Inject, DI } from 'di-xxl';

import { IMoveObserver } from '../../../interfaces/move-observer';

import { IDomObserver } from '../../../interfaces/dom-observer';

import { EventHub } from 'eventhub-xxl';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Side } from '@scaljeri/chess-shared';

import { IGameState } from '../../../interfaces/game-state';
import { getS } from '../../../utils/find';

@Injectable({name: 'browser.context.live.utils.monitor', singleton: true})
export class LiveGameMonitor implements IMoveObserver {
    private observeBotClock: IDomObserver;
    private observeOppClock: IDomObserver;
    private startGameObserver: IDomObserver;
    private gameOverIntervalId: number;

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
        clearInterval(this.gameOverIntervalId);
    }

    start(): void {
        this.stop(); // Just to make sure!

        // Move triggers
        if (!this.triggerStartIfStarted()) {
            this.startGameObserver = DI.get<IDomObserver>('dom.observer').observe('.sidebar-component ', () => {
                if (this.triggerStartIfStarted()) {
                    this.startGameObserver.disconnect();
                }
            });
        }

        // Gameover trigger
        this.gameOverIntervalId = window.setInterval(() => {
            const el = getS('.board-dialog-component');

            if (el) {
                const game = DI.get<IGameState>('game.state')
                .update()
                .get()

                this.eh.trigger('chess.game.over', game);
                this.stop();
            }
        }, 2000);

        this.eh.on('disconnect', this.cleanup);
    }

    stop(): void {
        clearInterval(this.gameOverIntervalId);

        if (this.startGameObserver) {
            this.startGameObserver.disconnect();
            this.startGameObserver = null;
        }

        if (this.observeBotClock) {
            this.observeBotClock.disconnect();
            this.observeBotClock = null;
        }
    }

    private triggerStartIfStarted(): boolean {
        if (getS('.draw-button-label')) {
            const game = DI.get<IGameState>('game.state')
            .update()
            .get()

            const nom = game.moves.length;
            this.oppColor = game.opponent;
            this.botColor = game.bot;

            if (nom === 0) {
                this.lastMove = game.bot === Side.w ? 2 : 1;
            } else if (game.bot === Side.w) {
                this.lastMove = nom + (nom % 2 === 0 ? 0 : 1);
            } else {
                this.lastMove = nom + (nom % 2 === 0 ? 1 : 0);
            }

            this.listenToBotClock();
            this.eh.trigger('game.start', game);

            if (game.bot === Side.White && nom === 0) {
                this.eh.trigger('game.move.bot', game);         // We are white, so lets move
            }

            return true;
       }
    }

    async listenToBotClock(): Promise<void> {
        const gameState = DI.get<IGameState>('game.state');

        // Heartbeat
        this.observeBotClock = DI.get<IDomObserver>('dom.observer').observe('.board-player-default-bottom .clock-component', async () => {
            const isBotTurn = !!getS('.board-player-default-bottom .clock-playerTurn');

            if (isBotTurn) {
                const game = gameState.update().get();

                if (this.lastMove === 0 || this.lastMove === game.moves.length) {
                    this.lastMove = game.moves.length + 2;
                    this.eh.trigger('game.move.calculate', game);
                }
            } 
        });
    }
}