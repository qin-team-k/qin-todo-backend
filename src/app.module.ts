import { Module } from '@nestjs/common';
import { healthCheckController } from './healthCheck.controller';

@Module({
  imports: [],
  controllers: [healthCheckController],
  providers: [],
})
export class AppModule {}
