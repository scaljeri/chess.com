import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { BookService } from '../book-service';

import { Client, Server } from 'socket.io';
import { Move, IUCIGoOptions, parseFen, UCI_OPTIONS } from '@scaljeri/chess-shared';
import { Inject } from '@nestjs/common';
import { ChessEngine } from 'src/shared/interfaces';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
interface SerializerRequest {
    fen: string;
    options?: IUCIGoOptions;
    skipBook?: boolean;

}

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server;
    private useBook = true;

    constructor(@Inject('CHESS_ENGINE') private engineService: ChessEngine,
        private bookService: BookService) {
        // bookService.lookupRandom('r4rk1/pp2bpp1/2p2n1p/4q3/2b1B3/2N5/PPQ2PPP/R3K2R w KQ - 0 16').then(x => {
        // console.log(x);
        //r4rk1/pp2bpp1/2p2n1p/4q3/2b1B3/2N5/PPQ2PPP/R3K2R w KQ - 0 16
        // })
    }

    private isProcessing;

    @SubscribeMessage('move')
    async findMove(client: Client, { fen, options, skipBook }: SerializerRequest = { fen: INITIAL_FEN}): Promise<WsResponse<Move>> {
        let move;
        const starttime = Date.now();

        console.log('Start processing fr ' + fen, this.isProcessing);
        if (this.isProcessing) {
            return Promise.resolve(null);
        }

        this.isProcessing = true;
        this.useBook = this.useBook || parseInt(fen.match(/\d+$/)[0]) < 3;

        if (this.useBook && !skipBook) {
            const move = await this.bookService.lookupRandom(fen);

            this.useBook = !!move;
            if (this.useBook) {
                this.isProcessing = false;
                let { active } = parseFen(fen);
                move.color = active;
                return { event: 'move', data: move };
            }
        }

        console.log('--------- use engine ---------');
        // const moves = parseInt(fen.split(' ')[5]);
        // console.log('moves=' + moves + ' fen=' + fen);
        // if (moves === 1) {
        //     this.engineService.setOption(UCI_OPTIONS.SLOW_MOVER, 10);
        // } else if (moves === 20) {
        //     this.engineService.setOption(UCI_OPTIONS.SLOW_MOVER, 300);
        // } else if (moves === 40) {
        //     this.engineService.setOption(UCI_OPTIONS.SLOW_MOVER, 10);
        // }
        move = await this.engineService.move(fen, options);
        console.log('--------- end engine ---------', move);
        this.isProcessing = false;

        console.log(`------ end, duration=${Date.now() - starttime} timeLeft=${options.wtime}`);
        return { event: 'move', data: move };
    }

    @SubscribeMessage('stop')
    async identity(client: Client) {
        console.log('MSG: Received a remote call to stop pondering');
        this.isProcessing = false;
        this.engineService.stop();
    }
}