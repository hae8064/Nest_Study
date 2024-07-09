import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID보다 높은 ID부터 값을 가져오기
  //   Type을 바꿔줄 때는 Number대문자로 해야한다.
  //   main.ts파일에서 enableImplicitconversion true를 넣어주면서 어노테이션에 입력 된 값으로 class-transformer를 적용
  //   @Type(() => Number)
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 정렬
  // createdAt -> 생성된 시간의 내림차 / 오름차 순으로 정렬 현재는 오름차순 정렬
  // @IsIn 리스트 내 옵션으로ASC 값이 들어와야만 validation pass가 된다
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  //   몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
