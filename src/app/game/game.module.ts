import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { HttpModule } from '../../common/http';

@Module({
  imports: [HttpModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
