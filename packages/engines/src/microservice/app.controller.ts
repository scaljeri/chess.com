import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Chess } from 'chess.js';

import { ChessEngine } from '../shared/interfaces';
import {Game, Move} from "@scaljeri/chess-shared";

@Controller()
export class AppController {
  private isProcessing = false;
  constructor(@Inject('CHESS_ENGINE') private engineService: ChessEngine) {}

  @MessagePattern({ cmd: 'move' })
  findMove({ fen, options }): Promise<Move> {
    // console.log('Find move for: ', game);
    this.isProcessing = true;

    // movesToFen is not necessary I think, there is already a game.fen!!
    return this.engineService.move(fen, options).then(move => {
      this.isProcessing = false;
      console.log('FOUND ', move.from, move.to);
      return move;
    })
  }

  @MessagePattern({ cmd: 'stop'})
  stop(): void {
    if (this.isProcessing) {
      this.isProcessing = false;
      return this.engineService.stop();
    }
    this.isProcessing;
  }

  @MessagePattern({ cmd: 'test' })
  test(data: string): string {
    console.log('input: ', data);
    return '---- ' + data + ' ----';
  }
}

function movesToFen(game: Game): Game {
  const chess = new Chess();
  const moves = game.moves || [];

  moves.forEach(move => {
    if (move.to) {
      chess.move(move);
    } else { // move.from hold the complete move
      chess.move(move.from);
    }
  });
  game.fen = chess.fen();

  return game;
}
