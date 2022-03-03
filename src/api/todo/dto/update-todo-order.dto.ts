import { TodoStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTodoOrderDto {
  @IsEnum(TodoStatus)
  status: TodoStatus;

  @IsNumber()
  @IsNotEmpty()
  index: number;
}
