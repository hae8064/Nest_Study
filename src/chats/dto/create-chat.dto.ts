import { IsNumber } from 'class-validator';

export class CreateChatDto {
  // each는 배열 내 각각의 요소가 숫자인지 체크
  @IsNumber({}, { each: true })
  userIds: number[];
}
