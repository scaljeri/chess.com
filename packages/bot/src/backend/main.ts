import * as path from 'path';
import { Worker, isMainThread } from 'worker_threads';

import { DI } from "di-xxl";
import { Client } from './client';
import { ApiMsg } from '../models/api-msg'
import { ApiServer } from '../api/server';
import { INavigation } from './interfaces/navigation';
import { IEnvironment } from './interfaces/environment';
import { Environment } from './environment';

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    DI.get('client').close();
});

(async () => {
    if (isMainThread) {
        const worker = new Worker(path.resolve(__dirname, 'worker-import.js'));
        DI.set({
            name: 'api-worker',
            ref: worker,
            singleton: true
        });

        worker.on('message', async (msg: ApiMsg) => {
            if (msg.status === 'upload') {
                console.log('Ready');
            }
        });

        prepare();
    } else {
        const apiServer = new ApiServer(); // DI.get<ApiServer>('backend.api');
        apiServer.start();
    }

})();


async function prepare() {
    const client = await Client.connect()
    DI.set({
        name: 'client',
        ref: client,
        action: DI.ACTIONS.NONE,
        singleton: true
    });

    DI.setProjection({
        'context': 'backend.context'
    });

    // Setup all projections
    DI.get<Environment>('backend.environment').setup();

    await DI.get('navigation').go();
    await client.upload();
}