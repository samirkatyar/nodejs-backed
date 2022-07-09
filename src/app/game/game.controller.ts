import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { IgdbService } from './igdb.service';
import { IgdbGame } from './dto/igdb-game';

@Controller('game')
export class GameController {
  constructor(private igdbService: IgdbService) {}

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
    const query = {
      followers,
      rating,
      totalRating,
    };
    return this.igdbService.getGamesFromIgDbApis({ skip, limit, name, query });
  }
}
