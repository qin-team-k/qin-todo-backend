import { Module } from '@nestjs/common';
import { TodoModule } from './api/todo/todo.module';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [TodoModule],
  controllers: [healthCheckController],
})
export class AppModule {}
