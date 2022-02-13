import { Controller, Get } from '@nestjs/common';

@Controller()
export class healthCheckController {
  @Get('healthcheck')
  healthCheck(): string {
    return 'OK';
  }
}
