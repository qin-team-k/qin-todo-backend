import { Module } from '@nestjs/common';
import { TodoModule } from './api/todo/todo.module';
import { UserModule } from './api/user/user.module';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [TodoModule, UserModule],
  controllers: [healthCheckController],
})
export class AppModule {}
