import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenUser } from '../../modules/auth/dto/authen-user.dto';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthenUser = request.user;
    return data ? user?.[data] : user;
  },
);
