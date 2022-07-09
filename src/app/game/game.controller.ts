import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { IgdbService } from './igdb.service';
import { IgdbGame } from './dto/igdb-game';
import { IUser } from '../../common/interface/user';
import { AddFavouriteGame } from './dto/add-favourite-game';
import { GameService } from './game.service';
import { GameEntity } from './game.entity';
import { ERROR_CODE } from '../../common/consts/error.const';

@Controller('game')
export class GameController {
  constructor(
    private readonly igdbService: IgdbService,
    private readonly gameService: GameService,
  ) {}

  /**
   * We have two apis for get all game and user input games
   * so here based on api query date we find the games from igdb.
   * @param skip : number
   * @param limit : number
   * @param followers : number
   * @param rating : number
   * @param totalRating : number
   * @param name : string
   */
  @Get('/list')
  getAllGamesPaginated(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('followers') followers?: number,
    @Query('rating') rating?: number,
    @Query('totalRating') totalRating?: number,
    @Query('name') name?: string,
  ): Promise<IgdbGame[]> {
    if (
      (followers && isNaN(parseInt(followers?.toString(), 10))) ||
      (rating && isNaN(parseInt(rating?.toString(), 10))) ||
      (totalRating && isNaN(parseInt(totalRating?.toString(), 10)))
    ) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.BAD_REQUEST,
        message: 'Invalid Input',
      });
    }
    const query = {
      followers,
      rating,
      totalRating,
    };
    return this.igdbService.getGamesFromIgDbApis({ skip, limit, name, query });
  }

  @Put('addToFavorites')
  addFavouriteGame(
    @Req() request: Request & IUser,
    @Body() payload: AddFavouriteGame,
  ): Promise<IgdbGame> {
    const userId = request.user.id;
    return this.gameService.addFavouriteGame({ payload, userId });
  }

  @Get('my-games')
  listAllFavouriteGames(
    @Req() request: Request & { user: { id: string; email: string } },
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<GameEntity[]> {
    const userId = request.user.id;
    return this.gameService.listAllFavouriteGames({ userId, skip, limit });
  }
}
