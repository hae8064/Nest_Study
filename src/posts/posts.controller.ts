import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 모든 Post를 가져온다.
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // :id를 통해 get 요청
  // 여러개 pathparameter 인 경우
  // -> @Param 데코레이터에 parameter id 를 넣어준다.
  // param에 id: string 타입인 이유 ?
  // param으로 받았기 때문에 string 타입임
  // number 타입이라고 정의 하면 response를 정상적으로 못가져옴
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // Post / posts - post를 생성한다.
  // Body가 필요

  // DTO - Data Transfer Object
  @Post()
  @UseGuards(AccessTokenGuard)
  // 실제 파일을 업로드할 필드의 이름을 넣어주면 된다
  @UseInterceptors(FileInterceptor('image'))
  async postPosts(@User('id') userId: number, @Body() body: CreatePostDto) {
    await this.postsService.createPostImage(body);
    return this.postsService.createPost(userId, body);
  }

  // TODO: 추후 삭제 예정
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);

    return true;
  }

  // PATCh /posts/:id
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
