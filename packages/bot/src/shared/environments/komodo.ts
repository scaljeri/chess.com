import { Injectable, DI } from 'di-xxl';

@Injectable('environment.komodo')
export class BrowserConfigKomodo {
    prepare(): void {
        DI.setProjection({ 'playMove': 'browser.komodo.playMove'});
    }
}