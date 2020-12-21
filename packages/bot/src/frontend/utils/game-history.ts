import { Injectable, Inject } from "di-xxl";
import { Game, Side } from '@scaljeri/chess-shared';
import { Chess } from 'chess.js';
import { IBrowserSettings } from '../../models/browser-settings';
import { getM } from './find';

enum PIECE_MAP { 
	knight = 'N',
	queen = 'Q',
	rook = 'R',
	bishop = 'B',
	king = 'K'
}
@Injectable({ name: 'browser.game-history', singleton: true })
export class GameHistory {
    @Inject('settings') settings: IBrowserSettings;
		@Inject('utils') utils;
		
    createAsync(game: Game = { moves: [] }, config: { lastMove?: Side } = {}, resolve?: (game: Game) => void): Promise<Game> {
			if (resolve) {
				const g = this.create(game);

				if (!config.lastMove || // its always ok
					g.moves.length === 0 && config.lastMove === Side.Black || // first move
					g.moves[g.moves.length - 1].color === config.lastMove) {	// last move equals expected lastMove
					resolve(g);
				} else {
					setTimeout(() => {
						this.createAsync(game, config, resolve);
					}, 5);
				}
			} else {
				return new Promise(resolve => {
					setTimeout(() => {
						this.createAsync(game, config, resolve);
					});
				});
			}
		}

    create(game: Game = { moves: [] }): Game {
        const chess = new Chess(game.fen);

        const startPos = Math.floor(game.moves.length / 2);
        const rest = game.moves.length % 2;
        let gameOver = false;
        let winner: Side;

        const turns = Array.prototype.slice.call(getM(`${this.settings.MOVES_LIST}`), startPos);

        turns.forEach((turn, i) => {
            const items = turn.querySelectorAll(this.settings.MOVES_LIST_TURN);
            const moveW = this.determineMove((items[0] as HTMLElement)); // .innerText;
						const moveB = items[1] ? this.determineMove(items[1] as HTMLElement)  : null;

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
		
		determineMove(el: HTMLElement): string {
			const icon = el.querySelector('span');
			let pieceChar = '';

			if (icon) {
				pieceChar = PIECE_MAP[icon.className.match(/\s([^-]+)[^ ]+$/)[1]];
			}

			return pieceChar + el.innerText;
		}

    isDraw(move: string): boolean {
        return move === '1/2-1/2';
    }
}

