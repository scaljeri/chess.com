import { Injectable, Inject, DI } from 'di-xxl';
import { BehaviorSubject } from 'rxjs';
import { IGamePlay } from './interfaces/game-play';
import { isPlaying } from './utils/is-playing';
import { EventHub } from 'eventhub-xxl';
import { IGameState } from './interfaces/game-state';

@Injectable({ name: 'browser.game-play', singleton: true})
export class GamePlay implements IGamePlay {
    private isPlaying = new BehaviorSubject<boolean>(false);
    private eh: EventHub;

    @Inject('eh') 
    initialize(eh: EventHub): void {
        this.eh = eh;
        this.eh.on('action.move', () => this.onMove());
    };

    public isPlaying$ = this.isPlaying.asObservable();

    onMove(): void {
        // const gameState = DI.get<IGameState>('game-state');

        // if (this.isPlaying) {

        // }
    }

    start(): void {
        this.isPlaying.next(true);

        if (isPlaying()) {

        }

        // Determine game state
    }

    stop(): void {
        this.isPlaying.next(false);
    }
}