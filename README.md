This project is an experiment where I wrote a chess bot for [chess.com](https://chess.com/live). You can
checkout my article about this project [here](https://medium.com/swlh/programming-a-chess-bot-for-chess-com-fa6bd7e1da76).

# Install

    $> lerna bootstrap

or

    $> yarn 

# Build

     $> lerna run build

# Run - WebAssembly Stockfish
My chess bot can be started as follows

    $> lerna run start:bot

If you're lucky it will work and the browser will start and it shows the injected display at the 
bottom left corner. If you select a bot and hit `Play` the WebAssembly Stockfish will start playing.

Note: If it doesn't work you can go to `package/bot` and run `yarn build` and `yarn start` which will
give you more detailed output!

# Run - Docker Stockfish
It is also possible to run the Docker Stockfish engine, which plays stronger. For that to work you need to reconfigure
the bot ([README](packages/bot/README.md)). This bot also uses my OpeningBook, but that will probably not work
out of the box ( [README](packages/books/README.md)). It will however work without it.

Finally you have to configure the browser bundle a bit. Open the file `[./packages/bot/src/frontend/environment.ts](packages/bot/src/frontend/environment.ts)`.
It will have these lines

            // **** BOT CONFIGURATION ****/
            // Pure browser engine
            'chess.engine.browser': 'browser.chess.engine.stockfish',
            'chess.uci': 'browser.chess.uci.browser'

            // Combi engine
            // 'chess.engine.browser': 'browser.chess.engine.stockfish',
            // 'chess.uci': 'browser.chess.uci.combi',

            // Pure backend engine
            // 'chess.uci': 'browser.chess.uci.backend

This is where I tell my [DI](https://github.com/scaljeri/di-xxl) what to inject. Comment out the 2 lines below  
`Pure browser engine` and uncomment the single line below `Pure backend engine`. Thats all, lets build this 
and play (from the root of the project)

    $> lerna run build
    $> lerna run start

Thats it, good luck with that. If things don't work and require a fix or improvement, please feel free to create a Pull Request!!

# Nice games

   * 4303717585
   * ...


### Bookmarks
Checkout the other READMEs as well

  * [bot](packages/bot/README.md)
  * [engine](packages/engines/README.md)
  * [opening book](packages/books/README.md)
  

  * [Dependency Injection library](https://github.com/scaljeri/di-xxl)
  * [EventHub library](https://github.com/scaljeri/eventhub-xxl)
  * UCI protocol: http://wbec-ridderkerk.nl/html/UCIProtocol.html
  * instead of UCI proto: https://www.gnu.org/software/xboard/engine-intf.html
  * Online FEN renderer: http://www.chess-poster.com/english/fen/fen_epd_viewer.htm
  * chess lib: https://github.com/davidlacarta/chess
