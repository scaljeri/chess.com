import { ClientTCP } from '@nestjs/microservices';
import { Game, Move } from '@scaljeri/chess-shared';

import { Injectable, Inject } from 'di-xxl';
import { IChessBot } from '../models/chess-bot';
import { Context } from './context';

@Injectable({ name: 'backend.chess-bot', singleton: true})
export class BackendChessBot implements IChessBot {
    @Inject('context') context: Context;

    private port: number[];

    constructor() {}

    async start(): Promise<void> {

    }

    async calculateMove(game: Game = {moves: []}): Promise<Move> {

        const client = new ClientTCP({
            host: 'localhost',
            port: 5000,
        });

        await client.connect();

        if (!game.timeWhite) {
            game.timeWhite = 300000;
        }

        if (!game.timeBlack) {
            game.timeBlack = 300000;
        }

        const pattern = { cmd: 'move' };
        const result = await client.send(pattern, game).toPromise();

        // console.log(`Engine move: ${result.from} to ${result.to}`);
        client.close();

        return result;
    }

    stop(): void {
        // TODO
    }
}
