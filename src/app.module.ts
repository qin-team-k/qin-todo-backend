import { Module } from '@nestjs/common';
import { healthCheckController } from './healthCheck.controller';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TodoModule, UserModule],
  controllers: [healthCheckController],
})
export class AppModule {}
