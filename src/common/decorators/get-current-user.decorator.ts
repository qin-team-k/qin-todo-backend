import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!data) return request.user;
    return request.user[data];
  },
);

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const GetCurrentUser = createParamDecorator(
//   (data: string, ctx: ExecutionContext) => {
//     const user = ctx.switchToHttp().getRequest().user;
//     console.log(user);

//     if (!user) {
//       return null;
//     }

//     return data ? user[data] : user; // extract a specific property only if specified or get a user object
//   },
// );
