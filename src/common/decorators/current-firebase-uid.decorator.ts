import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentFirebaseUid = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.uid;
  },
);
