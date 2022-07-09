import { IsNotEmpty, IsString } from 'class-validator';

export class AddFavouriteGame {
  @IsString()
  @IsNotEmpty()
  name: string;
}
