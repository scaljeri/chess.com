import { Game, Move } from '@scaljeri/chess-shared';

export interface IGameState {
    get: () => Game;
		reset: () => IGameState;
		update: (withMoves?: boolean) => IGameState;
		monitorGameStart: () => Promise<void>;
		addMove: (game: Game, move: Move) => Game;
}
