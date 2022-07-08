import { object, string } from 'joi';

export const envValidationSchema = object({
  POSTGRES_DB_URL: string().default('postgres://localhost:5432'),

  PRIVATE_KEY: string().required(),
  PUBLIC_KEY: string().required(),
});
