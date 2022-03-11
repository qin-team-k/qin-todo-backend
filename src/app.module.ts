import { Module } from '@nestjs/common';
import { UserModule } from './api/auth/user.module';
import { TodoModule } from './api/todo/todo.module';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [TodoModule, UserModule],
  controllers: [healthCheckController],
})
export class AppModule {}
