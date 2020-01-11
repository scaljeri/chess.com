import * as yargs from 'yargs'
import { Injectable } from 'di-xxl';
import { IContext } from './interfaces/context';

require('dotenv').config();

const args = yargs
    .option('game-type', {
        alias: 'g',
        demand: false,
        description: 'Select game type (LIVE or COMPUTER)'
    })
    .option('debug', {
        alias: 'd',
        type: 'boolean',
        demand: false,
        description: 'Enable debug messages'
    })
    .example(`$0 -g live `, '-- Play live agains Komodo or Stockfish')
    .wrap(130) // yargs.terminalWidth())
    .argv;

@Injectable({ name: 'backend.context', singleton: true })
export class Context implements IContext {
    private websocketPort: number;

    get serverPort(): number {
        return parseInt(process.env.SERVER_PORT, 10);
    }

    get isPlayLive(): boolean {
        return process.env.GAME_TYPE.toLowerCase() === 'computer' ? false : true;
    }

    get socketPort(): number {
        return parseInt(process.env.SOCKET_PORT, 10);
    }

    get username(): string {
        return process.env.USERNAME;
    }

    get password(): string {
        return process.env.PASSWORD;
    }
}