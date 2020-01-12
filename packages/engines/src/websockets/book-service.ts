import { Injectable } from "@nestjs/common";
import { Move } from "@scaljeri/chess-shared";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

@Injectable()
export class BookService {
    private resolve = (moves: Move[]) => console.log(moves);
    private reject = (err) => console.error(err);
    private process: ChildProcessWithoutNullStreams;
    private isDisabled = false;

    constructor() {
        this.process = spawn('../books/search');

        this.process.on('exit', () => {
            this.isDisabled = true;
            console.log("OpeningBook is disabled");
        });

        this.process.stderr.on('data', (data) => {
            this.reject('' + data);
        });

        this.process.stdout.on('data', (data) => {
            const info = '' + data;
            const moves = info.split(/\n/g)
                .filter(str => str.length > 4)
                .reduce((out, str) => {
                    const [from, to] = str.match(/^(..)(..)/).slice(1,3);
                    out.push({ from, to });
                    return out;
                }, []);
                this.resolve(moves || []);
        });
    }

    lookup(fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'): Promise<Move[]> {
        if (this.isDisabled) {
            return Promise.resolve([]);
        } else {
            return new Promise((resolve, reject) => {
                this.resolve = resolve;

                this.process.stdin.write(`${fen}\n`);
            });
        }
    }

    async lookupRandom(fen?: string): Promise<Move> {
        const moves = await this.lookup(fen);

        return moves[Math.floor(Math.random() * moves.length)];
    }
}