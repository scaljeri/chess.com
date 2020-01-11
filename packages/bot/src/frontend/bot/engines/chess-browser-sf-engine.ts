import { UCIChessEngine, UCI_OPTIONS, INFO_MAPPER } from '@scaljeri/chess-shared';
import { Injectable, Inject } from 'di-xxl';
import { IContextSettings } from '../../../shared/interfaces/context-settings';

declare var Stockfish: any;

/**
 * An Engine is a proxy for an chess engine
 */
@Injectable({ name: 'browser.chess.engine.stockfish', singleton: true })
export class StockfishEngine implements UCIChessEngine {
    private port: number;
    isPonderEnabled = false;
    private engine: any;
    private callback: (output: string) => void;

    @Inject('context')
    setSettings(context: IContextSettings): void {
        this.port = context.serverPort;
    }

    start(): Promise<void> {
        if (this.engine) {
            return;
        }

        return new Promise(r => {
            const script = document.createElement('script');
            script.onload = () => {
                this.engine = Stockfish();
                this.engine.addMessageListener((line) => {
                    if (this.callback) {
                        this.callback(line as string);
                    }
                });

                this.engine.postMessage('uci');
                // this.setOption(UCI_OPTIONS.HASH, 512);
                this.setOption(UCI_OPTIONS.MOVE_OVERHEAD, 100);
                this.setOption(UCI_OPTIONS.SLOW_MOVER, 10);
                // this.setOption(UCI_OPTIONS.PONDER, true);  // --> Freezes the browser
                r();
            };
            script.src = `http://localhost:${this.port}/files/stockfish/stockfish.js`;
            document.head.appendChild(script); 
        });

        // this.cmd('uci');
        // this.setOption(UCI_OPTIONS.PONDER, true);
        // this.setOption(UCI_OPTIONS.MOVE_OVERHEAD, 200);
        // this.setOption(UCI_OPTIONS.CONTEMPT, 0);
        // this.setOption(UCI_OPTIONS.HASH, 1024);
        // this.setOption(UCI_OPTIONS.SLOW_MOVER, 50);
        // this.engine.onmessage = (event) => {
        //     console.log(event.data as string);
        //     if (this.callback) {
        //         this.callback(event.data as string);
        //     }
        //     console.log(event.data);
        // };

        // this.engine.setOption(UCI_OPTIONS.THREADS, 4);
        // this.engine.setOption(UCI_OPTIONS.MOVE_OVERHEAD, 200);
        // this.engine.setOption(UCI_OPTIONS.CONTEMPT, 0);
        // this.engine.setOption(UCI_OPTIONS.HASH, 1024);
        // this.engine.setOption(UCI_OPTIONS.SLOW_MOVER, 50);

        //return Promise.resolve();
    }
    listen(cb: (info: string) => void): void {
        this.callback = cb;
    }
    cmd(cmd: string): void {
        this.engine.postMessage(cmd);
    }

    setOption(option: UCI_OPTIONS, value: string | number | boolean): void {

        if (option === UCI_OPTIONS.PONDER) {
            console.log('PONDERING IS NOT SUPPORTED');
            // this.isPonderEnabled = Boolean(value);
        } else {
            this.cmd(`setoption name ${option} value ${value}`);
        }
    }

    stop(): void {
        if (this.engine) {
            this.engine.postMessage('stop');
        }
    }

    getInfoMapper(): Record<string, number | Record<string, number>> {
        return INFO_MAPPER;
    }
}