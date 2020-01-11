import { getS, getM } from './find';
import { Injectable } from 'di-xxl';

@Injectable('browser.dom')
export class DOM {
    private base: HTMLElement;

    constructor(private baseSelector: string) {
    }

    find(selector: string): HTMLElement {
        if (!this.base) {
            this.base = getS(this.baseSelector);
        }

        return getS(selector, this.base);
    }

    findAll(selector: string): HTMLElement[] {
        if (!this.base) {
            this.base = getS(this.baseSelector);
        }

        return Array.prototype.slice.call(getM(selector, this.base));
    }
}