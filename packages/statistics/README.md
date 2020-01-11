## Import 
For this you need the docker chess engine (maybe not realy necessary but thats how it is now)

    $> cd ./packages/engine
    $> yarn run:sf

Each game is stored inside /packages/bot/tmp/game-stats
Use the game id to import it

    $> cd ./packages/statistics
    $> yarn stats 4300441561 2000

it will analyse each move by 2000ms (default is 1000) and the output is stored inside `./output`

## Display
Start the webserver

    $> yarn start

and navigate to http://localhost:3001
    