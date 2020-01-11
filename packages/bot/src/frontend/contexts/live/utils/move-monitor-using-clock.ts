import { Injectable, Inject, DI } from 'di-xxl';

import { IDomObserver } from '../../../interfaces/dom-observer';

import { EventHub } from 'eventhub-xxl';

import { IBrowserSettings } from '../../../../models/browser-settings';

import { Side, Game } from '@scaljeri/chess-shared';

import { IGameState } from '../../../interfaces/game-state';
import { getS } from '../../../utils/find';
import { IMonitor } from '../../../../models/monitor';
import { Heartbeat } from '../../../heartbeat';

@Injectable({ name: 'live.monitor.move-using-clock' })
export class LiveMoveMonitorClock implements IMonitor {
  private gameMoveObserver: IDomObserver;
  private gameState: IGameState;
  private callback: (game: Game, isTurn: boolean) => void;
  private selector: string;
  private lastState = false;
  private heartbeatId: number;

  @Inject('eh') private eh: EventHub;
  @Inject('settings') settings: IBrowserSettings;
  @Inject('heartbeat') heartbeat: Heartbeat;

  cleanup = () => {};

  start(cb: (game: Game, isTurn: boolean) => void, selector = this.settings.CLOCK): IMonitor {
    this.callback = cb;
    this.selector = selector;
    this.stop();

    this.eh.on('game.over', () => {
      this.setupHeartbeat();
    });

    this.gameState = DI.get<IGameState>('game.state');
    this.setupHeartbeat();

    return this;
  }

  private setupHeartbeat(): void {
    if (this.heartbeatId) {
      this.heartbeat.remove(this.heartbeatId);
    }

    this.heartbeatId = this.heartbeat.add(() => {
      if (this.gameMoveObserver) {
        this.gameMoveObserver.disconnect();
      }
      this.monitorMoves();
      this.triggerMove();
    });
  }

  monitorMoves(): void {
    this.gameMoveObserver = DI.get<IDomObserver>('dom.observer').observe(
      this.selector,
      el => {
        this.triggerMove();
      },
      {
        attributes: true,
        subtree: false,
        childList: false,
        attributeFilter: ['class'],
      },
    );
  }

  triggerMove(): void {
    setTimeout(() => {
      const botTurn = !!getS(this.selector + this.settings.CLOCK_ACTIVE);
      if (botTurn !== this.lastState) {
        this.heartbeat.remove(this.heartbeatId);
        this.lastState = botTurn;

        const game = this.gameState.update().get();
        this.callback(game, botTurn);
      }
    });
  }

  stop(): void {
    this.gameMoveObserver && this.gameMoveObserver.disconnect();
  }

  resume(): void {
    this.start(this.callback);
  }
}
