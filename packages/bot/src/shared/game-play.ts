import { Injectable, Inject } from 'di-xxl';
import { IChessBot } from '../models/chess-bot';
import { IGamePlay } from '../models/game-play';
import { Game, Move, Side } from '@scaljeri/chess-shared';
import { IChessUtils } from '../models/chess-utils';

const FIRST_MOVES: Move[] = [
    { from: 'e2', to: 'e4', color: Side.White },
    { from: 'd2', to: 'd4', color: Side.White },
    { from: 'c2', to: 'c4', color: Side.White },
    { from: 'g1', to: 'f3', color: Side.White },
]

@Injectable({ name: 'shared.game-play' })
export class GamePlay implements IGamePlay {
    @Inject('chessbot') bot: IChessBot;
    @Inject('utils') utils: IChessUtils;

    private move: Move;
    private game: Game;

    createFirstMove(): Move {
        return FIRST_MOVES[Math.floor(Math.random() * FIRST_MOVES.length)];
    }

    async play(): Promise<void> {
        // Register for events
        this.bot.stop();

        // this.utils.waitForDraw(() => {
        //     // always accept (TODO
        //     console.log('DRAW OFFERED');
        //     this.utils.closeDrawDialog(false);
        //     this.bot.stop();
        // });

        this.utils.waitForMove(async (game: Game) => {
            const oppm = game.moves.slice(-1)[0];
            if (oppm.color !== game.bot) {
                console.log('Opp: from:' + oppm.from + 'to:' + oppm.to, game);
                this.game = game;
                this.move = await this.bot.calculateMove(game);
                console.log('Bot: from:', this.move.from + ' to: ' + this.move.to);
                await this.utils.move(this.move);
            } else {
                console.log("ERROR: Incorrect color!!!!!!", game);
                console.log('Update', await this.utils.getGame());
            }
        });

        this.game = await this.utils.prepare(); // wait until opponent has arrived and is ready to play

        console.log('WE are ' + this.game.bot);

        if (this.game.bot === 'w') {
            console.log('FIND OUR FIRST MOVE')
            // this.move = await this.bot.calculateMove(this.game);
            this.move = this.createFirstMove();
            // console.log('do first move', this.move);
            await this.utils.move(this.move);
        }

        const iid = setInterval(() => {
            const bd = this.utils.getS('.board-dialog-component');

            if (bd) {
                console.log('Game ended');
                clearInterval(iid);
                this.bot.stop();
            }
        }, 2000);


        // let move, game;
        // while (!game || !game.checkmate) {
        //     if (!game) {
        //         game = await this.utils.getGame();
        //     }

        //     const waitingFor = await this.waitingFor(game);

        //     if (waitingFor === game.opponent) {
        //         console.log('opponent\'s turn')
        //         game = await this.utils.waitForOpponent()
        //         console.log(game.moves[game.moves.length-1]);
        //     }

        //     if ( (game.moves || []).length === 0) {
        //         move = this.createFirstMove();
        //         console.log('do first move', move);
        //     } else {
        //         console.log('calc fist move', game.moves);
        //         move = await this.bot.calculateMove(game);
        //         console.log('||received move', move);
        //     }

        //     console.log('do move', move)
        //     await this.utils.move(move);
        //     game = null;
        //     // game = { moves: [], checkmate: true};
        // }
    }

    waitingFor(game: Game): Side {
        return (game.moves || []).length % 2 === 0 ? Side.White : Side.Black;

    }
}