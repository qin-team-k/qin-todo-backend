import { CreateTodoDto } from './dto/todo.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  findAll() {
    return 'find all here';
  }

  create(payload: CreateTodoDto) {
    console.log(payload);
    return 'created here';
  }

  duplicate(todoId: number) {
    return `todo duplicated with ${todoId}`;
  }

  toggleDone() {
    return 'toggled status';
  }

  updateOrder() {
    return 'update order';
  }

  updateContent(todoId: number) {
    return `updated content with ${todoId}`;
  }

  remove(todoId: number) {
    return `deleted todo with ${todoId}`;
  }
}
