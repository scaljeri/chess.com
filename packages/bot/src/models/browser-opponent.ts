import { IBrowserContext } from './browser-context';

export interface IBrowserOpponent {
    apply: (context: IBrowserContext) => void;
}