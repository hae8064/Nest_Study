import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entity/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
import { ChatsModel } from 'src/chats/entity/chats-entity';
import { MessagesModel } from 'src/chats/messages/entity/message.entity';
import { CommentsModel } from 'src/posts/comments/entity/comments.entity';

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
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  //   1) 유일무이한 값이 돼야 함
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  /**
   * REQUEST
   * fe -> be
   * plain object (JSON) -> Class instance (dto)
   *
   * RESPONSE
   * be -> fe
   * class  instance (dto) -> plain object (JSON)
   *
   * toClassOnly -> class Instance 변환할 때만
   * toPlainOnly -> plain object로 변호ㅓㅏㄴ할 떄만
   */
  // exclude는 password를 삭제 해줌
  @Exclude({
    // 보내는 응답에서만 삭제 해 주고
    toPlainOnly: true,

    // 받는 요청에서만 삭제를 시켜줌
    // toClassOnly: true,
  })
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

  // manytomany같은 건 중간에 연결 시켜주는 테이블을 하나 더 만들면서 JoinTable 어노테이션이 필요 함
  // 2개의 모델 중 하나만 어노테이션 연결 해 주면 됨
  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel;

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];
}
