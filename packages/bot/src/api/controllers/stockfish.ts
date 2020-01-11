import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as path from 'path';
import * as mime from 'mime-types';

import * as fs from 'fs';

@Controller('files/stockfish/')
export class StockfishController {
    @Get(':name')
    private getFiles(req: Request, res: Response) {
        const name = req.params.name;
        const mimeType = mime.lookup(name);

        Logger.Info(`Serving stockfish files: ${name}/${mimeType}`);

        res.setHeader('Content-Type', mimeType);
        res.sendFile(path.join(__dirname, `../../../../../node_modules/stockfish.wasm/${name}`));

        // fs.readFile(path.join(__dirname, `../../../../../node_modules/stockfish.wasm/${name}`), 'binary', (err: any, data: any) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     res.writeHead(200, {'Content-Type': mimeType});
        //     res.status(200).end(data);
        // });
    }

}