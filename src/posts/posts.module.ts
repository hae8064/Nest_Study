import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImagesService } from './image/images.service';

@Module({
  imports: [
    // forFeature는 모델에 해당하는 레포지터리에 해당
    // 배열 내 해당하는 MOdel을 넣어줘야 함
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([PostsModel, ImageModel]),
    CommonModule,
  ],
  controllers: [PostsController],
  // providers 내부에 리스트로 들어간다.
  providers: [PostsService, AccessTokenGuard, PostsImagesService],
})
export class PostsModule {}
