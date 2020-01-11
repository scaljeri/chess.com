// Book + local + backensd merged

import { UCIChessEngine, UCI, IUCIGoOptions, Move, Side, parseFen } from '@scaljeri/chess-shared';
import { Injectable, Inject } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';

@Injectable({ name: 'browser.chess.uci.combi', singleton: true })
export class ChessUCICombi {
    private browserUCI: UCI;
    private backendUCI: UCI;
    private currentUCI: UCI;
    private color: Side;

    @Inject('eh') eh: EventHub;

    @Inject('browser.chess.uci.browser')
    setBrowserEngine(uci: UCI) {
        this.browserUCI = uci;
        // this.start(engine);
    }

    @Inject('browser.chess.uci.backend')
    setBackendEngine(uci: UCI) {
        this.backendUCI = uci;
        this.currentUCI = uci;
        // engine; // First use this engine
    }

    start(): Promise<void> {
        return Promise.resolve();
    }

    async go(fen: string, options: IUCIGoOptions): Promise<Move> {
        if (!this.color) {
            this.color = parseFen(fen).active;
        }

        if (this.currentUCI !== this.browserUCI) {
            const remainingTime = this.color === Side.w ? options.wtime : options.btime;
            if (remainingTime < 10000 && remainingTime !== 1000) {
                this.currentUCI.stop();
                this.currentUCI = this.browserUCI;
            }
        }
        this.eh.trigger('game.move.bot.uci.start', fen);
        const move = await this.currentUCI.go(fen, options);
        this.eh.trigger('game.move.bot.uci.end', move);

        return move;
    }

    stop(): void {
        this.currentUCI.stop();
        this.currentUCI = this.backendUCI;
    }
}