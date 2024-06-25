import { PipeTransform, BadRequestException } from '@nestjs/common';

// PipeTransform을 implement 해 줘야 함
export class PasswordPipe implements PipeTransform {
  // value는 실제로 입력 받은 값
  transform(value: any) {
    if (value.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자 이하로 입력 해 주세요!');
    }

    return value.toString();
  }
}
