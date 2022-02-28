import { Todo } from '@prisma/client';
export class FindAllDto {
  'TODAY': Todo[];
  'TOMORROW': Todo[];
  'NEXT': Todo[];
}
