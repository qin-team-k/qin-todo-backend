import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { AuthenticatedGuard } from 'src/common/guards/auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoOrderDto } from './dto/update-todo-order.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindAllRes } from './response/findAll.response.';
import { TodoService } from './todo.service';

@Controller('todos')
@UseGuards(AuthenticatedGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  findAll(@Req() req): Promise<FindAllRes> {
    const { id: userId } = req.session.passport.user;
    return this.todoService.findAll(userId);
  }

  // Todo作成
  @Version('1')
  @Post()
  create(@Body() todo: CreateTodoDto, @Req() req): Promise<Todo> {
    const { id: userId } = req.session.passport.user;
    return this.todoService.create(userId, todo);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  duplicate(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Req() req,
  ): Promise<Todo> {
    const { id: userId } = req.session.passport.user;
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
    @Req() req,
  ): Promise<void> {
    const { id: userId } = req.session.passport.user;
    return this.todoService.updateOrder(userId, todoId, todo);
  }

  // Todo内容更新
  @Version('1')
  @Put(':todoId')
  updateContent(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() todo: UpdateTodoDto,
    @Req() req,
  ): Promise<Todo> {
    const { id: userId } = req.session.passport.user;
    return this.todoService.updateContent(todoId, todo);
  }

  // Todo削除
  @Version('1')
  @Delete(':todoId')
  delete(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Req() req,
  ): Promise<void> {
    const { id: userId } = req.session.passport.user;
    return this.todoService.delete(userId, todoId);
  }
}
