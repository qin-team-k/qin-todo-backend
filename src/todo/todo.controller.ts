import { Prisma } from '@prisma/client';
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
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body() body: Prisma.TodoCreateInput) {
    return this.todoService.create(body);
  }

  @Post(':todoId/duplicate')
  duplicate(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.duplicate(todoId);
  }

  @Put(':todoId/toggle')
  toggleDone(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.toggleDone(todoId);
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
  delete(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.delete(todoId);
  }
}
