import { Game } from '@scaljeri/chess-shared';

export interface IGameState {
    get: () => Game;
		reset: () => IGameState;
    update: () => IGameState;
}
