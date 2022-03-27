import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;
}
