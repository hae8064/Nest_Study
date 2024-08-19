import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    // socket을 가져오는 방법 getClient사용
    const socket = host.switchToWs().getClient();

    // error를 다면
    socket.emit('exception', { data: exception.getResponse() });
  }
}
