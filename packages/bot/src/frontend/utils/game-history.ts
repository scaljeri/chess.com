import { Injectable, Inject } from "di-xxl";
import { Game, Side } from '@scaljeri/chess-shared';
import { Chess } from 'chess.js';
import { IBrowserSettings } from '../../models/browser-settings';
import { getM } from './find';

@Injectable({ name: 'browser.game-history', singleton: true })
export class GameHistory {
    @Inject('settings') settings: IBrowserSettings;
    @Inject('utils') utils;

    create(game: Game = { moves: [] }): Game {
        const chess = new Chess(game.fen);

        const startPos = Math.floor(game.moves.length / 2);
        const rest = game.moves.length % 2;
        let gameOver = false;
        let winner: Side;

        const turns = Array.prototype.slice.call(getM(`${this.settings.MOVES_LIST} ${this.settings.MOVE_TURN}`), startPos);

        turns.forEach((turn, i) => {
            const items = turn.querySelectorAll(this.settings.MOVE_ITEMS);
            const moveW = (items[0] as HTMLElement).innerText;
            const moveB = items[1] ? (items[1] as HTMLElement).innerText : null;

            if (moveW.match(/[a-zA-Z]/)) {
                if (i === 0 && rest === 0 || i > 0) {
                    chess.move(moveW);

                    if (chess.in_checkmate()) {
                        gameOver = true;
                        winner = Side.w;
                    }
                }

                if (moveB) {
                    if (moveB.match(/[a-zA-Z]/)) {
                        chess.move(moveB);

                        if (chess.in_checkmate()) {
                            gameOver = true;
                            winner = Side.b;
                        }
                    } else {
                        gameOver = true;
                        winner = this.isDraw(moveB) ? null : Side.White;
                    }
                }
            } else {
                gameOver = true;
                winner = this.isDraw(moveW) ? null : Side.Black;
            }
        });

        return Object.assign({}, game, {
            moves: [...game.moves, ...chess.history({ verbose: true })],
            fen: chess.fen(),
            checkmate: chess.game_over(),
            gameOver,
            winner
        });
    }

    isDraw(move: string): boolean {
        return move === '1/2-1/2';
    }
}

