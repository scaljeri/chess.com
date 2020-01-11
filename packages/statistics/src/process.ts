// // with ES6 import
// import * as io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// socket.on('connect', function(){
//     console.log('connected');
// });
// socket.on('event', function(data){
//     console.log('received event')
// });
// socket.on('disconnect', function(){
//     console.log('disconnected');
// });

import * as fs from 'fs';
import { ChessUCIBackend } from '../../bot/src/frontend/bot/uci/uci-backend';
import { Statistics } from './models/statistics';
import { Data } from './models/data';
import { Side, Move, Game } from '@scaljeri/chess-shared';

const gameId = process.argv[2];
const movetime = parseInt(process.argv[3] || '10000', 10);

if (!gameId) {
  console.log('\nUsage: $> yarn stats <GameId>\n\n');
  process.exit(0);
}

const file = `../bot/tmp/game-stats/${gameId}.json`;

console.log(`Processing file ${file}`);
if (fs.existsSync(file)) {
  processFile(readFile(file));
} else {
  console.error(`File ${file} does not exist\n\n`);
  process.exit(1);
}

async function processFile(game) {
  const data: Data[] = [];
  const botColor = game.bot;
  const ponderHits = game.ponderHits;
  const bookMoves = game.bookMoves;
  const winner = game.winner;
  const uci = new ChessUCIBackend();
  const stats: Statistics = {
    bookMoves,
    ponderHits,
    winner,
    color: botColor,
    data,
  };

  uci.setContext({ socketPort: 5000 } as any);

  let calcScore = true;
  let scoreValue;
  console.log('Bot is ' + botColor);
  for (let i = 0; i < game.history.length; i++) {
    let { move, duration, timeWhite, timeBlack, fen, color } = game.history[i];

    let calc: Move = {} as Move;
    if (move.color === Side.b && calcScore) {
      console.log('input: ' + fen);
      calc = await uci.go(fen, { movetime }, { skipBook: true });
      console.log(calc);
    }

    // Bot score should always be positive (if winning)
    console.log('prev score value is =' + scoreValue);
    if (calc.score) {
      if (calc.score.type === 'mate') {
        calc = { } as any;
        scoreValue = botColor === Side.w ? 2500 : -2500;
        calcScore = false;
      } else {
        console.log(calc.score);

        scoreValue = calc.score.value;
      }
    }

    data.push({
      nr: i,
      color,
      from: move.from,
      to: move.to,
      promoteTo: move.promoteTo,
      duration,
      fen,
      clock: (move.color === Side.w ? timeWhite : timeBlack) / 1000,
      score: scoreValue
    } as Data);
  }

  console.log('done');
  try {
    fs.writeFileSync(`./output/${gameId}.json`, JSON.stringify(stats), { mode: 0o755 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Ouput written to ./output/${gameId}.json`);

  await uci.stop();
  process.exit(0);
}

function readFile(file: string) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
//file exists

// const uci = new ChessUCIWebsocket();
// uci.setContext({socketPort: 5000} as any);

// uci.go('r2qkb1r/pp3ppp/2n2n2/6B1/3pN1b1/P7/1PP1BPPP/R2QK1NR b KQkq - 0 10', { movetime: 10000 }).then((m: Move) => {
//     console.log('Move', m);
// })
