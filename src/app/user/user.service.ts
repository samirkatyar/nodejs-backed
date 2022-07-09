import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';
import applicationConfig from '../../config/application.config';
import { Login, LoginResponse } from './dto/login';
import { UserEntity } from './user.entity';
import { IToken } from '../../common/interface/jwt';
import { ERROR_CODE, ERROR_MESSAGE } from '../../common/consts/error.const';
import { Algorithm } from 'jsonwebtoken';
import { SignUp, SingUpResponse } from './dto/sign-up';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
    private jwtService: JwtService,
  ) {}

  /**
   * Signup user in system
   * @param payload
   */
  async signUpUser(payload: SignUp): Promise<SingUpResponse> {
    const user = await this.userRepository.findOne({
      where: { email: payload?.email },
    });
    if (user?.email) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.BAD_REQUEST,
        message: 'User is already created',
      });
    }

    try {
      payload.password = await bcrypt.hash(payload.password, 12);
      await this.userRepository.save(this.userRepository.create(payload));

      return {
        message: 'You have registered successfully.',
      };
    } catch (error) {
      Logger.error(`${error}`);
      throw new InternalServerErrorException({
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Login user with email and password
   * @param payload LoginUserDTO
   * @returns User object with JWT token
   */
  async login(payload: Login): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: payload?.email },
    });

    if (!user) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.UNAUTHORIZED,
        message: 'Invalid email or password',
      });
    }

    const passwordMatched = await bcrypt
      .compare(payload.password, user.password)
      .catch(() => null);

    if (!passwordMatched) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.UNAUTHORIZED,
        message: 'Invalid email or password',
      });
    }

    try {
      if (passwordMatched) {
        const jwtPayload: IToken = { userId: user.id, email: user.email };
        const token = await this.jwtService.signAsync(jwtPayload, {
          privateKey: this.appConfig.jwtAuthentication.privateKeyToSignJWT,
          algorithm: this.appConfig.jwtAuthentication.signOptions
            .algorithm as Algorithm,
          expiresIn: this.appConfig.jwtAuthentication.signOptions.expiresIn,
        });
        return {
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          token,
        };
      }
    } catch (error) {
      Logger.error(`${error}`);
      throw new InternalServerErrorException({
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(query: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(query);
  }
}
