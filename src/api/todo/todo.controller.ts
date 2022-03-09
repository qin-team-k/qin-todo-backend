import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { GetCurrentFirebaseUid } from 'src/common/decorators/current-firebase-uid.decorator';
import { TodoInterceptor } from 'src/common/interceptors/todo/todo.interceptor';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindAllRes } from './response/findAll.response.';
import { TodoService } from './todo.service';

@Controller('todos')
@UseInterceptors(TodoInterceptor)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  findAll(@GetCurrentFirebaseUid() firebaseUid: string): Promise<FindAllRes> {
    return this.todoService.findAll(firebaseUid);
  }

  // Todo作成
  @Version('1')
  @Post()
  create(
    @Body() todo: CreateTodoDto,
    @GetCurrentFirebaseUid() firebaseUid: string,
  ): Promise<Todo> {
    return this.todoService.create(firebaseUid, todo);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(
    @Param('todoId', ParseIntPipe) todoId: number,
    @GetCurrentFirebaseUid() firebaseUid: string,
  ): Promise<Todo> {
    return this.todoService.duplicate(firebaseUid, todoId);
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
    @GetCurrentFirebaseUid() firebaseUid: string,
  ): Promise<void> {
    return this.todoService.updateOrder(firebaseUid, todoId, todo);
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
    @GetCurrentFirebaseUid() firebaseUid: string,
  ): Promise<void> {
    return this.todoService.delete(firebaseUid, todoId);
  }
}
