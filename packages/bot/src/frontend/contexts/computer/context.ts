import { Injectable, DI } from 'di-xxl';
import { IContext } from '../../interfaces/context';
import { COMPUTER_DEFAULTS } from './settings';
import { IContextSettings } from '../../../shared/interfaces/context-settings';

@Injectable({ name: 'context.computer', singleton: true})
export class ContextLive implements IContext {
    prepare(context: IContextSettings): void {
         DI.set({
             name: 'settings',
             ref: COMPUTER_DEFAULTS,
             action: DI.ACTIONS.NONE
				 });
				 

         DI.setProjection({
            //  'chess.game.monitor': 'browser.context.live.utils.monitor',
            //  'chess.game.monitor': 'browser.context.live.utils.board-monitor',
            // 'monitor.game-start': 'browser.context.live.utils.game-start-monitor',
					 	'monitor.move': 'monitor.live.move-trigger',
            'game.state': 'browser.context.live.utils.game-state',
            'game.do-move': 'browser.context.live.utils.mover',
            'chess.game.statistics': 'browser.game.statistics',
         });

        //  DI.get('chess.game.statistics'); // Activate statistics
    }
}
