import { UCI_OPTIONS } from './uci-engine-options';

export interface UCIChessEngine {
    isPonderEnabled: boolean;
    start(): Promise<void>;
    listen(cb: (info: string) => void): void;
    cmd(cmd: string): void;
    setOption(option: UCI_OPTIONS, value: string | boolean | number): void;
    stop(): void;
    getInfoMapper(): Record<string, number | Record<string, number>>;
}