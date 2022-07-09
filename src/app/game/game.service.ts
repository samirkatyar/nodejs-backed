import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IgdbService } from './igdb.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from './game.entity';
import { IgdbGame } from './dto/igdb-game';
import { AddFavouriteGame } from './dto/add-favourite-game';
import { UserService } from '../user/user.service';
import { Game } from './dto/game';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(GameEntity) private gameRepo: Repository<GameEntity>,
    private readonly igdbService: IgdbService,
    private userService: UserService,
  ) {}

  /**
   * This method will add favourite game from IGDB to backend DB
   * @param payload AddFavouriteGameDTO
   * @returns Game from IGDB added to backend DB
   */
  async addFavouriteGame({
    payload,
    userId,
  }: {
    payload: AddFavouriteGame;
    userId: string;
  }): Promise<IgdbGame> {
    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized to perform this operation',
      });
    }

    const game = await this.igdbService.getGamesFromIgDbApis({
      name: payload.name,
      skip: 0,
      query: null,
      limit: 1,
    });

    if (!game?.length) {
      throw new BadRequestException({
        message: 'Game with that name not found!',
      });
    }

    try {
      const gameEntity = this.gameRepo.create({
        gameId: game[0].id,
        name: payload.name,
        user,
      });
      await this.gameRepo.save(gameEntity);
      return game[0];
    } catch (error) {
      if (error?.code === '23505') {
        throw new BadRequestException({
          message: 'Game already exist in your favourites!',
        });
      }

      this.logger.error(
        error,
        'Something gone wrong while adding game to favourites',
      );

      throw new InternalServerErrorException({
        message: 'Something gone wrong while adding game to favourites',
      });
    }
  }

  async listAllFavouriteGames({
    userId,
    skip,
    limit,
  }: {
    userId: string;
    skip: number;
    limit: number;
  }): Promise<GameEntity[]> {
    return this.gameRepo.find({ where: { user: userId }, take: limit, skip });
  }
}
