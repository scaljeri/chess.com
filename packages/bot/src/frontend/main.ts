import { DI } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';
import { IDisplay } from './interfaces/display';
import { IContextSettings } from '../shared/interfaces/context-settings';
import { Environment } from './environment';
import { IMoveObserver } from './interfaces/move-observer';
import { loadScript } from './utils/load-script';
import { IChessBot } from '../models/chess-bot';
import { Game, Move, Side } from '@scaljeri/chess-shared';
import { cleanup } from './utils/cleanup';
import { IChessBoard } from '../models/chessboard';
import { IMonitor } from '../models/monitor';
import { getS } from './utils/find';
import { IGameState } from './interfaces/game-state';
import { IBrowserSettings } from '../models/browser-settings';
import { EVENT_TYPES } from './event-types';
import e = require('express');

declare var window: any;
declare var WebAssembly;
// https://github.com/niklasf/stockfish.wasm
var source = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);
window.postMessage(new WebAssembly.Module(source), '*');

// If window.__ already exists, it means the package was injected again (reload)
const oldDI: DI = window.__;
window.__ = new DI();

DI.set({
	name: 'eh',
	ref: EventHub,
	singleton: true,
});


const eh = DI.get<EventHub>('eh');

if (oldDI) {
	console.log('Reload detected...');

	const context = oldDI.get<IContextSettings>('context');
	// The first time the context is set by the backend
	(window.__ as DI).get<Environment>('browser.environment').setup(context);

	setTimeout(() => {
		eh.trigger(EVENT_TYPES.CONNECT);
	});
}

window.addEventListener('resize', resize);
// cleanup();

eh.on('reload', () => {
	console.log('RELOAD');
	window.removeEventListener('resize', resize);
	document.body.removeEventListener('click', gameStartListener);

	const serverPort = DI.get<IContextSettings>('context').serverPort;
	DI.get('shutdown').now();
	eh.reset();
	DI.get('dom.observer').reset();

	// DI.get<IChessBot>('chess.bot').stop(); // Make sure pondering stops
	loadScript(`http://localhost:${serverPort}/files/browser/chess-utils`, '__chess-utils');
});

// Setup
eh.on(EVENT_TYPES.CONNECT, async () => {
	DI.get<IDisplay>('display').inject(); // Show mini dashboard
	DI.set({
		name: 'game.active',
		ref: {
			_state: false,
			set: function (state: boolean) { this._state = state },
			get: function () { return this._state }
		},
		action: DI.ACTIONS.NONE
	});

	const heartbeat = DI.get('heartbeat');
	const settings = DI.get<IBrowserSettings>('settings');
	const gameState = DI.get<IGameState>('game.state');
	const gameHistory = DI.get('game.history');
	let game;

	document.body.addEventListener('click', gameStartListener);

	let moveListenerFn;
	const gameStartedFn = () => {
		console.log('GAME STARTED');

		game = gameState.update(false).get();
		DI.get<IChessBoard>('chessboard').buildGrid();

		// IF we have to move first, the move-listener is not goint to tell us!
		if (game.bot === Side.w) {
			doMove(game);
		}
	}

	moveListenerFn = () => {
		setTimeout(async () => {
			game = gameHistory.create(game);
			if (DI.get('game.active').get() && game.moves.length % 2 === (game.bot === Side.w ? 0 : 1)) {
				doMove(game);
			}
		});
	}
	eh.on(EVENT_TYPES.MOVE_START, moveListenerFn);
	DI.get('monitor.move').start();

	heartbeat.start(() => {
		if (getS(settings.GAME_OVER)) {
			DI.get('game.active').set(false);
			eh.trigger(EVENT_TYPES.GAME_END, gameState.update().get());
		}
	});
	eh.on(EVENT_TYPES.GAME_START, gameStartedFn);
});

function gameStartListener(event) {
	const target = event.target;
	const button = target.closest('button');

	if (button) {
		const attr = button.getAttribute('data-game-control-button');

		if (button.getAttribute('title') === 'Play' || attr === 'Rematch' || attr === 'NewGame') {
			const game = DI.get<IGameState>('game.state').update(false).get();
			setTimeout(() => {
				eh.trigger(EVENT_TYPES.GAME_START, game);
				DI.get('game.active').set(true);
			}, 200);
		}
	}
}

function resize() {
	DI.get<IChessBoard>('chessboard').reset();
	eh.trigger(EVENT_TYPES.RESIZE);
}

async function doMove(game: Game): Promise<Move> {
	console.log('---------------------', game);
	eh.trigger('bot.move.uci-start', game);
	const move = await DI.get<IChessBot>('chess.bot').calculateMove(game);
	DI.get<IGameState>('game.state').addMove(game, move);
	eh.trigger(EVENT_TYPES.UCI_MOVE_END, { move, game });

	if (move && move.raw !== '(none)') { // Make sure the game is still going on
		DI.get('game.do-move').move(move);
	}

	return move;
}
