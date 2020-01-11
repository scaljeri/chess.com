import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { UCI_OPTIONS, UCIChessEngine } from "@scaljeri/chess-shared";

const RE_STARTED_ENGINE = /\|_ \|_ \|_\|.*built/;
const RE_READY_ENGINE = /uciok/;
const INFO_MAPPER = {
    depth: 2,                // search depth in plies
    seldepth: 4,             // selective search depth in plies
    time: 6,                 // the time searched in ms
    nodes: 8,                // x nodes searched
    score: { type: 10, value: 11 },
    hashfull: 13,
    nps: 15,
    tbhits: 17,              // x positions where found in the endgame table bases
    pv: 19,
};

export class Lc0Runner implements UCIChessEngine {
    private process: ChildProcessWithoutNullStreams;
    private processCb: (info: string) => void = () => ({});

    private isReady = false;
    private hasStarted = false;

    public isPonderEnabled = false;

    toString(): string {
        return 'Leele Chess Zero';
    }

    start(): Promise<void> {
        if (this.process) {
            return Promise.resolve();
        }

        return new Promise<void>(resolve => {
            const options = [
                'run',
                '--rm',
                '--interactive',
                'jeanluca/leela-chess-zero:latest'
            ]

            this.process = spawn('docker', options);

            this.process.stderr.on('data', (data) => {
                const info = '' + data;
                if (!this.isReady) {
                    console.log(info);
                }

                if (!this.hasStarted && info.match(RE_STARTED_ENGINE)) {
                    this.cmd('uci');
                    this.hasStarted = true;
                }

                if (this.isReady) {
                    console.log('stderr: ' + data); // TODO
                }
            });

            this.process.stdout.on('data', (data) => {
                data = '' + data;

                if (!this.isReady && data.match(RE_READY_ENGINE)) {
                    this.isReady = true;
                    resolve();
                }

                if (this.isReady) {
                    this.processCb(data);
                }

            });
        })
    }

    public listen(cb: (info: string) => void): void {
        this.processCb = cb;
    }

    public cmd(cmd: string): void {
        console.log(cmd);
        this.process.stdin.write(`${cmd}\n`);
    }

    public stop(): void {
        this.cmd('stop');
    }

    public setOption(option: UCI_OPTIONS, value: string | boolean | number) {
        this.cmd(`setoption name ${option} value ${value}`);

        console.log('option ' + option, value);
        if (option === UCI_OPTIONS.PONDER) {
            this.isPonderEnabled = Boolean(value);
        }
    }

    public pondering(state: boolean): void {
        this.setOption(UCI_OPTIONS.PONDER, state);
    }

    public getInfoMapper(): Record<string, number | Record<string, number>> {
        return INFO_MAPPER;
    }

}