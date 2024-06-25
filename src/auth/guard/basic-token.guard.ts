import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * 구현할 기능
 *
 * 1. 요청 객체(Request)를 불러오고
 * authrization header로부터 토큰을 가져온다.
 *
 * 2. authService.extractTokenFromHeader를 이용해서 사용할 수 있는 형태의 토큰을 추출한다.
 *
 * 3. authService.decodeBasictoken을 실행해서 email과 Password를 추출한다.
 *
 * 4. email과 passsword를 이용해서 사용자를 가져온다.
 * -> authService.authenticateWithEmailAndPassword 함수 사용
 *
 * 5. 찾아낸 사용자를 1. 요청 객체에 붙여준다.
 */

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // {authorization: 'Basic asdadsadas'}
    // asdadsadas가져와야 함
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const { email, password } = this.authService.decodeBasicToken(token);

    const user = await this.authService.authentocateWithEmailAndPassword({
      email,
      password,
    });

    req.user = user;

    return true;
  }
}
