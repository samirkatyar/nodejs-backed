import { IsDate, IsString } from 'class-validator';

export class Game {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  gameId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
