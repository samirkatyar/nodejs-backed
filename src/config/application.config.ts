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
  logger: {
    pinoHttp: {
      quietReqLogger: true, // turn off the default logging output
      level: 'debug',
      transport: {
        target: 'pino-pretty', // use the pino-http-print transport and its formatting output
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        },
      },
    },
  },

  igDbSecret: {
    baseURL: process.env.IGDB_API_BASE_URL,
    oauthURL: process.env.OAUTH_TOKEN_URL,
    appClientId: process.env.CLIENT_ID,
    appClientSecret: process.env.CLIENT_SECRET,
  },
}));

export default applicationConfig;
