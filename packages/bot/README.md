### Credentials
To play at chess.com/live you need to login, so add your credentials to `.env` otherwise nothing
will happen.

### Available engines
Currently I have 3 type of engines. The strongest is Stockfish inside docker, the seconds one
is the WebAssembly version of Stockfish and the third is a combination of the two. I still don't
know if the combination of the two is better. The `Combination` switches, when there are 10 seconds 
left on the clock, from the Docker Stockfish to the WebAssembly version.

Inside the file `src/frontend/environment.ts` you can choose the engine you want!
