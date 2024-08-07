import { FindManyOptions } from 'typeorm';
import { PostsModel } from '../entities/posts.entity';

export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
  // 아래 2개 전부 가능
  //   relations: ['author', 'images'],
  relations: {
    author: true,
    images: true,
  },
};
