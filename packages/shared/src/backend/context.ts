import { Injectable } from 'di-xxl';

require('dotenv').config();

@Injectable('shared-context')
export class Context {
    get opponent(): string {
        return process.env.OPPONENT;
    }

    get chessEnginePort(): number {
        return parseInt(process.env.API_PORT, 10);
    }

    get isBrowser(): boolean {
        return Boolean(process.env.PLAY_REMOTE);
    }

    get gameDuration(): string {
        return process.env.GAME_DURATION;
    }

    getLevel(): number {
        return parseInt(process.env.LEVEL_OPPONENT, 10);
    }
}