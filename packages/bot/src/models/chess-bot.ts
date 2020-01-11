import { Move, Game } from '@scaljeri/chess-shared';

export interface IChessBot {
    calculateMove: (game: Game) => Promise<Move>;
    stop: () => void;
    start: () => Promise<void>;
}