import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // JWTService를 가져온다. - auth.module 내 imports로 Jwtmodule을 안가져오면 오류 나옴
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /*
    우리가 만드려는 기능
    1. registerWithEmail 함수
        - email, nickname, password를 입력받고 사용자를 생성한다
        - 생성 완료 시 accessToken과 refesthToken을 반환한다.
            회원가입 후 다시 로그인 해 주세요 -> 이런 쓸데 없는 과정을 방지하기 위해

    2. loginWithEmail
        - email, password를 입력 시 사용자 검증을 진행
        - 검증이 완료되면 accessToken과 refesthToken을 반환한다.

    3. loginUser
        - 1과 2에서 필요한 accesToken과 refreshToken을 반환하는 로직

    4. signToken -> 토큰을 생성하는 부분
        - 3에서 필요한 accessToken과 refreshToken을 sign 하는 로직

    5. authenticateWithEmailAndPassword
        - 2에서 로그인을 진행할 때 필요한 기본적인 검증 진행
        1) 사용자가 존재하는지 확인 (Email 기반)
        2) 비밀번호가 맞는지 확인
        3) 모두 통과되면 찾은 사용자 정보 반환
        4) loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
    */

  /**
   * Payload에 들어갈 정보
   * 1) Email
   * 2) sub -> id (사용자의 Id)
   * 3) Type: 'accessToken'  | 'refreshToken'
   *
   * 1,2번은 사용자의 정보이다.
   *  param으로  UsersModel을 불러오는데, 현재 UsersModel 내 모든 프로퍼티를 가져올 필욘 없음
   * email, id값만 가져오면 돼서 PICK을 사용한다. 타입스크립트 문법
   *
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    // sign 내 첫번째 param으로는 payload
    // 두번째 param으로는 옵션이 들어가야 한다.
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      // 만료 기간 - 초단위
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  //   아래 param에 password는 해시된 password값임
  async authentocateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    // 사용자가 존재하는지 확인 (email)
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      // UnauthorizedException 인증을 통과하지 못했을 때 뱉어주는 에러
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // 비밀번호가 맞는지 확인
    /**
     * bcrypt.compare에 parameter 들어가는 정보
     * 1. 입력된 비밀번호
     * 2. 기존 해시 -> 사용자 정보에 저장돼있는 hash
     */
    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authentocateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    // 실제 비밀번호(user.password)를 hash 처리 한다
    // 비밀번호를 몇번 해시 할지 HASH_ROUNDS
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser(user);

    return this.loginUser(newUser);
  }
}
