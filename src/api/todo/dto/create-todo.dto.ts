import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  // FIXME カスタムバリデーション追加
  status: 'TODAY' | 'TOMORROW' | 'NEXT';

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;
}
