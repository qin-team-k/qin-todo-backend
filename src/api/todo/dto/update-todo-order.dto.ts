import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTodoOrderDto {
  @IsEnum(['TODAY', 'TOMORROW', 'NEXT'])
  status: 'TODAY' | 'TOMORROW' | 'NEXT';

  @IsNumber()
  @IsNotEmpty()
  index: number;
}
