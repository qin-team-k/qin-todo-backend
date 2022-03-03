import { Todo } from '@prisma/client';
export class FindAllRes {
  'TODAY': Todo[];
  'TOMORROW': Todo[];
  'NEXT': Todo[];
}
