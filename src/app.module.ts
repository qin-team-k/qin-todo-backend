import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './api/auth/auth.module';
import { TodoModule } from './api/todo/todo.module';
import { AccessTokenGuard } from './common/guards';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [TodoModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
  controllers: [healthCheckController],
})
export class AppModule {}
