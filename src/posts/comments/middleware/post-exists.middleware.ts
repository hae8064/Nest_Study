import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postService: PostsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('post id 파라미터는 필수다.');
    }

    // postid가 실제 존재하는지 안하는지 체크 해준다
    const exists = await this.postService.checkPostExistsById(parseInt(postId));

    if (!exists) {
      throw new BadRequestException(`post가 존재하지 않습니다.`);
    }

    //어떤 작업이 끝나면 무조건 next로 다음 단계로 넘어가 줘야 함
    next();
  }
}
