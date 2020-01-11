import { Injectable, Inject } from "di-xxl";
import { Side } from '@scaljeri/chess-shared';
import { IChessBoard } from '../../models/chessboard';
import { IBrowserSettings } from '../../models/browser-settings';
import { getS, getM } from './find';
import { IChessPoint } from '../../models/chess-point';

// Handles everything related to the chessboard, like time and square details
@Injectable({ name: 'browser.utils.chessboard', singleton: true })
export class BrowserChessBoard implements IChessBoard {
    // @Inject('utils') utils: IChessUtils;
    @Inject('settings') settings: IBrowserSettings;

    public opponent: Side;
    public bot: Side;
    public grid: Record<string, { x: number, y: number }>;
    private boardTop;
    private boardLeft;

    reset(): void {
        this.grid = null;
    }

    getTimeLeftBottom(): string {
        const timeEl = getS(this.settings.CLOCK_BOTTOM);
        return timeEl ? timeEl.innerText : '';
    }

    getTimeLeftTop(): string {
        const timeEl = getS(this.settings.CLOCK_TOP);
        return timeEl ? timeEl.innerText : '';
    }

    buildGrid() {
        const board = getS(this.settings.BOARD_NAME)!;
        const first = getS(this.settings.GRID_NAME, board)
        const items = getM(this.settings.GRID_NAME, board)

        this.bot = first.innerText === '8' ? Side.White : Side.Black;
        this.opponent = this.bot === Side.White ? Side.Black : Side.White;

        this.grid = {};
        const pbox = board.getBoundingClientRect() as DOMRect;

        items.forEach((item: HTMLElement) => {
            const text = item.innerText;
            const box = item.getBoundingClientRect() as DOMRect;
            this.grid[text] = { x: Math.round(box.x - pbox.x), y: Math.round(box.y - pbox.y) };
        });

        this.boardTop = pbox.top;
        this.boardLeft = pbox.left;
    }

    findCoordinates(position: string): IChessPoint {
        if (!this.grid) {
            this.buildGrid();
        }

        const [col, row] = position.split('');
        const size = Math.abs((this.grid[2].y - this.grid[1].y)) / 2; // TODO: do this once

        const y = this.grid[row].y + size + this.boardTop;
        const x = this.grid[col].x + size + this.boardLeft;

        return { x, y };
    }

    findPiece(position: string): HTMLElement {
        const { x, y } = this.findCoordinates(position);

        const piece = document.elementFromPoint(x, y) as HTMLElement;

        return piece;
    }
}