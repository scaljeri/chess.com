import { SfRunner } from '../src/shared/sf-runner';

const engine = new SfRunner();

engine.start().then(async () => {
    engine.cmd('position fen r6k/2R5/6R1/pp1Ppp2/8/Pn2B1Pr/4KP2/8 w - -  0 30\n');
    engine.cmd('go movetime 1000\n');
    // const move = await this.uci.go('position fen r6k/2R5/6R1/pp1Ppp2/8/Pn2B1Pr/4KP2/8 w - -  0 30', {
    //     movetime: 1000
    // });

    // console.log(move);
});