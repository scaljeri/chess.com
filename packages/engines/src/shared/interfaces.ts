import {Game, Move, IUCIGoOptions, UCI_OPTIONS} from "@scaljeri/chess-shared";

export interface ChessEngine {
    move: (fen: string, options: IUCIGoOptions) => Promise<Move>;
    setOption(option: UCI_OPTIONS, value: any): void;
    stop: () => void;
}
