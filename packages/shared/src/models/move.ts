import { pieces } from "./pieces";
import { Side } from "../shared/side";

export interface Move {
    color: Side;
    from?: string;
    to?: string;
    raw?: string;
    promoteTo?: pieces;
    ponder?: Move;
    nodes?: number;
    nps?: number;
    score?: { type: string, value: number };
    depth?: number;
    seldepth?: number;
    multipv?: number;
    time?: number;
    tbhits?: number;
    pv?: string[];
    flags?: string;
    piece?: string;
    san?: string;
    ponderhit?: boolean;
}

// [{ color: 'w', from: 'e2', to: 'e4', flags: 'b', piece: 'p', san: 'e4' },