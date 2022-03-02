import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  id?: number;
  // FIXME カスタムバリデーション追加
  status: 'TODAY' | 'TOMORROW' | 'NEXT';
  done?: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}
