import { Injectable, Inject } from 'di-xxl';
import { INavigationOpponent } from '../../models/navigation-opponent';
import { IClient } from '../interfaces/client';
import { IContext } from '../interfaces/context';

@Injectable('backend.navigation.computer')
export class ComputerNavigation implements INavigationOpponent {
    @Inject('backend.client') client: IClient;

    async go() {
        await this.client.goto('https://www.chess.com/play/computer');
    }
}