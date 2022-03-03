import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  avatarUrl: string;
}
