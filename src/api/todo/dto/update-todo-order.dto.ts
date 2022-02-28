import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateTodoOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  status: 'TODAY' | 'TOMORROW' | 'NEXT';

  @IsNumber()
  @IsNotEmpty()
  index: number;
}
