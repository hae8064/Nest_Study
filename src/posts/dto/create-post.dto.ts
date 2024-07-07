import { IsString } from 'class-validator';
import { PostsModel } from '../entities/posts.entity';
import { PickType } from '@nestjs/mapped-types';

// Pick, Omit, Partial -> 타입을 반환
// PickType, OmitType, ParialType -> 값을 반환

// Class는 값을 반환 해주는 걸 사용해야 이슈가 없음

// 실제로 검증 받고 싶은 값들을 넣어주면 됨
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
