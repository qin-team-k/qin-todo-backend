import { Module } from '@nestjs/common';
import { healthCheckController } from './healthCheck.controller';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';

@Module({
  imports: [],
  controllers: [healthCheckController, TodoController],
  providers: [TodoService],
})
export class AppModule {}
