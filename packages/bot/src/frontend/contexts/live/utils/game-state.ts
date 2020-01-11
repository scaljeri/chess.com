import { Injectable, Inject } from 'di-xxl';

import { IGameState } from '../../../interfaces/game-state';

import { GameHistory } from '../../../utils/game-history';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Game, switchSide, Side, convertTimeToMilli } from '@scaljeri/chess-shared';
import { getS } from '../../../utils/find';
import { EventHub } from 'eventhub-xxl';

@Injectable({ name: 'browser.context.live.utils.game-state', singleton: true })
export class GameState implements IGameState {
    @Inject('chess.game.history') protected history: GameHistory;
    @Inject('eh') protected eh: EventHub;
    @Inject('settings') protected settings: IBrowserSettings;

    protected game: Game;
    private oldGame: Game;
    
    reset(): void {
        this.game = null;
    }

    update(): IGameState {
        if (!this.game) {
            this.game = {
                moves: [],
                bot: this.determineColor()
            };
            this.game.opponent = switchSide(this.game.bot);
        }

        this.game = this.history.create(this.game);
        this.getTimes();

        return this;
    }

    initialize(): void {
        this.game = {
            moves: [],
            bot: this.determineColor()
        };
        this.game.opponent = switchSide(this.game.bot);
    }

    determineColor(): Side {
        return getS('.board-layout-bottom .clock-black') ? Side.Black : Side.White;
    }

    getTimes(): void {
        const timeBottom = getS(this.settings.CLOCK_BOTTOM);
        const timeTop = getS(this.settings.CLOCK_TOP);

        this.game.timeBlack = convertTimeToMilli((this.game.bot === Side.Black ?  timeBottom : timeTop).innerText);
        this.game.timeWhite = convertTimeToMilli((this.game.bot === Side.White ?  timeBottom : timeTop).innerText);
    }

    get(): Game {
        if (!this.oldGame || this.oldGame.gameOver && !this.game.gameOver) {
            this.reset();
            this.update();
            
            this.eh.trigger('game.new', this.game);
        }

        this.oldGame = this.game;
        return this.game;
    }

    isGameStarted(): boolean {
        const resign = getS(this.settings.RESIGN_BTN);
    
        return !!resign;
      }
}