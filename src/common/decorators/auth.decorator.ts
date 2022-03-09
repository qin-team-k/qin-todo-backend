import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUid = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.uid;
  },
);
