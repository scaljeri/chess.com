import { Injectable, Inject, DI } from 'di-xxl';
import { Chess } from 'chess.js';
import { IGameState } from '../../../interfaces/game-state';

import { GameHistory } from '../../../utils/game-history';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Game, switchSide, Side, convertTimeToMilli, Move } from '@scaljeri/chess-shared';
import { getS } from '../../../utils/find';
import { EventHub } from 'eventhub-xxl';
import { IChessBoard } from '../../../../models/chessboard';
import { IDomObserver } from '../../../interfaces/dom-observer';

@Injectable({ name: 'browser.context.live.utils.game-state', singleton: true })
export class GameState implements IGameState {
	@Inject('game.history') protected history: GameHistory;
	@Inject('eh') protected eh: EventHub;
	@Inject('settings') protected settings: IBrowserSettings;
	@Inject('chessboard') chessBoard: IChessBoard;

	public id = Math.random();

	protected game: Game;

	protected gameMoveObserver: IDomObserver;

	reset(): IGameState {
		this.game = undefined;

		return this;
	}

	addMove(game: Game, move: Move): Game {
		console.log('ADD MOVE', move);
		const chess = new Chess(game.fen);
		chess.move(move);
		game.moves.push(...chess.history({ verbose: true }));
		game.fen = chess.fen();
		game.checkmate = chess.game_over();
		game.gameOver = game.checkmate; // ???????????
		console.log('MOVE ADDED', game);
		return game;
	}

	async monitorGameStart(): Promise<void> {

		return new Promise(resolve => {
			this.gameMoveObserver = DI.get<IDomObserver>('browser.dom.observer').observe(this.settings.PLAYER_DETAILS, () => {
				if (getS(`${this.settings.PLAYER_DETAILS} ${this.settings.CLOCK}`)) {
					this.gameMoveObserver.disconnect();
					resolve();
				}
			}, { subtree: true, childList: true, attributes: false });
		});
	}

	update(withMoves = true): IGameState {
		this.game = withMoves ? this.history.create(this.game) : { moves: [] };
		this.game.bot = this.game.bot || this.determineColor();
		this.game.opponent = this.game.opponent || switchSide(this.game.bot);
		this.game.fen = this.game.fen || new Chess().fen();
		this.getTimes();

		return this;
	}

	determineColor(): Side {
		return getS(DI.get('settings').GRID_NAME).innerHTML === '8' ? Side.White : Side.Black;
	}

	getTimes(): void {
		const timeBottom = this.chessBoard.getTimeLeftBottom(); // getS(this.settings.CLOCK);
		const timeTop = this.chessBoard.getTimeLeftTop(); // getS(this.settings.CLOCK_OPP);

		this.game.timeBlack = convertTimeToMilli((this.game.bot === Side.Black ? timeBottom : timeTop));
		this.game.timeWhite = convertTimeToMilli((this.game.bot === Side.White ? timeBottom : timeTop));
	}

	get(): Game {
		return this.game;
	}
}
