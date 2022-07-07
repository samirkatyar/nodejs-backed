import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/validation.schema';
import applicationConfig from './config/application.config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [applicationConfig.KEY],
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => ({
        type: 'postgres',
        synchronize: false,
        url: appConfig.postgres.url,
        autoLoadEntities: true,
        ssl: false,
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => ({
        secret: appConfig.jwtSecret.secretToken,
      }),
      inject: [applicationConfig.KEY],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
