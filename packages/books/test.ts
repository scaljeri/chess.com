import { spawn } from "child_process";

// const process = spawn('/usr/local/bin/python3', ['./test.py']);
const process = spawn('./search', []);

process.stderr.on('data', (data) => {
    console.error('' + data);
});

process.stdout.on('data', (data) => {
    const info = '' + data;
    console.log(info);
});

const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0';
process.stdin.write(`${fen}\n`);
process.stdin.write(`${fen}\n`);