import { Observable } from 'rxjs';

export interface IGamePlay {
    start: () => void;
    stop: () => void;
    isPlaying$: Observable<boolean>;
}