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

  // Todo一覧取得
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  // Todo作成
  @Post()
  create(@Body() body: Prisma.TodoCreateInput) {
    return this.todoService.create(body);
  }

  // Todo複製
  @Post(':todoId/duplicate')
  duplicate(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.duplicate(todoId);
  }

  // 完了・未完了の切り替え
  @Put(':todoId/toggle')
  toggleDone(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.toggleDone(todoId);
  }

  // Todo並び替え
  @Put(':todoId/order')
  updateOrder(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.updateOrder(todoId);
  }

  // Todo内容更新
  @Put(':todoId')
  updateContent(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() body: Prisma.TodoCreateInput,
  ) {
    return this.todoService.updateContent(todoId, body);
  }

  // Todo削除
  @Delete(':todoId/:userId')
  delete(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.delete(todoId);
  }
}
