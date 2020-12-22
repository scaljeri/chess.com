import { IBrowserSettings } from '../../models/browser-settings';
import { createMouseEvent } from './events';
import { IChessBoard } from '../../models/chessboard';
import { Side } from '@scaljeri/chess-shared';

export abstract class BrowserChessPiece {
    abstract chessBoard: IChessBoard;
    abstract settings: IBrowserSettings;

    promote(promoteTo: 'q' | 'n' | 'r' | 'b', side: Side) {
			const selector = `${this.settings.PROMOTE_PIECE} .${side + promoteTo}`;

        if (!this.doPromotion(selector)) {
            const iid = setInterval(() => {
                if (this.doPromotion(selector)) {
                    clearInterval(iid);
                }
            }, 200);
        }
    }

    private doPromotion(selector: string): boolean {
        const square = document.querySelector(selector) as HTMLElement;

        if (square) {
            square.dispatchEvent(createMouseEvent('pointerdown')); // vs Live
            square.click();    // vs COMPUTER
        }

        return !!square;
    }
}
