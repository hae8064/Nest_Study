import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

// PipeTransform을 implement 해 줘야 함
export class PasswordPipe implements PipeTransform {
  // value는 실제로 입력 받은 값
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자 이하로 입력 해 주세요!');
    }

    return value.toString();
  }
}

<img src="http://blogfiles.naver.net/MjAxNzExMTNfMjIy/MDAxNTEwNTQ2OTQyNzIx.deANGUaADVP5Iq0KHDLNDoV1apgtasyPiTxU7Pe6FCsg.cPMGsMHId_5OhsnvEY9i2e2bXMC3TKGL3K7x3JoLN94g.PNG.baron19/%EB%B9%88%ED%99%94%EB%A9%B4550.png
" usemap="#메뉴" /><map name="메뉴"><area shape="rect" coords="6,437,162,460" target="_top" href="https://blog.naver.com/PostList.naver?blogId=lbh8064&amp;from=postList&amp;categoryNo=7" /></map>