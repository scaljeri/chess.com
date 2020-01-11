import { IChessBot } from '../models/chess-bot';
import { Game, Move, Side, UCI } from '@scaljeri/chess-shared';
import { Injectable, Inject } from 'di-xxl';

const FIRST_MOVES: Move[] = [
  { from: 'e2', to: 'e4', color: Side.White },
  { from: 'd2', to: 'd4', color: Side.White },
  { from: 'c2', to: 'c4', color: Side.White },
  { from: 'g1', to: 'f3', color: Side.White },
];

@Injectable({ name: 'chess.bot', singleton: true })
export class ChessBot implements IChessBot {
  @Inject({ name: 'chess.uci', lazy: false }) uci: UCI;

  async start(): Promise<void> {
    return this.uci.start().then(() => {
      // Dry run, to spin up all the threads
      // this.uci.go('rnbqkb1r/pp3ppp/2p2n2/4p3/4p3/PP6/1BPPBPPP/RN1QK1NR b KQkq - 1 6', {
      //     wtime: 1000,
      //     btime: 1000
      // });
    });
  }

  calculateMove(game: Game): Promise<Move> {
    if (game.moves.length === 0) {
      return new Promise<Move>(r => {
        setTimeout(() => {
          r(FIRST_MOVES[Math.floor(Math.random() * FIRST_MOVES.length)]);
        });
      });
    } else {
      return this.uci.go(game.fen, {
        ...(game.timeWhite !== undefined && { wtime: game.timeWhite }),
        ...(game.timeBlack !== undefined && { btime: game.timeBlack }),
        ...(game.movetime && { movetime: game.movetime }),
      });
    }
  }

  stop(): void {
    console.log('UCI STOP');
    this.uci.stop();
  }
}
