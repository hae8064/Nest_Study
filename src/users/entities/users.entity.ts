import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, length, Length, min } from 'class-validator';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    // 1) 원하는 최댓값을 넣어주면 됨
    length: 20,
    // 2) 유일무이한 값 -> false로 하면 중복 값 들어갈 수 있음
    unique: true,
  })
  //   1) 길이가 20을 넘지 않을 것
  //   2) 유일무이한 값이 될 것
  @IsString()
  @Length(1, 20, {
    message: '닉네임은 1~20자 사이로 입력해주세요.',
  })
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  //   1) 유일무이한 값이 돼야 함
  email: string;

  @Column()
  @IsString()
  password: string;

  //   role에는 기본 값을 지정해줄거임
  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  //   user가 작성한 모든 post들 가지고 있어야 함
  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
