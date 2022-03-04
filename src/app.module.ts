import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './api/auth/auth.module';

import { TodoModule } from './api/todo/todo.module';
import { UserModule } from './api/user/user.module';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [
    TodoModule,
    AuthModule,
    UserModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [healthCheckController],
})
export class AppModule {}
