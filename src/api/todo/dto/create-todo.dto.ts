import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';

export class CreateTodoDto {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  // FIXME カスタムバリデーション追加
  @IsNotEmpty()
  status: 'TODAY' | 'TOMORROW' | 'NEXT';

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;
}
