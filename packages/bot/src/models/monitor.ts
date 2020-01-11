import { Game } from '@scaljeri/chess-shared';

export interface IMonitor {
    start: (callback: (game?: Game, isTurn?: boolean) => void, selector?: string) => IMonitor;
    stop: () => void;
    resume(): void;
}