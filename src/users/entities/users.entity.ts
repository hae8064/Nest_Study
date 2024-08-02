import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';

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
  @Exclude()
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
