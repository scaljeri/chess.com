import { DI } from 'di-xxl';
import { EventHub } from 'eventhub-xxl';
import { IDisplay } from './interfaces/display';
import { IContextSettings } from '../shared/interfaces/context-settings';
import { Environment } from './environment';
import { IMoveObserver } from './interfaces/move-observer';
import { loadScript } from './utils/load-script';
import { IChessBot } from '../models/chess-bot';
import { Game, Move } from '@scaljeri/chess-shared';
import { cleanup } from './utils/cleanup';
import { IChessBoard } from '../models/chessboard';
import { IMonitor } from '../models/monitor';
import { getS } from './utils/find';
import { IGameState } from './interfaces/game-state';
import { Heartbeat } from './heartbeat';
import { IDomObserver } from './interfaces/dom-observer';
import { IBrowserSettings } from '../models/browser-settings';
import { EVENT_TYPES } from './event-types';

declare var window;
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
		eh.trigger('connect');
	});
}

window.addEventListener('resize', resize);
// cleanup();

eh.on('reload', () => {
	window.removeEventListener('resize', resize);

	const serverPort = DI.get<IContextSettings>('context').serverPort;
	DI.get('shutdown').now();
	eh.reset();

	DI.get<IChessBot>('chess.bot').stop(); // Make sure pondering stops
	loadScript(`http://localhost:${serverPort}/files/browser/chess-utils`, '__chess-utils');
});

eh.on('connect', () => {
	// console.log('CONNECT YES', DI.get<IContextSettings>('context'));
	// const settings = DI.get<IBrowserSettings>('settings');
	const settings = DI.get<IBrowserSettings>('settings');
	DI.get('monitor.move').start();
	const chessBoard = DI.get<IChessBoard>('chessboard');

	eh.on('game.start', () => {
		console.log('GAME START');
		// TODO: Determine grid
	});
	eh.on('move.start', async () => {
		const game = await DI.get('game.history').createAsync(undefined, { lastMove: chessBoard.opponent });
		doMove(game);
	});
	eh.on('move.end', () => {
		// console.log('MOVE END');
	});

	DI.get('heartbeat').start(() => {
		if (getS(settings.END_DIALOG)) {
			console.log('GAME END');
			eh.trigger(EVENT_TYPES.GAME_END);
		}
	});
	DI.get<IDisplay>('display').inject(); // Show mini dashboard

	// DI.get('chess.game.statistics');
	// DI.get('chess.bot').start();
});

// eh.on('game.over', () => {
// 	console.log('game over!!');
// 	DI.get<IChessBot>('chess.bot').stop();
// 	DI.get('heartbeat').remove(monitorEndOfGame);
// 	// gameStartMonitor.resume();
// });

eh.on('disconnect', () => {
	// TODO (reload)
});

// eh.on('game.new', game => {
// 	console.log('NEW GAME!!');
// 	DI.get<IChessBoard>('chessboard').reset();
// 	DI.get('heartbeat').add(monitorEndOfGame);
// });

// function listen(): void {
//   console.log('start listening');
//   DI.get<IMonitor>('monitor.move.start').start((game: Game, isTurn: boolean) => {
//     if (isTurn) {
//       eh.trigger('bot.move.start', game);

//       setTimeout(async () => {
//         const move = await doMove(game);
//         eh.trigger('bot.move.end', { move, game });
//       });
//     } else {
//       setTimeout(() => {
//         eh.trigger('bot.move.done', game)
//       });
//     }
//   });
// 
//   DI.get<IMonitor>('monitor.move.start').start((game: Game, isTurn: boolean) => {
//     if (isTurn) {
//       eh.trigger('opponent.move.start', game);
//     } else {
//       eh.trigger('opponent.move.end', game);
//     }
//   }, DI.get('settings').CLOCK_OPP);
// }

// function monitorEndOfGame(): void {
// 	const state = getS(DI.get('settings').END_DIALOG);
// 	if (state) {
// 		// Game has ended
// 		eh.trigger(
// 			'game.over',
// 			DI.get<IGameState>('game.state')
// 				.update()
// 				.get(),
// 		);
// 	}
// }
function resize() {
	DI.get<IChessBoard>('chessboard').reset();
	eh.trigger('browser.resize');
}

async function doMove(game: Game): Promise<Move> {
	eh.trigger('bot.move.uci-start', game);
	const move = await DI.get<IChessBot>('chess.bot').calculateMove(game);
	eh.trigger('bot.move.uci-end', { move, game });

	if (move) {
		console.log('MAKE A MOVE BELOW', game, move)
		DI.get('game.do-move').move(move);
	}

	return move;
}
