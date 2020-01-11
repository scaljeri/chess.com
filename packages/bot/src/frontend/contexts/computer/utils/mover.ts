import { Inject, Injectable } from 'di-xxl';

import { Move } from '@scaljeri/chess-shared';
import { createMouseEvent } from '../../../utils/events';
import { BrowserChessPiece } from '../../../utils/chess-piece';
import { IBrowserSettings } from '../../../../models/browser-settings';
import { GameState } from '../../live/utils/game-state';
import { IDisplay } from '../../../interfaces/display';
import { IChessBoard } from '../../../../models/chessboard';
import { getS } from '../../../utils/find';

@Injectable({ name: 'browser.context.computer.utils.mover', singleton: true })
export class ComputerMove extends BrowserChessPiece {
    @Inject('chessboard') chessBoard: IChessBoard;
    @Inject('settings') settings: IBrowserSettings;
    @Inject('game-state') game: GameState;
    @Inject('display') display: IDisplay;


    async move(move: Move): Promise<void> {
        return new Promise<void>(async (r) => {
            const piece = await this.chessBoard.findPiece(move.from);
            // const from = this.chessBoard.findCoordinates(move.from);
            const to = this.chessBoard.findCoordinates(move.to);

            const mde = createMouseEvent('mousedown'); 
            piece.dispatchEvent(mde);

            const mue = createMouseEvent('mouseup');
            piece.dispatchEvent(mue);

            const hit = document.elementFromPoint(to.x, to.y)
            if (hit!.tagName === 'IMG') {
                const mde = createMouseEvent('mousedown');
                hit!.dispatchEvent(mde);

                const mue = createMouseEvent('mouseup');
                hit!.dispatchEvent(mue);
            } else {
                piece.parentElement.dispatchEvent(createMouseEvent('mousedown', { clientX: to.x, clientY: to.y }))
                getS('html').dispatchEvent(createMouseEvent('mouseup', { clientX: to.x, clientY: to.y }));
            }

            if (move.promoteTo) {
                this.promote(move.promoteTo);
            }

        })
    }

    calcOffset(el: Element): { top: number, left: number } {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
}