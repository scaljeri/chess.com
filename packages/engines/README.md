### Chess engine
For this project I only used Stockfish as my chess engine, but if you like, you can also use Leela Chess Zero (Lc0). Although
Lc0 is stronger than Stockfish in real life, it requires a GPU to perform well. Unfortunately I don't have that, and Lc0 will 
play very weak.

First build the project

    $> yarn build
 
then run it

    $> yarn run:sf

or

    $> yarn run:lc0

### Build docker images

    $> docker build -t scaljeri/stockfish:x.x.x -f ./sf/Dockerfile-sf .

or

    $> docker build -t scaljeri/lc0:x.x.x -f ./lc0/Dockerfile .
 

run it like

    $> docker run --rm --interactive jeanluca/stockfish:latest


Checkout [sf-runner.ts](./src/shared/sf-runner.ts) to see how its used by my NestJS backend. For example, you can increase
the number of CPUs there. Also, to improve game play even more, you can modify the chess engine settings [here](src/shared/uci-chess-engine.ts).

BTW, the nestJS entrypoint for my frontend to send moves to is located [here](./src/websockets/events/events.gateway.ts)

## Usage
If you run the stockerfish container manually you can fire commands yourself as follows:

    $> uci
    $> ucinewgame
    $> position startpos
    $> position fen r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19
    $> go btime 30000 wtime 30000 winc 2000 binc 2000
    $> go 

or
    $> go depth 15

or 

    $> go movetime 300000 // 5 minute

or
    ucinewgame
    position startpos moves e2e4
    go
    bestmove d7d5 ponder e4e5
    go ponder
    position startpos moves e2e4 d7d5 e4e5

#### Complex example

    ucinewgame
    position fen r2qkb1r/pp3ppp/2n2n2/6B1/3pN1b1/P7/1PP1BPPP/R2QK1NR b KQkq - 0 10
    go wtime 600000 winc 1000 btime 600000 binc 1000
        bestmove g4f5 ponder e4d2
    go ponder wtime 98123 winc 1000 btime 100000 binc 1000
    go ponder wtime 600000 btime 600000
    ponderhit

### Bookmarks

    UCI protocol: http://wbec-ridderkerk.nl/html/UCIProtocol.html