import { Request, Response } from 'express';
import { Controller, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as fs from 'fs';
import * as path from 'path';
import { Param, Res } from '@nestjs/common';

@Controller('files/browser')
export class FileController {

    @Get('chess-utils')
    private getFile(req: Request, res: Response) {
        Logger.Info('Serving file ./dist/src/frontend/main-di-browserified.js');

        fs.readFile('./dist/frontend/main-di-browserified.js', 'utf8', (err: any, data: string | Buffer) => {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.status(200).end(data);
        });
    }

    // @Get('webworker-sf')
    // private getWebworkerSf(req: Request, res: Response) {
    //     Logger.Info('Serving file ../../node_modules/stockfish.js/stockfish.js');

    //     // fs.readFile('../../node_modules/stockfish.js/stockfish.js', 'utf8', (err: any, data: string | Buffer) => {
    //     fs.readFile('./text.txt', 'utf8', (err: any, data: string | Buffer) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         res.writeHead(200, {'Content-Type': 'text/javascript'});
    //         res.status(200).end(data);
    //     });
    // }

    // @Get('webworker-wasm.js')
    // private getWebworkerWasmSfjs(req: Request, res: Response) {
    //     Logger.Info('Serving file ../../node_modules/stockfish.js/stockfish.wasm.js');

    //     fs.readFile('../../node_modules/stockfish.js/stockfish.wasm.js', 'utf8', (err: any, data: string) => {
    //         if (err) {
    //             console.log(err);
    //         }

    //         // res.setHeader('Access-Control-Allow-Origin', '*');
	//         // res.setHeader('Access-Control-Request-Method', '*');
	//         // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    //         // res.setHeader('Access-Control-Allow-Headers', '*');
    //         // res.setHeader('Content-Type', 'application/wasm');
    //         res.setHeader('Content-Type', 'application/javascript');

    //         // res.writeHead(200, {'Content-Type': 'application/wasm'});
    //         res.status(200).end(data);
    //     });
    // }

    // @Get('stockfish.wasm')
    // private getWebworkerWasmSf(req: Request, res: Response) {
    //     Logger.Info('Serving file ../../node_modules/stockfish.js/stockfish.wasm');

    //     res.setHeader('Content-Type', 'application/wasm');
    //     res.sendFile(path.join(__dirname, '../../../../../node_modules/stockfish.js/stockfish.wasm'));
    // }

}