import * as child from 'child_process';
import { resolve } from 'url';

const exec = child.exec;

// TODO: match image / container
export async function detectChessEnginePorts(): Promise<number[]> {
    return new Promise((resolve, err) => {
        exec('docker-compose ps', (error, stdout, stderr) => {
            if (error) {
                err(err);
            }

            const ports = stdout.split(/\r?\n/).slice(2, -1).map(line => parseInt(line.match(/0\.0\.0\.0:([^-:]+)/)[1], 10));
            resolve(ports);
        });
    });
}

// (async () => {
//     const request = detectChessEnginePorts();
//     const ports = await request;

//     console.log(ports);
// })();