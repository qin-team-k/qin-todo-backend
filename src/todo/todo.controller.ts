import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get()
  findAll() {
    return 'find all';
  }

  @Post()
  create(@Body() body: any) {
    console.log(body);

    return 'created';
  }

  @Post(':todoId/duplicate')
  duplicate(@Param('todoId') todoId: string) {
    return `todo duplicated with ${todoId}`;
  }

  @Put('toggle')
  toggleDone() {
    return 'toggled status';
  }

  @Put('order')
  updateOrder() {
    return 'update order';
  }

  @Put(':todoId')
  updateContent(@Param('todoId') todoId: string) {
    return `updated content with ${todoId}`;
  }

  @Delete(':todoId')
  remove(@Param('todoId') todoId: string) {
    return `deleted todo with ${todoId}`;
  }
}
