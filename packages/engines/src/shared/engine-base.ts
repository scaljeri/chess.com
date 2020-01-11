import {Game, Move, IUCIGoOptions} from "@scaljeri/chess-shared";

export abstract class EngineBase {
    getTimeWhite(game: Game): number {
        if (typeof game.timeWhite === 'string') {
            game.timeWhite = this.convertTimeToSeconds(game.timeWhite);
        }

        return game.timeWhite as number;
    }

    getTimeBlack(game: Game): number {
        if (typeof game.timeBlack === 'string') {
            game.timeBlack = this.convertTimeToSeconds(game.timeBlack);
        }

        return game.timeBlack as number;
    }

    convertTimeToSeconds(t: string): number | null {
        let retVal = null;

        if (t) {
            if (t.match(/:/)) {
                const [min, sec] = t.split(':');
                retVal = (+min * 60 + +sec) * 1000;
            } else {
                retVal = parseInt(t, 10);
            }
        }

        return retVal;
    }

    abstract stop(): void;
    abstract move(fen: string, options: IUCIGoOptions): Promise<Move>;
}
