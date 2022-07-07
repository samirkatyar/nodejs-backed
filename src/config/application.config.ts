import { registerAs } from '@nestjs/config';

export const applicationConfig = registerAs('ENV_VARIABLES', () => ({
  postgres: {
    url: process.env.POSTGRES_DB_URL,
  },
  jwtSecret: {
    secretToken: process.env.JWT_SECRET_TOKEN,
  },
}));

export default applicationConfig;
