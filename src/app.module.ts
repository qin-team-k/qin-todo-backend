import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { TodoModule } from './api/todo/todo.module';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [TodoModule, AuthModule],
  controllers: [healthCheckController],
})
export class AppModule {}
