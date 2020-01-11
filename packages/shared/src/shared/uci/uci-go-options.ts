// For explanation fields: http://wbec-ridderkerk.nl/html/UCIProtocol.html
export interface IUCIGoOptions {
    wtime?: number;
    btime?: number;
    winc?: number;
    binc?: number;
    movestogo?: number;
    depth?: number;
    nodes?: number;
    movetime?: number;
}