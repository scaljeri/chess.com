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
	private loopCount: number;

	/* Sometimes at `move.start` the moves list is not yet updated, so we have to wait and check it again.
		 This function does that, it checks if the `config.lastMove` equals the color of the last move. If
		 not, the waits 5ms and tries again by calling itself with the `resolve` callback.
	*/
	createAsync(game: Game, resolve?: (game: Game) => void): Promise<Game> {
		if (resolve) {
			console.log('UPDTAE GAME', game, this.loopCount);
			const g = this.create(game);
			if (this.loopCount++ === 10) {
				console.log('ERROR: Problems building history', g, game);
			} else {
				// Make sure a new move was added
				if (g.gameOver || g.moves.length === game.moves.length + 1) {
					resolve(g);
				} else {
					setTimeout(() => {
						this.createAsync(game, resolve);
					}, 10);
				}
			}
		} else {
			this.loopCount = 0;
			return new Promise(resolve => {
				setTimeout(() => {
					this.createAsync(game, resolve);
				});
			});
		}
	}

	create(game: Game = { moves: [] }): Game {
		const chess = new Chess(game.fen);

		console.log('create history');
		const startPos = Math.floor(game.moves.length / 2);
		const rest = game.moves.length % 2;
		let gameOver = false;
		let winner: Side;

		const turns = Array.prototype.slice.call(getM(`${this.settings.MOVES_LIST}`), startPos);

		turns.forEach((turn, i) => {
			const items = turn.querySelectorAll(this.settings.MOVES_LIST_TURN);
			const moveW = this.determineMove((items[0] as HTMLElement)); // .innerText;
			const moveB = items[1] ? this.determineMove(items[1] as HTMLElement) : null;

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

		const x = chess.history({ verbose: true });
		return Object.assign({}, game, {
			moves: [...game.moves, ...chess.history({ verbose: true })],
			fen: chess.fen(),
			checkmate: chess.game_over(),
			gameOver,
			winner
		});
	}

	determineMove(el: HTMLElement): string {
		if (!el) {
			return '';
		}

		const nodes = el.childNodes;

		let move = '';
		nodes.forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) {
				move += node.textContent;
			} else {
				move += (node as HTMLElement).getAttribute('data-figurine');
			}
		});

		return move;
	}

	isDraw(move: string): boolean {
		return move === '1/2-1/2';
	}
}

