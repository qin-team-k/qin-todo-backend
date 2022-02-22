import { Module } from '@nestjs/common';
import { healthCheckController } from './healthCheck.controller';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule],
  controllers: [healthCheckController],
})
export class AppModule {}
