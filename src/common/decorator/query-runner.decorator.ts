import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (date, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.queryRunner) {
      throw new InternalServerErrorException(
        `QueryRunner Decorator를 사용하려면 TransactionInterceptor를 적용해야 한다.`,
      );
    }

    return req.queryRunner;
  },
);
