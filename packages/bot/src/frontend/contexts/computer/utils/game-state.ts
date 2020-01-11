import { Injectable, Inject } from 'di-xxl';
import { GameHistory } from '../../../utils/game-history';
import { IBrowserSettings } from '../../../../models/browser-settings';
import { GameState } from '../../live/utils/game-state';
import { getS } from '../../../utils/find';
import { Side } from '@scaljeri/chess-shared';

@Injectable({ name: 'browser.context.computer.utils.game-state', singleton: true })
export class ComputerGameState extends GameState {
    @Inject('chess.game.history') protected history: GameHistory;
    @Inject('settings') protected settings: IBrowserSettings;

    getTimes(): void {
        this.game.movetime = 5000;
    }

    determineColor(): Side {
        // Check left top corner coordinate (1 to 8)
        const value = getS('#chessboard_boardarea .coords-item').innerText;
        return value === '8' ? Side.White : Side.Black;
    }
}