import { Injectable, NotFoundException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

export interface PostModel {
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

@Injectable()
export class PostsService {
  // model에 해당되는 레포지터리를 주입할 때 해 주는 코드
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPost() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  // paginate Test용
  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
      });
    }
  }

  // 1. 오름차순으로 정렬하는 pagiation만 구현한다.
  async paginatePosts(dto: PaginatePostDto) {
    // 1,2,3,4,5라는 id값
    // MoreThan는 typeorm 함수
    const posts = await this.postsRepository.find({
      where: {
        // dto의 프로퍼티 값은 이름 규칙이 있음
        // where에 사용하고 id라는 속성 __ MoreTHAN을 사용하므로 _more_than
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    /**
     * Response 구조
     *
     * data: Data[],
     * cursor: {
     *  after: 마지막 data의 id
     * },
     * count: 응답한 데이터의 개수
     * next: 다음 요청을 할 때 사용할 URL
     */

    return {
      data: posts,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    // save의 기능
    const { title, content } = postDto;
    // 1. 만약에 데이터가 존재하지 않는다면 (id 기준) 새로 생성한다.
    // 2. 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트

    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }
}
