import { Injectable, Inject } from 'di-xxl';
import { INavigation } from '../interfaces/navigation';
import { IClient } from '../interfaces/client';
import { IContext } from '../interfaces/context';

@Injectable('backend.navigation.live')
export class LiveNavigation implements INavigation {
    @Inject('backend.client') client: IClient;

    async go() {
        await this.client.goto('https://chess.com/play');
        await this.client.login()

        await this.client.goto('https://www.chess.com/live');
    }
}