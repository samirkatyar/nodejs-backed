import { object, string } from 'joi';

export const envValidationSchema = object({
  POSTGRES_DB_URL: string().default('postgres://localhost:5432'),

  PRIVATE_KEY: string().required(),
  PUBLIC_KEY: string().required(),

  IGDB_API_BASE_URL: string().default('https://api.igdb.com/v4'),
  OAUTH_TOKEN_URL: string().default(
    'https://id.twitch.tv/oauth2/token',
  ),
  CLIENT_ID: string().required(),
  CLIENT_SECRET: string().required(),
});
