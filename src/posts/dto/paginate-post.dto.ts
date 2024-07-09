import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

// 쿼리로 받을 거임
export class PaginatePostDto extends BasePaginationDto {}
