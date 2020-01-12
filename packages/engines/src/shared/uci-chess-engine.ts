import { Injectable } from "@nestjs/common";
import { EngineBase } from "./engine-base";
import { Move, Game, UCIChessEngine, UCI, UCI_OPTIONS, IUCIGoOptions } from "@scaljeri/chess-shared";
import { Lc0Runner } from "./lc0-runner";
import { SfRunner } from "./sf-runner";
import { ChessEngine } from "./interfaces";

@Injectable()
export class UCIChessEngineService extends EngineBase implements ChessEngine {
    private engine: UCIChessEngine;
    private uci: UCI;

    constructor(engineName = '') {
        super();

        this.uci = new UCI()

        if (engineName.toLowerCase() === 'lc0' || engineName.match(/leela/i)) {
            this.engine = new Lc0Runner();
            this.engine.start().then(() => {
                this.engine.setOption(UCI_OPTIONS.THREADS, 4);
                this.engine.setOption(UCI_OPTIONS.PONDER, true);
                this.engine.setOption(UCI_OPTIONS.MOVE_OVERHEAD, 100);
                this.engine.setOption(UCI_OPTIONS.CONTEMPT, 0);
                this.engine.setOption(UCI_OPTIONS.HASH, 1024);
                this.engine.setOption(UCI_OPTIONS.SLOW_MOVER, 50);
            });
        } else {
            this.engine = new SfRunner();
            this.engine.start().then(() => {
                this.engine.setOption(UCI_OPTIONS.THREADS, 128);        // Just a max value
                this.engine.setOption(UCI_OPTIONS.PONDER, true);        // Ponder
                this.engine.setOption(UCI_OPTIONS.MOVE_OVERHEAD, 120);  // 350 more draws, 130 wins
                this.engine.setOption(UCI_OPTIONS.CONTEMPT, 0);         // 
                this.engine.setOption(UCI_OPTIONS.HASH, 1024);          // Use more if possible
                this.engine.setOption(UCI_OPTIONS.SLOW_MOVER, 15);      // Beats stockfish 
            });
        }

        console.log(`Chess engine is: ${this.engine}`);

        this.uci.start(this.engine);
    }

    move(fen: string, options: IUCIGoOptions = {} ): Promise<Move> {
        return this.uci.go(fen, options);
    }

    setOption(option: UCI_OPTIONS, value: any): void {
        this.engine.setOption(option, value);
    }

    stop(): void {
        this.uci.stop();
    }
}