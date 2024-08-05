import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `[REQ] ${req.method} ${req.url} ${new Date().toLocaleString('kr')}`,
    );

    // NextFunction을 실행하지 않으면 요청이 멈춰버림
    next();
  }
}
