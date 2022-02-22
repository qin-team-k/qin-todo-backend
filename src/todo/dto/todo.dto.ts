import { IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  content: string;

  @IsString()
  status: string;
}
