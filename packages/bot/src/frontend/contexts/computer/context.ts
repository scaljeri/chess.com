import { Injectable, DI } from 'di-xxl';
import { IContext } from '../../interfaces/context';
import { COMPUTER_DEFAULTS } from './settings';

@Injectable({ name: 'browser.context.computer', singleton: true})
export class ContextComputer implements IContext {
    prepare(): void {
        // DI.set({ 
        //     name: 'utils.piece',
        //      ref: ComputerPiece, 
        //      singleton: true
        //  });
 
         DI.set({
             name: 'settings',
             ref: COMPUTER_DEFAULTS,
             action: DI.ACTIONS.NONE
         })

        DI.setProjection({
            'monitor.bot.move.start': 'browser.context.computer.utils.monitor',
            'game.state': 'browser.context.computer.utils.game-state',
            'chess.game.mover': 'browser.context.computer.utils.mover',
        });
    }
}