import { Injectable, DI, Inject } from "di-xxl";
import { IContext } from './interfaces/context';

@Injectable('backend.environment')
export class Environment {
    private contextName: string;

    @Inject('context')
    setContext(context: IContext) {
        this.contextName = context.contextName || 'computer';
    }

    setup(): void {
			DI.get(`backend.${this.contextName}.setup`).init();
    }
}
