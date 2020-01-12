import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { UCIChessEngine, UCI_OPTIONS, INFO_MAPPER } from "@scaljeri/chess-shared";

const RE_READY = /Stockfish/;

export class SfRunner implements UCIChessEngine {
    private process: ChildProcessWithoutNullStreams;
    private processCb: (info: string) => void = () => ({});

    private isReady = false;
    private hasStarted = false;

    public isPonderEnabled = false;

    public toString(): string {
        return 'Stockfish';
    }

    public start(): Promise<void> {
        if (this.process) {
            return Promise.resolve();
        }

        return new Promise<void>(resolve => {
            const options = [
                'run',
                '--rm',
                '--interactive',
                '--cpus=1',
                'jeanluca/stockfish:latest'
            ]
            this.process = spawn('docker', options);

            this.process.stderr.on('data', (data) => {
                console.log('stderr: ' + data);
            });

            this.process.stdout.on('data', (data) => {
                const info = '' + data;
                if (this.isReady) {
                    return this.processCb(data);
                } else if (info.match(RE_READY)) {
                    this.isReady = true;
                    return resolve();
                } else if (!this.hasStarted) {
                    this.hasStarted = true;
                    this.cmd('uci');
                }
            });
        })
    }

    public listen(cb: (info: string) => void): void {
        this.processCb = cb;
    }

    public cmd(cmd: string): void {
        console.log('sf cmd: ' + cmd);
        this.process.stdin.write(`${cmd}\n`);
    }

    public stop(): void {
        this.cmd('stop');
    }

    public setOption(option: UCI_OPTIONS, value: string | boolean | number) {
        this.cmd(`setoption name ${option} value ${value}`);

        if (option === UCI_OPTIONS.PONDER) {
            console.log('ENABLE PONDERING!!!!!', value);
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