import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body() body: CreateTodoDto) {
    return this.todoService.create(body);
  }

  @Post(':todoId/duplicate')
  duplicate(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.duplicate(todoId);
  }

  @Put('toggle')
  toggleDone() {
    return this.todoService.toggleDone();
  }

  @Put('order')
  updateOrder() {
    return this.todoService.updateOrder();
  }

  @Put(':todoId')
  updateContent(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.updateContent(todoId);
  }

  @Delete(':todoId')
  remove(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.remove(todoId);
  }
}
