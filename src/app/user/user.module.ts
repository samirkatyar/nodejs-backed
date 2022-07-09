import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import applicationConfig from '../../config/application.config';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
