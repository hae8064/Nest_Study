import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    // forFeature는 모델에 해당하는 레포지터리에 해당
    // 배열 내 해당하는 MOdel을 넣어줘야 함
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([PostsModel]),
    CommonModule,
  ],
  controllers: [PostsController],
  // providers 내부에 리스트로 들어간다.
  providers: [PostsService, AccessTokenGuard],
})
export class PostsModule {}
