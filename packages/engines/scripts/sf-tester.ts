import { UCI, UCI_OPTIONS } from "@scaljeri/chess-shared";
import { SfRunner } from "../src/shared/sf-runner";

const uci = new UCI();

const engine = new SfRunner();

(async () => {
    await engine.start();
    engine.setOption(UCI_OPTIONS.PONDER, false);

    uci.start(engine);

    let out = await uci.go('r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19', {
        wtime: 10000,
        btime: 10000
    });
    console.log(out);
})();

// (async () => {
//     await uci.start();

//     console.log('go');
//     let out = await uci.go('r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19', {
//         wtime: 100000,
//         btime: 100000
//     });
//     console.log(out,'now continue');

//     setTimeout(async () => {
//         console.log('MOVE MOVE MOVE MOVE');
//         out = await uci.go(uci.ponderFen, { wtime: 100000,
//             btime: 100000});
//         console.log('======================', out);
//         uci.stop();
//     }, 10000);

// })();