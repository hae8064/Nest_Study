import { IsString } from 'class-validator';

// 실제로 검증 받고 싶은 값들을 넣어주면 됨
export class CreatePostDto {
  @IsString({
    message: 'title은 string 타입을 입력 해줘야합니다.',
  })
  title: string;

  @IsString({
    message: 'content는 string 타입을 입력 해줘야합니다.',
  })
  content: string;
}
