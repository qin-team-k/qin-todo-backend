import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(191)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  @MaxLength(255)
  avatarUrl: string;

  @IsString()
  @IsNotEmpty()
  uid: string;
}
