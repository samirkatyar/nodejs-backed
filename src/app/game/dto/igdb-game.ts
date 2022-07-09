import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class BaseClass {
  @IsNumber()
  id: number;
}

export class Collection extends BaseClass {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  url: string;
}

export class Cover extends BaseClass {
  @IsString()
  url: string;
}

export class Franchise extends BaseClass {
  @IsString()
  slug: string;

  @IsString()
  url: string;
}

export class GameEngine extends BaseClass {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  url: string;
}

export class GameMode extends BaseClass {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  url: string;
}

export class Genere extends BaseClass {
  @IsString()
  name: string;

  @IsString()
  url: string;
}

export class Platform extends BaseClass {
  @IsString()
  name: string;

  @IsString()
  url: string;
}

export class ReleaseDate extends BaseClass {
  @IsString()
  human: string;
}

export class Screenshot extends BaseClass {
  @IsString()
  url: string;
}

export class IgdbGame extends BaseClass {
  @IsArray()
  alternative_names: [{ id: string; name: string }];

  @IsNumber()
  category: number;

  @IsObject()
  collection: Collection;

  @IsObject()
  cover: Cover;

  @IsNumber()
  created_at: number;

  @IsNumber()
  first_release_date: number;

  @IsNumber()
  follows: number;

  @IsObject()
  franchise: Franchise;

  @IsArray()
  game_engines: GameEngine[];

  @IsArray()
  game_modes: GameMode[];

  @IsArray()
  generes: Genere[];

  @IsNumber()
  hypes: number;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsArray()
  platforms: Platform[];

  @IsNumber()
  rating: number;

  @IsNumber()
  rating_count: number;

  @IsArray()
  release_dates: ReleaseDate[];

  @IsArray()
  screenshots: Screenshot[];

  @IsNumber()
  status: number;

  @IsArray()
  websites: [{ id: string; url: string }];

  @IsString()
  storyline: string;

  @IsString()
  summary: string;

  @IsNumber()
  total_rating: number;

  @IsNumber()
  total_rating_count: number;

  @IsString()
  url: string;

  @IsString()
  version_title: string;

  @IsArray()
  videos: [{ id: string; video_id: string; name: string }];
}
