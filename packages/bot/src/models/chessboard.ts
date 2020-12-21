import { Game, Side } from '@scaljeri/chess-shared';
import { IChessPoint } from './chess-point';

export interface IChessBoard {
    reset: () => void;
    buildGrid: () => void;
    findCoordinates: (pos: string) => IChessPoint;
    findPiece: (pos: string) => HTMLElement;
    getTimeLeftBottom: () => string;
		getTimeLeftTop: () => string;
		opponent: Side;
		bot: Side;
}
