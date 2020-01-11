import { IContextSettings } from '../../shared/interfaces/context-settings';

export interface IContext {
    prepare: (conext: IContextSettings) => void;
}