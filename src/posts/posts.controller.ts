import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans',
    title: '뉴진스 민지',
    content: 'dsadas',
    likeCount: 321,
    commentCount: 321312,
  },
  {
    id: 2,
    author: 'newjeans',
    title: '뉴진스 혜린',
    content: '혜린!!',
    likeCount: 321,
    commentCount: 321312,
  },
  {
    id: 3,
    author: 'blackpink',
    title: '블핑',
    content: '공연하느 로제',
    likeCount: 321,
    commentCount: 321312,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly appService: PostsService) {}

  // 모든 Post를 가져온다.
  @Get()
  getPosts() {
    return posts;
  }

  // :id를 통해 get 요청
  // 여러개 pathparameter 인 경우
  // -> @Param 데코레이터에 parameter id 를 넣어준다.
  // param에 id: string 타입인 이유 ?
  // number 타입이라고 정의 하면 response를 정상적으로 못가져옴
  @Get(':id')
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      // NotFoundException이란 ? 찾지 못했다라는 의미
      throw new NotFoundException();
    }
    return post;
  }
  // path parameter 표현방식
  // /posts/:id
  // id에 해당하는 post를 가져온다

  // @Get('post')
  // getPost(): Post {
  //   return {
  //     author: 'newJeans',
  //     title: '뉴진스 민지',
  //     content: '메이크업 고침',
  //     likeCount: 10000,
  //     commentCount: 990,
  //   };
  // }
}
