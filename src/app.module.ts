import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';

import { TodoModule } from './api/todo/todo.module';
import { UserModule } from './api/user/user.module';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [TodoModule, AuthModule, UserModule],
  controllers: [healthCheckController],
})
export class AppModule {}
