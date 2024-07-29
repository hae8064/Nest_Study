import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        // v파일 사이즈 제한 10만 바이트로 -> 단위 바이트 기준
        fileSize: 10000000,
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb (에라, boolean) 콜백함수
         * 첫번째 파라미터에는 에럭 ㅏ있을 경우 에러정보 넣어준다
         * 두번째 파라미터에는 파일을 받을지 말지 boolean을 넣어준다
         */

        // extname함수는  확장자만 가져와줌
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png파일만 업로드 가능합니다'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          // 123132-3213213.jpg
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
