import { Injectable, DI, Inject } from "di-xxl";
import { IContext } from './interfaces/context';

@Injectable('backend.environment')
export class Environment {
    private isLive: boolean;

    @Inject('context')
    setContext(context: IContext) {
        this.isLive = context.isPlayLive;
    }

    setup(): void {
        DI.setProjection({
            'navigation': `backend.navigation.${this.isLive ? 'live' : 'computer'}`
        }); 
    }
}