export enum Side {
    White = 'w',
    Black = 'b',
    w = 'w',
    b = 'b'
}

export function switchSide(side: keyof typeof Side): Side {
    return Side[side] === Side.White ? Side.Black : Side.White;
}