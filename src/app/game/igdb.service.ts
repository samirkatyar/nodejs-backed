import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import applicationConfig from '../../config/application.config';
import { IgdbGame } from './dto/igdb-game';
import { HttpService } from '../../common/http';
import { GAME_FIELD } from '../../common/consts/igdb.const';

@Injectable()
export class IgdbService {
  private authToken: string;
  private authTokenExpiryDate: Date;
  private readonly logger = new Logger(IgdbService.name);
  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
    private httpService: HttpService,
  ) {}

  private updateExpireOfToken(tokenExpirySeconds: number): void {
    const currentDate = new Date();
    const secondsToAddToDate = tokenExpirySeconds - 100;
    currentDate.setSeconds(currentDate.getSeconds() + secondsToAddToDate);
    this.authTokenExpiryDate = currentDate;
  }

  private isAuthTokenExpired(): boolean {
    if (!this.authTokenExpiryDate || !this.authToken) {
      return true;
    }

    const currentDate = new Date();
    return currentDate >= this.authTokenExpiryDate;
  }

  private async checkTokenExpiry() {
    try {
      const shouldUpdateToken = this.isAuthTokenExpired();
      if (!shouldUpdateToken) {
        return this.authToken;
      }

      const oauthURL = `${this.appConfig.igDbSecret.oauthURL}client_id=${this.appConfig.igDbSecret.appClientId}&client_secret=${this.appConfig.igDbSecret.appClientSecret}&grant_type=client_credentials`;

      const response = await this.httpService.post(oauthURL);
      console.log(response);
      this.authToken = response.data.access_token;
      this.updateExpireOfToken(response.data.expires_in);
    } catch (error) {
      this.logger.error(error, `Error in checkToken`);
    }
  }

  /**
   * This method is used to fetch all the games in paginated fashion
   * @param skip The number of games to skip
   * @param limit The number of games to return
   * @param name
   * @param query
   * @returns An array of all the game objects
   */
  async getGamesFromIgDbApis({
    skip,
    limit,
    name,
    query,
  }: {
    skip: number;
    limit: number;
    name?: string;
    query: {
      followers: number;
      rating: number;
      totalRating: number;
    };
  }): Promise<IgdbGame[]> {
    try {
      await this.checkTokenExpiry();
      const url = `${this.appConfig.igDbSecret.baseURL}/games`;
      let data = `fields ${GAME_FIELD}; limit ${limit}; offset ${skip};`;
      if (name) {
        data += ` search "${name}";`;
      }
      let queryString;
      if (
        query?.followers >= 0 ||
        query?.rating >= 0 ||
        query?.totalRating >= 0
      ) {
        queryString = ` where`;
        if (query?.followers >= 0) {
          queryString += ` follows >= ${query.followers} &`;
        }

        if (query?.rating >= 0) {
          queryString += ` rating >= ${query.rating} &`;
        }

        if (query?.totalRating >= 0) {
          queryString += ` total_rating >= ${query.totalRating} &`;
        }
        queryString = queryString.slice(0, -2);
        queryString += ';';
      }
      if (queryString) {
        data += queryString;
      }
      const response = await this.httpService.post(url, data, {
        headers: {
          'Client-ID': this.appConfig.igDbSecret.appClientId,
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(error, `Error in retrieve games`);
    }
    return [];
  }
}
