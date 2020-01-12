import { Injectable, DI } from 'di-xxl';
import { IContextSettings } from '../shared/interfaces/context-settings';
import { IContext } from './interfaces/context';

@Injectable({ name: 'browser.environment', singleton: true })
export class Environment {
    setup(context: IContextSettings): void {
        console.log('build env');
        DI.set({
            name: 'context',
            ref: context,
            action: DI.ACTIONS.NONE
        });

        DI.setProjection({
            'display': 'browser.display',
            'dom': 'browser.dom',
            'chessboard': 'browser.utils.chessboard',
            'game-play': 'browser.game-play',
            'chess.game.history': 'browser.game-history',
            'dom.observer': 'browser.dom.observer',
            'dom.observers.stop': 'browser.dom.stop-observers',
            'chess.bot': 'chess.bot',
            'heartbeat': 'basic.heartbeat',

            // **** BOT CONFIGURATION ****/
            // Pure browser engine
            // 'chess.engine.browser': 'browser.chess.engine.stockfish',
            // 'chess.uci': 'browser.chess.uci.browser'

            // Combi engine
            // 'chess.engine.browser': 'browser.chess.engine.stockfish',
            // 'chess.uci': 'browser.chess.uci.combi',

            // Pure backend engine
            'chess.uci': 'browser.chess.uci.backend'
        });

        DI.get<IContext>(`context.${window.location.pathname.match(/live/) ? 'live' : 'computer'}`).prepare(context);
    }
}