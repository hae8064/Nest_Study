import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../const/roles.const';

export const ROLES_KEY = 'user_roles';

// @Roles(RolesEnum.ADMIN) 이런식으로 사용하면 ADMIN 사용자가 아니면 사용 불가능하게 해줌
// metadata셋팅할때 키값을 넣어주고 키값에 해당하는 value를 넣어주면 됨
export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);
