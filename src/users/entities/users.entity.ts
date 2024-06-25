import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';

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
  nickname: string;

  @Column({
    unique: true,
  })
  //   1) 유일무이한 값이 돼야 함
  email: string;

  @Column()
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
