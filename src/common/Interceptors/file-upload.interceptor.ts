import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const isMultipart = request.isMultipart();
    if (!isMultipart) {
      throw new BadRequestException('multipart/form-data expected.');
    }

    const file = await request.file();

    if (!file) throw new BadRequestException('file expected');
    request['avatarImage'] = file;

    return next.handle();
  }
}
