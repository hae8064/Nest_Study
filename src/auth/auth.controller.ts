import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);
    /**
     * 아래와 같은 형태로 반환을 원함
     * {accessToken: {token}}
     */

    return {
      accessToken: newToken,
    };
  }
  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    //토큰은 bearer토큰이므로 param 두번째에 true로 변환
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);
    /**
     * 아래와 같은 형태로 반환을 원함
     * {accessToken: {token}}
     */

    return {
      refreshToken: newToken,
    };
  }

  @Post('login/email')
  postLoginEmail(@Headers('authorization') rawToken: string) {
    // email:password 값이 -> base64로 인코딩 되어있음
    // ex) dsadasdas:dsafsfas 이러한 형태로 인코딩 되어 있음
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  // Pipe에서 통과 안되면 그 이후 로직이 동작 안함
  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password', PasswordPipe) password: string,
  ) {
    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    });
  }
}
