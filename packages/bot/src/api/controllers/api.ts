import { Request, Response } from 'express';
import { Controller, Post, Get } from '@overnightjs/core';
import * as fs from 'fs';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

@Controller('api')
export class MoveController {

  @Post('move')
  private async postMessage(req: Request, res: Response) {
    const fen = req.body.fen;
    console.log(req.body);
    console.log('fen:' + fen);

    const { stdout, stderr } = await exec(`../books/search '${fen}'`);

    console.log(stdout);
    res.status(200).json({
      from: stdout.slice(0, 2),
      to: stdout.slice(2, 4)
    });
  }

  @Post('game-stats')
  private async postGameStats(req: Request, res: Response) {
    fs.writeFile(`./tmp/game-stats/${req.body.gameId}.json`, JSON.stringify(req.body), 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      return 'JSON file has been saved.';
    });
  }

  @Get('ping')
  private ping(req: Request, res: Response) {
    res.status(200).json({ status: 'ok' });
  }
}

/*
rawResponse = fetch('http://localhost:3000/api/move', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({feb: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'})
  });
  const content = await rawResponse.json();

  console.log(content);

  ==
  rawResponse = fetch('http://localhost:3000/api/move', {
    method: 'POST',
    body: JSON.stringify({feb: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'})
  });
await rawResponse; //.json();
content = rawResponse.json();
console.log(content);
==

   curl -d "fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" -X POST http://localhost:3000/api/move
  */