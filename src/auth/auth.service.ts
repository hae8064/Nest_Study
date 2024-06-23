import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
}
