import { registerAs } from '@nestjs/config';

export const applicationConfig = registerAs('ENV_VARIABLES', () => ({
  postgres: {
    url: process.env.POSTGRES_DB_URL,
  },
  jwtAuthentication: {
    privateKeyToSignJWT: Buffer.from(
      process.env.PRIVATE_KEY,
      'base64',
    ).toString('utf8'),
    publicKeyToVerifyJWT: Buffer.from(
      process.env.PUBLIC_KEY,
      'base64',
    ).toString('utf8'),
    signOptions: {
      expiresIn: '3d',
      algorithm: 'RS256',
    },
  },
}));

export default applicationConfig;
