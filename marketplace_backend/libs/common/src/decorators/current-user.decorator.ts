import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'apps/auth/src/users/models/user.entity';

interface RequestWithUser {
  user: User;
}

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest<RequestWithUser>().user;
};

export const currentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
