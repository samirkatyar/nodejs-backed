import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/validation.schema';
import applicationConfig from './config/application.config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { UserModule } from './app/user/user.module';

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
      inject: [applicationConfig.KEY],
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => {
        return {
          privateKey: appConfig.jwtAuthentication.privateKeyToSignJWT,
          publicKey: appConfig.jwtAuthentication.publicKeyToVerifyJWT,
          signOptions: appConfig.jwtAuthentication.signOptions,
        } as JwtModuleOptions;
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_PIPE', useClass: ValidationPipe }],
})
export class AppModule {}
