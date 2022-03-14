import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAvatarImage = createParamDecorator(
  (_data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.avatarImage;
  },
);
