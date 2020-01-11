const { spawn } = require('child_process');


const options = [
    'run',
    '--rm',
    '--interactive',
    'jeanluca/stockfish:latest'
];


const process = spawn('docker', options);

process.stderr.on('data', (data) => {
    console.log('stderr: ' + data);
});

let firstTime = true;
process.stdout.on('data', (data) => {
    const info = '' + data;
    console.log('** ' + info);

    if (firstTime) {
        firstTime = false;
        process.stdin.write('uci\n');
    } else if (info.match(/uciok/)) {
        console.log('ready');
        process.stdin.write('position fen r6k/2R5/6R1/pp1Ppp2/8/Pn2B1Pr/4KP2/8 w - -  0 30\n');
        process.stdin.write('go movetime 2000\n');
    }


    
});