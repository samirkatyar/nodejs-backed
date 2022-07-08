import { Body, Controller, Post } from '@nestjs/common';
import { SignUp, SingUpResponse } from './dto/sign-up';
import { Login, LoginResponse } from './dto/login';
import { UserService } from './user.service';
import { Public } from '../../common/decorators/metadata.decorator';

@Controller('user')
@Public()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signUpNewUser(@Body() payload: SignUp): Promise<SingUpResponse> {
    return this.userService.signUpUser(payload);
  }

  @Post('login')
  loginUser(@Body() payload: Login): Promise<LoginResponse> {
    return this.userService.login(payload);
  }
}
