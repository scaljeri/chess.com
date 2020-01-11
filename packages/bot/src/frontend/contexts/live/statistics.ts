import { Injectable, Inject } from 'di-xxl';

import { EventHub } from 'eventhub-xxl';

import { Side, Game, Move } from '@scaljeri/chess-shared';

import { IContextSettings } from '../../../shared/interfaces/context-settings';
import { getTimeBot, getTimeOpponent } from './utils/clock';
import { timingSafeEqual } from 'crypto';

@Injectable({ name: 'browser.game.statistics', singleton: true })
export class GameStatistics {
  private history: any[] = [];
  private port: number;
  private startTimeOpp: number;
  private startTimeBot: number;
  private moveBot: Move;
  private uciTime;
  private lastFen: string;
  private bookMoves: number;
  private ponderHits: number;

  @Inject('context')
  setSettings(context: IContextSettings): void {
    this.port = context.serverPort;
  }

  @Inject('eh')
  initialize(eh: EventHub) {
    eh.on('game.new', () => this.gameStart());
    eh.on('game.over', (game: Game) => this.gameOver(game));
    eh.on('bot.move.start', () => this.botMoveStart());
    eh.on('bot.move.uci-start', () => this.botEngineStart());
    eh.on('bot.move.uci-end', () => this.botEngineEnd());
    eh.on('bot.move.end', ({ game, move }) => this.botMoveEnd(game, move));
    eh.on('bot.move.done', game => this.botMoveDone(game));
    eh.on('opponent.move.start', game => this.opponentMoveStart(game));
    eh.on('opponent.move.end', game => this.opponentMoveEnd(game));
  }

  private addMove(move: Move, game: Game, duration): void {
    // Delay, to make sure everything is updated
    if (this.lastFen !== game.fen) {
      this.lastFen = game.fen;
      console.log(move.color);
      setTimeout(() => {
        this.history.push({
          color: move.color,
          move,
          timeWhite: game.timeWhite, // game.bot === Side.w ? getTimeBot() : getTimeOpponent(),
          timeBlack: game.timeBlack, // game.bot === Side.b ? getTimeBot() : getTimeOpponent(),
          fen: game.fen,
          duration: duration,
          ...(game.bot === move.color && { uciTime: this.uciTime }),
        });
      });
    }
  }

  // The start of the game is triggered during first move
  private gameStart(): void {
    this.history = [];
    this.ponderHits = 0;
    this.bookMoves = 0;
  }

  private opponentMoveStart(game?): void {
    if (this.moveBot) {
      this.addMove(this.moveBot, game, Date.now() - this.startTimeBot);
      this.moveBot = null;
    }
    this.startTimeOpp = Date.now();
  }

  private opponentMoveEnd(game): void {
    this.addMove(game.moves.slice(-1)[0], game, Date.now() - this.startTimeOpp);
  }

  private botMoveStart(): void {
    this.startTimeBot = Date.now();
  }

  private botEngineStart(): void {
    this.uciTime = Date.now();
  }

  private botEngineEnd(): void {
    this.uciTime = Date.now() - this.uciTime;
  }

  botMoveEnd(game: Game, move?: Move): void {
    this.moveBot = move;

    if (move.ponderhit) {
      this.ponderHits++;
    }

    if (!move.score) {
      this.bookMoves++;
    }
  }

  botMoveDone(game: Game): void {}

  gameOver(game: Game): void {
    if (this.history.length) {
      const data = {
        gameId: window.location.href.match(/g=(\d+)/)[1],
        bot: game.bot,
        winner: game.winner,
        ponderHits: this.ponderHits,
        bookMoves: this.bookMoves,
        history: this.history,
      };

      fetch(`http://localhost:${this.port}/api/game-stats`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }

    this.history.length = 0;
  }
}
