import { SfRunner } from '../src/shared/sf-runner';
import { UCI } from '@scaljeri/chess-shared';

const engine = new SfRunner();
const uci = new UCI();

engine.start().then(async () => {
    // const move = await uci.go('position fen r6k/2R5/6R1/pp1Ppp2/8/Pn2B1Pr/4KP2/8 w - -  0 30', {
    //      movetime: 1000
    // });

    // console.log(move);
});

uci.start(engine);