import { Move } from '@scaljeri/chess-shared';

export interface IGamePlay {
    play: () => Promise<void>;
}