import { Injectable, Inject, DI } from 'di-xxl';
import { IMonitor } from '../../../../models/monitor';
import { getS } from '../../../utils/find';
import { IBrowserSettings } from '../../../../models/browser-settings';
import { Game } from '@scaljeri/chess-shared';
import { IGameState } from '../../../interfaces/game-state';
import { IDomObserver } from '../../../interfaces/dom-observer';

@Injectable({ name: 'browser.context.live.utils.game-start-monitor' })
export class LiveGameStartMonitor implements IMonitor {
  private gameStartObserver: IDomObserver;
  private callback: (game: Game) => void;

  @Inject('settings') settings: IBrowserSettings;

  start(cb: (game: Game) => void): IMonitor {
    this.callback = cb;

    this.stop();
    if (this.isGameStarted) {
      this.gameStarted();
    } else {
      this.monitorGameStart();
    }

    return this;
  }

  gameStarted(): void {
    const game = DI.get<IGameState>('game.state')
      .update()
      .get();
    this.callback(game);
  }

  monitorGameStart(): void {
    getS('.vertical-move-list-component').innerHTML = '';
    this.gameStartObserver = DI.get<IDomObserver>('dom.observer').observe(
      '.sidebar-component',
      () => {
        const game = DI.get<IGameState>('game.state')
          .update()
          .get();

        if (this.isGameStarted && game.moves.length === 0) {
          this.gameStartObserver.disconnect();

          this.gameStarted();
        }
      },
      {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: false
      },
    );
  }

  get isGameStarted(): boolean {
    const resign = getS(this.settings.RESIGN_BTN);

    return !!resign;
  }

  stop(): void {
    this.gameStartObserver && this.gameStartObserver.disconnect();
  }

  resume(): void {
    this.start(this.callback);
  }
}
