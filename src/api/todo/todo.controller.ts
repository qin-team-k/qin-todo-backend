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
  Version,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { USER_2 } from 'src/constant';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  findAll() {
    return this.todoService.findAll(USER_2);
  }

  // Todo作成
  @Version('1')
  @Post()
  create(@Body() body: Prisma.TodoCreateInput) {
    return this.todoService.create(USER_2, body);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.duplicate(USER_2, todoId);
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
    return this.todoService.updateOrder(USER_2, todoId, body, index);
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
    return this.todoService.delete(USER_2, todoId);
  }
}
