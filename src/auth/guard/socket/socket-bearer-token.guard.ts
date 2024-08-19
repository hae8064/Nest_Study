import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SocketBearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //socket을 가져오는 코드
    const socket = context.switchToWs().getClient();

    const headers = socket.handshake.headers;

    // bearer까지 붙어 있는 토큰 = rawToken
    const rawToken = headers['authorization'];

    if (!rawToken) {
      throw new WsException('토큰이 없습니다!');
    }

    try {
      //extractTokenFromHeader함수에서 rawToken을 넣고 두번째 파람으로 true를 넣으면 accessToken을 가져오겠다라는 의미
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      // payload를 가져오는 코드
      const payload = this.authService.verifyToken(token);
      const user = await this.userService.getUserByEmail(payload.email);

      socket.user = user;
      socket.token = token;
      socket.tokenType = payload.tokenType;

      return true;
    } catch (e) {
      throw new WsException('토큰이 유효하지 않습니다.');
    }
  }
}
