import { Chess } from 'chess-base';
import { Move } from '../../models/move';
import { UCIChessEngine } from './uci-chess-engine';
import { IUCIGoOptions } from './uci-go-options';
import { switchSide, Side } from '../side';
import { isMoveCastling } from '../castling';
import { pieces } from '../../models/pieces';

const RE_BEST = /^best/;
const RE_INFO = /^info/;
const RE_SPLIT_MOVE = /(..)*(..)/;
const RE_RM_LINEBREAK = /(\r\n|\n|\r)/;

export class UCI {
    protected bestMove: string;
    protected infoMove: string;
    protected resolveCallback: (m: Move) => void;
    protected rejectCallback: (err: string) => void;
    protected fen: string;
    public ponderFen: string;
    protected ponderMove: Move;
    protected processCb: (data: string) => void;
    protected isEngineReady = false;
    protected engine: UCIChessEngine;


    private infoMapper: Record<string, number | Record<string, number>>;
    private isStarted: Promise<void>;
    private started = 0;

    async start(engine?: UCIChessEngine): Promise<void> {
        if (this.isStarted) {
            return this.isStarted;
        }

        if (!engine) {
            throw Error('UCI initialized without a chess engine');
        }

        this.engine = engine;
        this.infoMapper = engine.getInfoMapper();

        engine.listen((info: string) => this.processOutput(info));

        this.isStarted = this.engine.start()

        return this.isStarted;
    }

    public stop(): void {
        this.ponderFen = null;
        this.engine.stop();
    }

    public async go(fen: string, options: IUCIGoOptions): Promise<Move> {
        this.fen = fen;
        this.started = Date.now();

        return new Promise<Move>(async (resolve, reject) => {
            let goArgs = '';

            for (let [key, value] of Object.entries(options)) {
                goArgs += ` ${key} ${value}`;
            }

            this.resolveCallback = (m: Move) => {
                m.ponderhit = !!this.ponderFen
                // console.log('Duration: ' + (Date.now() - this.started), fen);
                resolve(m);

                this.resolveCallback = this.rejectCallback = null; // Done

                if (this.engine.isPonderEnabled && m.ponder && fen) {
                    this.engine.cmd(`position fen ${fen} moves ${m.raw} ${m.ponder.raw}`)
                    this.engine.cmd(`go ponder ${goArgs}`) // TODO: Fix times

                    const chess = new Chess(fen);

                    if (isMoveCastling(fen, m)) {
                        chess.move(m.raw);
                    } else {
                        chess.move(m.from, m.to, m.promoteTo);
                    }

                    if (isMoveCastling(chess.toFen(), m.ponder)) {
                        chess.move(m.ponder.raw.replace(/[^\x20-\x7E]/g, ''));

                    } else {
                        chess.move(m.ponder.from, m.ponder.to, m.ponder.promoteTo);
                    }

                    this.ponderFen = chess.toFen();
                }
            };
            this.rejectCallback = reject;

            const hasPonderHit = await this.handlePondering(fen);
            // console.log('Ponderhit: ' + hasPonderHit);
            if (!hasPonderHit) {
                this.engine.cmd(`position fen ${fen}`);
                this.engine.cmd(`go ${goArgs}`);
            } else {
                console.log('Yes ponderhit');
            }
        })
    }

    protected async handlePondering(inputFen: string): Promise<boolean> {
        let retVal = false;
        if (this.ponderFen) {
            if (this.ponderFen === inputFen) { // Ponderhit
                this.getPonderMove();
                retVal = true;
            } else {
                await this.handleCancelPondering();
            }
        }

        return retVal;
    }

    handleCancelPondering(): Promise<void> {
        const cb = this.resolveCallback;

        return new Promise<void>(r => {
            this.resolveCallback = (move: Move) => {
                this.ponderFen = null;
                this.resolveCallback = cb;
                r();
            }

            // console.log('cancel pondering....');
            this.engine.stop();
        })
    }

    getPonderMove(): void {
        if (this.ponderMove) {
            this.resolveCallback(this.ponderMove);
            this.ponderMove = null;
        } else {
            console.log('Ponderhit!!');
            this.engine.cmd('ponderhit');
        }
    }

    protected ready(): void {
        // create a Move
        const bestParts = this.bestMove.split(' ');
        const color = Side[this.fen.split(' ')[1]];

        let ponder = null;

        if (bestParts[2] === 'ponder') {
            const [from, to, promoteTo] = bestParts[3].split(RE_SPLIT_MOVE).slice(1, 4);
            ponder = { from, to, promoteTo, raw: bestParts[3], color: switchSide(color)};
        } else {

        }

        const [from, to, promoteTo] = bestParts[1].split(RE_SPLIT_MOVE).slice(1, 4);

        const move: Move = {
            from,
            to,
            raw: bestParts[1],
            ...promoteTo && { promoteTo: promoteTo as pieces },
            color,
            ponder,
            ...(this.splitInfo(this.infoMove))
        };

        if (this.resolveCallback) {
            this.resolveCallback(move);
        }
    }

    splitInfo(info: string): Partial<Move> {
        const parts = (info || '').split(' ');
        // console.log(info);
        const scoreMapper = this.infoMapper.score as Record<string, number>;

        if (parts.length > 18) {
            return {
                pv: parts.slice(this.infoMapper.pv as number),
                tbhits: parseInt(parts[this.infoMapper.tbhits as number], 10),
                time: parseFloat(parts[this.infoMapper.time as number]),
                nodes: parseInt(parts[this.infoMapper.nodes as number], 10),
                score: { type: parts[scoreMapper.type as number], value: parseInt(parts[scoreMapper.value], 10) },
                depth: parseInt(parts[this.infoMapper.depth as number], 10),
                seldepth: parseInt(parts[this.infoMapper.seldepth as number], 10),
            }
        }

        return {};
    }

    protected processOutput(data: string) {
        const lines = ('' + data).split(RE_RM_LINEBREAK);

        lines.forEach((line: string) => {
            if (line.match(RE_INFO)) {
                this.infoMove = line;
            }

            if (line.match(RE_BEST)) {
                this.bestMove = line;
                this.ready();
            }
        });
    }
}

/* Fen examples
    Promote + mate: position fen 7k/PR6/8/8/8/8/8/K7 w - - 0 70
        info depth 17 seldepth 2 multipv 1 score mate 1 nodes 342 nps 48857 tbhits 0 time 7 pv a7a8q
        bestmove a7a8q
    Promote: position fen 7k/P7/8/8/8/8/8/K7 w - - 0 70
        info depth 10 seldepth 10 multipv 1 score cp 5952 nodes 16718 nps 1393166 tbhits 0 time 12 pv a7a8q h8g7 a8c6 g7h7 a3b3 h7g7 b3c4 g7h7 c4d4
        bestmove a7a8q ponder h8g7
*/