import { TodoStatus } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, IsEnum } from 'class-validator';

export class CreateTodoDto {
  @IsEnum(TodoStatus)
  status: TodoStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;
}
