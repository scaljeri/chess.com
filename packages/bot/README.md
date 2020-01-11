### Credentials
To play at chess.com/live you need to login, so add your credentials to `.env` otherwise nothing
will happen.

### Available engines
Currently I have 3 type of engines. The strongest is Stockfish inside docker, the seconds one
is the WebAssembly version of Stockfish and the third is a combination of the two, although I
don't know if the last one is stronger.

Inside the file `src/frontend/environment.ts` you can choose the engine you want!