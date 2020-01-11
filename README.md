This project is an experiment where I wrote a chess bot for [chess.com](https://chess.com/live)

# Install

    $> lerna bootstrap

or

    $> yarn 

# Build

     $> lerna run build
     
# Run - WebAssembly Stockfish
In order to play the chess bot needs to be able to login, so add your chess.com credentials in [./packages/bot/.env](packages/bot/.env). Then start the bot

    $> lerna run start:bot

Thats all, if you're lucky it will work and the browser will be shown with the injected display in the 
bottom left corner. If you select a bot and hit `Play` the WebAssembly Stockfish will start playing.

# Run - Docker Stockfish
This one is a bit more complicated. Fist you need to make sure the OpenBook is working. Read the 
[readme](packages/books/README.md) on how to get that one up&running. And you need Docker too!

Finally you have to configure the browser bundle. Open the file `./packages/bot/src/frontend/environment.ts`.
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

Comment out the 2 lines below  `Pure browser engine` and uncomment the single line below `Pure backend engine`.
Thats all, lets build this and play (from the root of the project)

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
  

  * UCI protocol: http://wbec-ridderkerk.nl/html/UCIProtocol.html
  * instead of UCI proto: https://www.gnu.org/software/xboard/engine-intf.html
  * Online FEN renderer: http://www.chess-poster.com/english/fen/fen_epd_viewer.htm
  * chess lib: https://github.com/davidlacarta/chess
