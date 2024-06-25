import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 모든 Post를 가져온다.
  @Get()
  getPosts() {
    return this.postsService.getAllPost();
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
  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(authorId, title, content);
  }

  // PUT /posts/:id
  @Put(':id')
  putPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
