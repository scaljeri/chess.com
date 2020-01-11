import { Move, Side } from '@scaljeri/chess-shared';
import { Injectable, Inject } from 'di-xxl';
import { HTML } from './display/html';
import { IDisplay } from './interfaces/display';
import { EventHub } from 'eventhub-xxl';

declare var ko;

const SELECTOR = {
    botState: 'state',
    reload: 'reload',
    bookMoves: 'book-moves',
    ponderhits: 'ponderhits',
    color: 'color',
    scoreType: 'score-type',
    scoreValue: 'score-value',
}

function update(key: string, msg: string | number): void {
    const selector = `.__display [data-${SELECTOR[key]}]`;
    document.querySelector(selector).innerHTML = '' + msg;
}

@Injectable({ name: 'browser.display', singleton: true })
export class BrowserDisplay implements IDisplay {
    element: HTMLElement;
    botState = 'inactive';
    bookMoves: number = 0;
    ponderhits = 0;
    bookClosed = false;

    @Inject('eh') eh: EventHub;

    inject() {
        this.eh.on('bot.move.end', ({move}: {move: Move}) => {
            if (move.score) {
                update('scoreType', move.score.type);
                update('scoreValue', move.score.value);
                this.bookClosed = true;
            } else if (!this.bookClosed) {
                this.bookMoves++;
                update('bookMoves', this.bookMoves);
            } else {
                update('scoreType', 'mate');
                update('scoreValue', '');
            }

            if (move.ponderhit) {
                this.ponderhits++;
                update('ponderhits', this.ponderhits);
            }
        });

        this.eh.on('game.new', (game) => {
            update('color', game.bot === Side.w ? 'White' : 'Black');

            // Reset old values
            this.bookMoves = 0;
            this.ponderhits = 0;
            update('bookMoves', 0);
            update('ponderhits', 0);
            update('scoreType', '');
            update('scoreValue', '');
            this.bookClosed = false;

            this.element.classList.remove('inactive');
            this.element.classList.add('active');
        });

        this.eh.on('game.over', (game) => {
            // update('botState', 'inactive');
            this.element.classList.remove('active');
            this.element.classList.add('inactive');
            update('scoreType', game.winner ? 'mate' : 'draw');
            update('scoreValue', '');

            // this.botState = 'active';
        });

        // this.eh.on('display.toggle', () => {
        //     this.element.classList.remove(this.botState);
        //     this.botState = this.botState === 'active' ? 'inactive' : 'active';

        //     this.eh.trigger(`bot.state.${this.botState}`);
        //     update('botState', this.botState);
        //     this.element.classList.add(this.botState);
        // });

        const display = document.querySelector('.__display');
        display && display.remove(); // Cleanup

        this.element = document.createElement('div');
        this.element.classList.add('__display');
        document.querySelector('body').appendChild(this.element);
        this.element.innerHTML = HTML;
    }
}
