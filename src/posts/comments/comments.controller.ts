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
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { UpdateCommentDto } from './dto/update-comments-dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
    /**
     * Post 작업 요소 참조
     * 1) Entity 생성
     *  entity의 구성요소
     *    author - 작성자
     *    post -> 귀속 되는 포스트
     *    comment -> 실제 댓글 내용
     *    likeCount -> 좋아요 개수
     *    id -> Primary GeneratedColumn
     *    createdAt -> 생성일자
     *    updatedAt -> 업데이트 일자
     *
     *
     * 2) Get() pagination
     * 3) GET('commentId') 특정 comment만 하나 가져오는 기능
     * 4) POST() 코멘트 생성하는 기능
     * 5) PATCH('commentId')특정 코멘트 업데이트 하는 기능
     * 6) DELETE(':commentId') 특정 코멘트 삭제하는 기능
     */
  }

  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateCommentsDto,
  ) {
    return this.commentsService.paginateComments(query, postId);
  }

  @Get(':commentId')
  getComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  // 어떤 사용자가 생성 하는지 알아야하므로 accessTOken검증 코드가 필요함 -> 가드 사용
  @Post()
  @UseGuards(AccessTokenGuard)
  postComment(
    @Param('pid', ParseIntPipe) postId: number,
    @Body() body: CreateCommentsDto,
    @User() user: UsersModel,
  ) {
    return this.commentsService.createComment(body, postId, user);
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  async patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(body, commentId);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.deleteComment(commentId);
  }
}
