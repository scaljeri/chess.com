import { Injectable, Inject, DI } from "di-xxl";
import { IGamePlay } from '../models/game-play';
import { Client } from './client';

declare var window: { __: DI };

@Injectable('backend.game-play-proxy')
export class BackendGamePlayProxy implements IGamePlay {
    @Inject('backend.client') client: Client;

    async play(): Promise<void> {
        await this.client.execute(() => {
            window.__.get<IGamePlay>('game-play').play();
        });
    }
}