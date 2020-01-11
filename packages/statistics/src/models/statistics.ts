import { Data } from './data';

export interface Statistics {
    color: 'w' | 'b';
    ponderHits: number;
    bookMoves: number;
    winner: string;
    data: Data[];
}