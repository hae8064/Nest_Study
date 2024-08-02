import { PickType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator';
import { UsersModel } from 'src/users/entities/users.entity';

export class RegisteruserDto extends PickType(UsersModel, [
  'nickname',
  'email',
  'password',
]) {
  @IsString()
  nickname: string;

  @IsString()
  @Length(3, 8, { message: 'password은 3 ~ 8글자를 입력 해 주세요' })
  password: string;

  @IsString()
  email: string;
}
