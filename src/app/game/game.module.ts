import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { HttpModule } from '../../common/http';
import { IgdbService } from './igdb.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([GameEntity]), UserModule],
  controllers: [GameController],
  providers: [GameService, IgdbService],
})
export class GameModule {}
