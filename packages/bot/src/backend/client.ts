import { DI } from 'di-xxl';
import { Context } from './context';
import { Environment } from '../frontend/environment';
import * as puppeteer from 'puppeteer-extra';
import * as ppUserPrefs from 'puppeteer-extra-plugin-user-preferences';
import { IClient } from './interfaces/client';
import { IContextSettings } from '../shared/interfaces/context-settings';
import { IContext } from './interfaces/context';
import { EventHub } from 'eventhub-xxl';


declare var window: { __: DI }

puppeteer.use(ppUserPrefs({
    userPrefs: {
      devtools: {
        preferences: {
          'InspectorView.splitViewState': JSON.stringify({
            vertical: {size: 300},
            horizontal: {size: 300},
          }),
          uiTheme: '"dark"',
          'panel-selectedTab': 'console',
          'drawer-view-selectedTab': '"console-view"'
        }
      },
    },
  }));


export class Client implements IClient {
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;

    constructor() {
    }

    static async connect(): Promise<Client> {
        const client = new Client();

        client.browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            defaultViewport: null,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            args: [
                '--debug-devtools',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--allow-running-insecure-content',
                '--disable-notifications',
                '--window-size=1920,1080'
            ]
            //slowMo: 500
        });

        const pages = await client.browser.pages();
        client.page = pages[0];

        return client;
    }

    async execute(cb, ...args) {
        await this.page.evaluateHandle(cb, ...args);
    }

    async close() {
        await this.page.close();
    }


    async goto(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'networkidle2' });
    }

    async login() {
        const context = DI.get<IContext>('context');

        await this.page.type('#username', context.username);
        await this.page.type('#password', context.password);
        await this.page.click('.form-input-component + .form-button-component');
    }

    async upload(): Promise<void> {
        const c = DI.get<Context>('context');
        const serverPort = c.serverPort;
        const socketPort = c.socketPort;

        console.log('Inject script');
        return this.page.evaluate((context: IContextSettings) => {
            function waitUntilAvailable() {
                fetch(`http://localhost:${context.serverPort}/api/ping`)
                    .then((res) => {
                        if (res.status !== 200) {
                            throw Error('error');
                        }
                        const script = document.createElement('script');
                        document.body.appendChild(script);
                        script.async = true;
                        script.onload = () => {
                            window.__.get<Environment>('browser.environment').setup(context);
                            window.__.get<EventHub>('eh').trigger('connect');
                        };
                        script.src = `http://localhost:${context.serverPort}/files/browser/chess-utils`;
                    }).catch((err) => {
                        setTimeout(() => {
                            waitUntilAvailable();
                        }, 500);
                    });
            }

            waitUntilAvailable();
        }, { serverPort, socketPort } as puppeteer.Serializable);

    }

    // async $(selector: string): Promise<WebdriverIOAsync.Element> {
    //     return this.waitUntilVisible(selector).$();
    // }

    // async $$(selector: string): Promise<WebdriverIOAsync.Element[]> {
    //     return this.waitUntilVisible(selector).$$();
    // }

    // async scrollIntoView(selector: string): Promise<unknown> {
    //     return this.execute((s: string) => {
    //         document.querySelector(s).scrollIntoView();
    //     }, selector);
    // }
    // async isExisting(selector): Promise<WebdriverIOAsync.Element> {
    //     const el = await this.browser.$(selector);
    //     const check = await el.isExisting();

    //     return check ? el : null;
    // }

    // async executeAsync(cb, ...args) {
    //     const output = await this.browser.executeAsync(cb, ...args);

    //     return output;
    // }

    // async execute(cb, ...args): Promise<unknown> {
    //     return this.browser.execute(cb, ...args);
    // }

    // waitUntilVisible(selector: string): { $: () => Promise<WebdriverIOAsync.Element>, $$: () => Promise<WebdriverIOAsync.Element[]> } {
    //     function runCheck(checkFn) {
    //         return new Promise(async (resolve) => {
    //             const id = setInterval(async () => {
    //                 const check = await checkFn();

    //                 if (check) {
    //                     clearInterval(id);
    //                     resolve();
    //                 }
    //             }, 200);
    //         });
    //     }

    //     return {
    //         $: async () => {
    //             await runCheck(async () => {
    //                 let el = await this.isExisting(selector);
    //                 if (el) {
    //                     el = await this.browser.$(selector);
    //                     return await el.isDisplayedInViewport();
    //                 } else {
    //                     return false;
    //                 }
    //             });

    //             return this.browser.$(selector);
    //         },
    //         $$: async () => {
    //             await runCheck(async () => {
    //                 const list = await this.browser.$$(selector);
    //                 return list.length > 0;
    //             });

    //             return this.browser.$$(selector);
    //         }
    //     }
    // }

    // async test(): Promise<number> {
    //     // TODO: Fix typings somehow
    //     const output: any = await this.browser.execute(function () {
    //         return 11;
    //     });

    //     return output as number;
    // }

    // async vsComputer() {
    //     await this.browser.url('https://www.chess.com/play/computer');
    //     const button = await this.browser.$(FAIR_PLAY);
    //     const exists = await button.isExisting();
    //     if (exists) {
    //         await button.click();
    //     }
    // }

    // async goOnline() {
    //     const button = await this.browser.$('[data-panel=play]');
    //     return button.click();
    // }


    // async selectKomodo(index: number) {
    //     let list: WebdriverIOAsync.Element[];

    //     // list = await this.waitUntilVisible('.vs-computer-content .vs-computer-row', true);
    //     // list[0].click();

    //     // setTimeout(async () => {
    //     //     const list = await this.browser.$$('.vs-computer-content .vs-computer-row');
    //     //     console.log('test axy ' + list.length);

    //     // if (list[index]) {
    //     //     // const isExisting = await list[index].isExisting();

    //     //     // if (isExisting) {
    //     //     console.log('-0szdpigjksjrngkjanlalskjhbsekrjhgb');
    //     //     // await list[index].click();
    //     // } else {
    //     //     console.log('okoko')
    //     //     const play = await this.browser.$('[data-tab=challenge]');
    //     //     await play.click();

    //     // }

    // }

    // async getColor(): Promise<any> {
    //     const color = await this.browser.execute(() => {
    //         if (window.bu.ME === undefined) {
    //             window.bu.buildGrid();
    //         }

    //         return window.bu.ME;
    //     });

    //     console.log('THE COLOR ' + color);
    //     return color;
    // }

    // async getGame(): Promise<any> {
    //     const game = await this.browser.execute(() => {
    //         return window.bu.getGame();
    //     });
    //     console.log('THE GAME ', game);

    //     return game;
    // }

    // async doMove(move: Move): Promise<Game> {
    //     return this.browser.executeAsync(function (move: Move, done) {
    //         if (move) {
    //             window.bu.move(move).then(done);
    //         } else {
    //             window.bu.firstMove().then(done);
    //         }
    //     }, move);
    // }

    // async waitForOpponent(): Promise<Game> {
    //     const game = await this.executeAsync(function(done) {
    //         window.bu.waitForOpponent().then(done);
    //     });

    //     return game as Game;
    // }
}
