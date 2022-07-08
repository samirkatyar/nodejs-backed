import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUp {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class SingUpResponse {
  @IsString()
  message: string;
}
