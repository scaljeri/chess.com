import { Move, Game } from '@scaljeri/chess-shared';
import { IBrowserContext } from './browser-context';

export interface IChessUtils {
    context?: IBrowserContext;
    prepare: () => Promise<Game>;
    setContext: (context: IBrowserContext) => void;
    getGame: () => Promise<Game>;
    move: (m: Move) => Promise<void>;
    getS: (selector: string, parent?: HTMLElement) => HTMLElement;
    getM: (selector: string, parent?: HTMLElement) => NodeListOf<HTMLElement>;

    waitForDraw: (cb: (drawDialog: HTMLElement) => void) => void;
    waitForMove: (cb: (game: Game) => void) => void;
    closeDrawDialog: (accept: boolean) => void;
}