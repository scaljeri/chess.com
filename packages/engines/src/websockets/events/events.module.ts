import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UCIChessEngineService } from '../../shared/uci-chess-engine';
import { BookService } from '../book-service';

@Module({
  providers: [
    EventsGateway,
    BookService,
    {
      provide: 'CHESS_ENGINE', 
      useFactory: () => {
        return new UCIChessEngineService(process.env.CHESS_ENGINE);
      }
    }
    ],
})
export class EventsModule {}