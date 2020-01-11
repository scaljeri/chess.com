import * as socketIo from 'socket.io-client';
import { Move, IUCIGoOptions, IEngineConfig } from '@scaljeri/chess-shared';
import { Injectable, Inject } from 'di-xxl';
import { IContextSettings } from '../../../shared/interfaces/context-settings';
import { EventHub } from 'eventhub-xxl';

const EVENT_MOVE = 'move';
const EVENT_STOP = 'stop';

@Injectable({ name: 'browser.chess.uci.backend', singleton: true })
export class ChessUCIBackend {
    private port: number;

    @Inject('eh') eh: EventHub;

    @Inject('context')
    setContext(context: IContextSettings): void {
        this.port = context.socketPort;
        this.socket = socketIo(`http://localhost:${this.port}`);
    }

    private socket;

    go(fen: string, options?: IUCIGoOptions, config: IEngineConfig = {}): Promise<Move> {
        return new Promise<Move>(resolve => {
            this.socket.emit(EVENT_MOVE, { ...config, fen, options });
            const responseHanlder  = (move: Move) => {
                this.socket.off(responseHanlder);
                this.eh && this.eh.trigger('game.move.bot.uci.end', move);
                resolve(move);
            };

            this.eh && this.eh.trigger('game.move.bot.uci.start', fen);
            this.socket.on(EVENT_MOVE, responseHanlder);
        });
    }

    stop(): Promise<void> {
        this.socket.emit(EVENT_STOP, {});
        return Promise.resolve();
    }

    start(): Promise<void> {
        return Promise.resolve();
    }
}