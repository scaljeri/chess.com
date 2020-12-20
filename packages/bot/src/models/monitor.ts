import { Game } from '@scaljeri/chess-shared';

export interface IMonitor {
    start: (callback: () => void) => IMonitor;
    stop: () => void;
}
