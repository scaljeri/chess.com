import { Game } from '@scaljeri/chess-shared';
import { IChessPoint } from './chess-point';

export interface IChessBoard {
    reset: () => void;
    // toJson: () => Partial<Game>;
    buildGrid: () => void;
    findCoordinates: (pos: string) => IChessPoint;
    findPiece: (pos: string) => HTMLElement;
    getTimeLeftBottom: () => string;
    getTimeLeftTop: () => string;
}