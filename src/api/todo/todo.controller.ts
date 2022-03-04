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
  Res,
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
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Todo一覧取得
  @Version('1')
  @Get()
  @UseGuards(AuthenticatedGuard)
  findAll(@Req() req, @Res() res): Promise<FindAllRes> {
    console.log(req.session.passport.user);
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.findAll(userId);
  }

  // Todo作成
  @Version('1')
  @Post()
  @UseGuards(AuthenticatedGuard)
  create(@Body() todo: CreateTodoDto): Promise<Todo> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.create(userId, todo);
  }

  // Todo複製
  @Version('1')
  @Post(':todoId/duplicate')
  @UseGuards(AuthenticatedGuard)
  duplicate(@Param('todoId', ParseIntPipe) todoId: number): Promise<Todo> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.duplicate(userId, todoId);
  }

  // 完了・未完了の切り替え
  @Version('1')
  @Put(':todoId/toggle')
  @UseGuards(AuthenticatedGuard)
  toggleDone(@Param('todoId', ParseIntPipe) todoId: number): Promise<Todo> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.toggleDone(todoId);
  }

  // Todo並び替え
  @Version('1')
  @Put(':todoId/order')
  @UseGuards(AuthenticatedGuard)
  updateOrder(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() todo: UpdateTodoOrderDto,
  ): Promise<void> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.updateOrder(userId, todoId, todo);
  }

  // Todo内容更新
  @Version('1')
  @Put(':todoId')
  @UseGuards(AuthenticatedGuard)
  updateContent(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() todo: UpdateTodoDto,
  ): Promise<Todo> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.updateContent(todoId, todo);
  }

  // Todo削除
  @Version('1')
  @Delete(':todoId')
  @UseGuards(AuthenticatedGuard)
  delete(@Param('todoId', ParseIntPipe) todoId: number): Promise<void> {
    const userId = '4ff64eb1-c22a-4455-a50d-75cdc3c1e561';
    return this.todoService.delete(userId, todoId);
  }
}
