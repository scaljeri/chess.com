import { UCI, UCI_OPTIONS } from "@scaljeri/chess-shared";
import { Lc0Runner } from "../src/shared/lc0-runner";

const uci = new UCI();

const engine = new Lc0Runner();

(async () => {
    await engine.start();
    engine.setOption(UCI_OPTIONS.PONDER, true);

    uci.start(engine);

    let out = await uci.go('r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19', {
        wtime: 50000,
        btime: 50000
    });
    console.log(out, uci.ponderFen);

    setTimeout(async ()=> {
        console.log('NEXT MVOE _--------------------');
        engine.setOption(UCI_OPTIONS.PONDER, false);
        out = await uci.go('r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19', /*uci.ponderFen, */{
            wtime: 49000, btime: 49000
        });
        console.log(out);
    }, 5000);
})();