import { Move } from '../models/move'
import { parseFen } from './fen';
import { IFen } from '../models/fen';
import { Side } from './side';

/* This function determines if the move is castling or not. 
   Note that a move like `e1` to `g1` is not necessarly a castle!
*/
export function isMoveCastling(fen: string, move: Move): boolean {
    const { active, castleWhite, castleBlack }: IFen = parseFen(fen);

    return (
            active === Side.White && move.from === 'e1' && 
            (castleWhite.q || castleWhite.k) && 
            (move.to === 'c1' || move.to === 'g1')
           )
           ||
           ( 
            active === Side.Black && move.from === 'e8' &&
            (castleBlack.q || castleBlack.k) &&
            (move.to === 'c8' || move.to === 'g8')
           )
}