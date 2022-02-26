import { Prisma, TodoStatus } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Version,
} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  // Todo作成
  @Version('1')
  @Post()
  create(@Body() body: Prisma.TodoCreateInput) {
    return this.todoService.create(body);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.duplicate(todoId);
  }

  // 完了・未完了の切り替え
  @Version('1')
  @Put(':todoId/toggle')
  toggleDone(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.toggleDone(todoId);
  }

  // Todo並び替え
  @Version('1')
  @Put(':todoId/:index/order')
  updateOrder(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() body: Prisma.TodoCreateInput,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.todoService.updateOrder(todoId, body, index);
  }

  // Todo内容更新
  @Version('1')
  @Put(':todoId')
  updateContent(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() body: Prisma.TodoCreateInput,
  ) {
    return this.todoService.updateContent(todoId, body);
  }

  // Todo削除
  @Version('1')
  @Delete(':todoId')
  delete(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.delete(todoId);
  }
}
