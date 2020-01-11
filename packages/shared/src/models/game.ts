import { Move } from "./move";
import { Side } from "../shared/side";

export interface Game {
    bot?: Side;
    opponent?: Side;
    moves: Move[];
    fen?: string
    checkmate?: boolean;
    timeBlack?: number;
    timeWhite?: number;
    movetime?: number;
    gameOver?: boolean;
    winner?: Side;
}