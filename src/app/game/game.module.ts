import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { HttpModule } from '../../common/http';
import { IgdbService } from './igdb.service';

@Module({
  imports: [HttpModule],
  controllers: [GameController],
  providers: [GameService, IgdbService],
})
export class GameModule {}
