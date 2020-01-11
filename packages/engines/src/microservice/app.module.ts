import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UCIChessEngineService } from '../shared/uci-chess-engine';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: 'CHESS_ENGINE', 
      useFactory: () => {
        return new UCIChessEngineService(process.env.CHESS_ENGINE);
      }
    }
  ]
})
export class AppModule {}
