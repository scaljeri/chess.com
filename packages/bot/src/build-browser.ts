import { DI } from 'di-xxl';

// declare var window: any;
const context = DI.get('context');

console.log(`Build Bot for ${context.opponent}`);

DI.setProjection({ 'config': `browser.${this.context.o}.config`} );

(async () => {
    // const args = DI.get('arguments'); // Object with CLI arguments
    // console.log(args);

    // Setup browserConfig
    // const environment = DI.get('environment'); //, { params: [args.opponent]});
    // environment.setup();

    // console.log('TEST 123', DI.get('browserConfig').todo);
    // console.log(args.o);

    // await client.goto('https://chess.com/');
    // await client.login();

    // const nav = new Navigation(client);
    // console.log('ok');
    // const env = DI.get('environment');
    // console.log(env.client);

    // vs Computer
    // await nav.playComputer();
    // await nav.setComputerLevel(10);
    // const player = new Player(client);
    // await client.injectHack('computer');
    // await player.beginVsComputer()

    // // vs Komodo
    // await nav.playLive();
    // const bots = await nav.gotoKomodo();
    // console.log(`Found ${bots.length} bots`);
    // await nav.chooseKomodo(bots[bots.length - 1].index);
    // await nav.chooseTime('1 min');
    // await nav.startPlaying();

    // await nav.hasOpponents()

    // await client.injectHack('komodo');
    // const player = new Player(client);
    // await player.play();

    // await browser.deleteSession()
})().catch((e) => console.error(e))
