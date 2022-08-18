import { Game } from '@scaljeri/chess-shared';

export interface IMonitor {
    start: (callback: () => void) => Promise<IMonitor>;
    stop: () => void;
}
