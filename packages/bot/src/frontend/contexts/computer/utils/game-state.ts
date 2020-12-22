import { Injectable, Inject, DI } from 'di-xxl';

import { IGameState } from '../../../interfaces/game-state';

import { GameHistory } from '../../../utils/game-history';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Game, switchSide, Side, convertTimeToMilli } from '@scaljeri/chess-shared';
import { getS } from '../../../utils/find';
import { EventHub } from 'eventhub-xxl';

@Injectable({ name: 'browser.context.live.utils.game-state', singleton: true })
export class GameState implements IGameState {
    @Inject('game.history') protected history: GameHistory;
    @Inject('eh') protected eh: EventHub;
    @Inject('settings') protected settings: IBrowserSettings;

    protected game: Game;
    
    reset(): IGameState {
				this.game = undefined;
				
				return this;
    }

    update(): IGameState {
				this.game = this.history.create(this.game);
				this.game.bot = this.game.bot || this.determineColor();
				this.game.opponent = this.game.opponent || switchSide(this.game.bot);
        this.getTimes();

        return this;
    }

    determineColor(): Side {
			return getS(DI.get('settings').GRID_NAME).innerHTML === '8' ? Side.White : Side.Black;
    }

    getTimes(): void {
        const timeBottom = getS(this.settings.CLOCK);
        const timeTop = getS(this.settings.CLOCK_OPP);

        this.game.timeBlack = convertTimeToMilli((this.game.bot === Side.Black ?  timeBottom : timeTop).innerText);
        this.game.timeWhite = convertTimeToMilli((this.game.bot === Side.White ?  timeBottom : timeTop).innerText);
    }

    get(): Game {
        return this.game;
    }
}
