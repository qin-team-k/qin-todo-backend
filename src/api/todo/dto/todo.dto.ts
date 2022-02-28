import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  status: string;
}
