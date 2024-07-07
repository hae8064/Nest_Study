import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  // 1) UsersModel과 연동한다. -> Foreign key를 이용해서
  // 2) null이 될 수 없다.
  //현재 postModel은 many과 user model은 one이라는 의미
  // Test
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: 'title은 string 타입을 입력 해줘야합니다.',
  })
  title: string;

  @Column()
  @IsString({
    message: 'content는 string 타입을 입력 해줘야합니다.',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
