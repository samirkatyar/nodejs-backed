import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY } from '../decorators/metadata.decorator';
import { IToken } from '../interface/jwt';
import { ConfigType } from '@nestjs/config';
import applicationConfig from '../../config/application.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request & {
        user: { id: string; email: string };
      };

      const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) {
        return true;
      }

      const authorizationToken: string = request?.headers[
        'x-access-token'
      ] as string;

      if (!authorizationToken?.length) {
        return false;
      }

      const jwtPayload = this.jwtService.verify(authorizationToken, {
        algorithms: ['RS256'],
        publicKey: this.appConfig.jwtAuthentication.publicKeyToVerifyJWT,
      }) as IToken;

      if (!jwtPayload?.email || !jwtPayload.userId) {
        return false;
      }

      request.user = {
        id: jwtPayload.userId,
        email: jwtPayload.email,
      };
      return true;
    } catch (error) {
      Logger.error(`${error}`);
      return false;
    }
  }
}
