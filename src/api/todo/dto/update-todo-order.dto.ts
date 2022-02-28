import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTodoOrderDto {
  // FIXME カスタムバリデーション追加
  status: 'TODAY' | 'TOMORROW' | 'NEXT';

  @IsNumber()
  @IsNotEmpty()
  index: number;
}
