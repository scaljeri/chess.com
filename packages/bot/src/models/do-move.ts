import { Move } from '@scaljeri/chess-shared';

export interface IDoMove {
    do: (move: Move) => void;
}