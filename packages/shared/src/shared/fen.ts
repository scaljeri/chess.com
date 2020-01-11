import { IFen } from '../models/fen'; 
import { Side } from './side';

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

const SPLIT_RE = /([bw])\s([^ ]+)\s[^ ]+\s(\d+)\s(\d+)$/;

export function parseFen(fen: string): IFen {
    const [color, castleStr, enPassant, halfMoves, fullMoves] = fen.match(SPLIT_RE).slice(1,5);

    return { 
        source: fen,
        active: color === 'w' ? Side.White : Side.Black, 
        castleWhite: { q: !!~castleStr.indexOf('Q'), k:  !!~castleStr.indexOf('K')},
        castleBlack: { q: !!~castleStr.indexOf('q'), k:  !!~castleStr.indexOf('k')},
        enPassant, 
        halfMoves: parseInt(halfMoves), 
        fullMoves: parseInt(fullMoves)
    }
}