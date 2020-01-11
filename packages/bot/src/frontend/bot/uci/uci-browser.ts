import { UCIChessEngine, UCI, Move, IUCIGoOptions } from '@scaljeri/chess-shared';
import { Injectable, Inject } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';

@Injectable({ name: 'browser.chess.uci.browser', singleton: true })
export class ChessUCIBrowser extends UCI {
    @Inject('eh') eh: EventHub;

    @Inject('chess.engine.browser')
    setChessEngine(engine: UCIChessEngine) {
        this.start(engine);
    }

    async go(fen: string, options?: IUCIGoOptions): Promise<Move> {
        this.eh.trigger('game.move.bot.uci.start', fen);
        const move = await super.go(fen, options);
        this.eh.trigger('game.move.bot.uci.end', move);

        return move;
    }
}