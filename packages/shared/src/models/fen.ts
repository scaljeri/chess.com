
import { Side } from '../shared/side'

export interface IFen {
    active: Side;
    castleWhite: { q: boolean, k: boolean },
    castleBlack: { q: boolean, k: boolean },
    enPassant: string,
    halfMoves: number;
    fullMoves: number;
    source: string;
}