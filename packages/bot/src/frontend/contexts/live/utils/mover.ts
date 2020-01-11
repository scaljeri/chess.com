import { Inject, Injectable } from 'di-xxl';

import { Move } from '@scaljeri/chess-shared';
import { createMouseEvent } from '../../../utils/events';
import { BrowserChessPiece } from '../../../utils/chess-piece';
import { IBrowserSettings } from '../../../../models/browser-settings';
import { IDisplay } from '../../../interfaces/display';
import { IChessBoard } from '../../../../models/chessboard';
import { GameState } from './game-state';

@Injectable({ name: 'browser.context.live.utils.mover', singleton: true })
export class LiveMover extends BrowserChessPiece {
    @Inject('chessboard') chessBoard: IChessBoard;
    @Inject('settings') settings: IBrowserSettings;
    @Inject('game-state') game: GameState;
    @Inject('display') display: IDisplay;

    move(move: Move): void {
        const piece = this.chessBoard.findPiece(move.from);
        const from = this.chessBoard.findCoordinates(move.from);
        const to = this.chessBoard.findCoordinates(move.to);

        const mde = createMouseEvent('mousedown', { clientX: from.x, clientY: from.y });
        piece.dispatchEvent(mde);

        const mue = createMouseEvent('mouseup', { clientX: to.x, clientY: to.y });
        document.querySelector(this.settings.BOARD_NAME).dispatchEvent(mue);

        if (move.promoteTo) {
            this.promote(move.promoteTo);
        }
    }
}