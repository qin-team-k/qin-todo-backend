import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { GetCurrentUserId } from 'src/common/decorators/current-userId.decorator';
import { AuthenticateGuard } from 'src/common/guards/authenticate';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindAllRes } from './response/findAll.response.';
import { TodoService } from './todo.service';

@Controller('todos')
@UseGuards(AuthenticateGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  findAll(@GetCurrentUserId() userId: string): Promise<FindAllRes> {
    return this.todoService.findAll(userId);
  }

  // Todo作成
  @Version('1')
  @Post()
  create(
    @Body() todo: CreateTodoDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Todo> {
    return this.todoService.create(userId, todo);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(
    @Param('todoId', ParseIntPipe) todoId: number,
    @GetCurrentUserId() userId: string,
  ): Promise<Todo> {
    return this.todoService.duplicate(userId, todoId);
  }

  // 完了・未完了の切り替え
  @Version('1')
  @Put(':todoId/toggle')
  toggleDone(@Param('todoId', ParseIntPipe) todoId: number): Promise<Todo> {
    return this.todoService.toggleDone(todoId);
  }

  // Todo並び替え
  @Version('1')
  @Put(':todoId/order')
  updateOrder(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() todo: UpdateTodoOrderDto,
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    return this.todoService.updateOrder(userId, todoId, todo);
  }

  // Todo内容更新
  @Version('1')
  @Put(':todoId')
  updateContent(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() todo: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.updateContent(todoId, todo);
  }

  // Todo削除
  @Version('1')
  @Delete(':todoId')
  delete(
    @Param('todoId', ParseIntPipe) todoId: number,
    @GetCurrentUserId() uuid: string,
  ): Promise<void> {
    return this.todoService.delete(uuid, todoId);
  }
}
