import 'dotenv/config';

import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Inject, Injectable } from 'di-xxl';
import { parentPort } from 'worker_threads';
import { ApiMsg } from '../models/api-msg';

@Injectable({ name: 'backend.api', singleton: true })
export class ApiServer extends Server {
    private port = 3000;
    private server: http.Server;

    @Inject({ name: 'context' })
    setProxyPort(args): void {
        this.port = args.apiPort;
    }

    private readonly SERVER_STARTED = 'Example server started on port: ';

    constructor() {
        super(true);

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.setupControllers();
    }

    private setupControllers(): void {
        const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                ctlrInstances.push(new controller());
            }
        }
        super.addControllers(ctlrInstances);
    }

    public start() {
        // this.app.post('/xxx', (req, res) => {
        //     console.log('* ', req.body);
        //     res.send(this.SERVER_STARTED + this.port);
        // });

        this.server = this.app.listen(this.port, () => {
            console.log('up and running');
            Logger.Imp(this.SERVER_STARTED + this.port);
            const msg: ApiMsg = { status: 'upload'};
            if (parentPort) {
                parentPort.postMessage(msg);
            }
        });
    }

    public stop(): void {
        this.server.close();
    }
}

// new ApiServer().start();