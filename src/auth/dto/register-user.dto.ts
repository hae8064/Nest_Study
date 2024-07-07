import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entities/users.entity';

export class RegisteruserDto extends PickType(UsersModel, [
  'nickname',
  'email',
  'password',
]) {
  nickname: string;

  email: string;
}
