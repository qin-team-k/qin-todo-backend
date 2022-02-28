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

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  findAll() {
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
    return this.todoService.findAll(userId);
  }

  // Todo作成
  @Version('1')
  @Post()
  create(@Body() body: Prisma.TodoCreateInput) {
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
    return this.todoService.create(userId, body);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(@Param('todoId', ParseIntPipe) todoId: number) {
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
    return this.todoService.duplicate(userId, todoId);
  }

  // 完了・未完了の切り替え
  @Version('1')
  @Put(':todoId/toggle')
  toggleDone(@Param('todoId', ParseIntPipe) todoId: number) {
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
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
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
    return this.todoService.updateOrder(userId, todoId, body, index);
  }

  // Todo内容更新
  @Version('1')
  @Put(':todoId')
  updateContent(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() body: Prisma.TodoCreateInput,
  ) {
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
    return this.todoService.updateContent(todoId, body);
  }

  // Todo削除
  @Version('1')
  @Delete(':todoId')
  delete(@Param('todoId', ParseIntPipe) todoId: number) {
    const userId = 'e76db267-066e-4e33-869c-508e41bb1a7d';
    return this.todoService.delete(userId, todoId);
  }
}
