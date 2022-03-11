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
import { GetCurrentUuid } from 'src/common/decorators/current-uuid.decorator';
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
  findAll(@GetCurrentUuid() uuid: string): Promise<FindAllRes> {
    return this.todoService.findAll(uuid);
  }

  // Todo作成
  @Version('1')
  @Post()
  create(
    @Body() todo: CreateTodoDto,
    @GetCurrentUuid() uuid: string,
  ): Promise<Todo> {
    return this.todoService.create(uuid, todo);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(
    @Param('todoId', ParseIntPipe) todoId: number,
    @GetCurrentUuid() uuid: string,
  ): Promise<Todo> {
    return this.todoService.duplicate(uuid, todoId);
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
    @GetCurrentUuid() uuid: string,
  ): Promise<void> {
    return this.todoService.updateOrder(uuid, todoId, todo);
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
    @GetCurrentUuid() uuid: string,
  ): Promise<void> {
    return this.todoService.delete(uuid, todoId);
  }
}
