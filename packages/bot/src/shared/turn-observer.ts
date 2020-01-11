import { Injectable, DI } from 'di-xxl';
import { BehaviorSubject } from 'rxjs';
import { Game } from '@scaljeri/chess-shared';

@Injectable({ name: 'shared.turnObserver', singleton: true })
export class TurnObserver {
    turn = new BehaviorSubject<Game>(null);

    start(): void {

    }

    stop(): void {

    }
}

DI.set({
    name: 'shared.turnObserver$',
    ref: DI.get('shared.turnObserver').turn.asObservable(),
    action: DI.ACTIONS.NONE
});

