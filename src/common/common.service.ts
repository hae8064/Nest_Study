import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from './const/env-keys.const';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [data, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data,
      total: count,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    /**
     * 만약에 id값으로 조회가 아닌 where__likeCount__more_than 이러한 필드값으로
     * 조회를 원한다면 !?
     *
     * 또한, where__title__ilike
     */
    const findOptions = this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem =
      results.length > 0 && results.length === dto.take
        ? results[results.length - 1]
        : null;

    const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_HOST_KEY);

    const nextUrl = lastItem && new URL(`${protocol}://${host}/${path}`);

    if (nextUrl) {
      /**
       * dto의 키값들을 루핑하면서
       * 키값에 해당되는 밸류가 존재하면
       * param에 그대로 붙여놓는다
       *
       * 단, where__id_more_than 값만 id값만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id_more_than';
      } else {
        key = 'where__id_less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: nextUrl.toString() ?? null,
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    /**
     * 반환하고 싶은 형태
     * where,
     * order,
     * take,
     * skip -> page 기반일 때만
     */
    /**
     * 앞으로 어떤 작업을 할지
     * DTO의 현재 생긴 구조는 아래와 같다
     * {
     * where__id__more_than:1,
     * order__createdAt: 'ASC'
     * }
     *
     * 현재는 where__id__more_than / where__id__less_than에 해당되는 where 필터만 사용중이지만
     * 나중에는 where__likeCount__more_than이나 where__title__ilike등 추가 필터를 넣고 싶어졌을 떄
     * 모든 where 필터들을 자동으로 파싱할 수 있을만한 기능을 제작 해야한다.
     *
     * 이 과정을 아래 형태로 진행할 예정
     * 1) where로 시작한다면 필터 로직을 적용한다.
     * 2) order로 시작한다면 정렬 로직을 적용한다
     * 3) 필터 로직을 적용한다면 '__'기준으로 split했을 때 3개의 값으로 나뉘는지 2개의 값으로 나뉘는지 확인
     * 3-1) 3개의 값으로 나뉜다면 FILTER_MAPPER에서 해당되는 operator함수를 찾아서 적용한다.
     *  ex) ['where', 'id', 'more_than']
     * 3-2) 2개의 값으로 나뉜다면 정확한 값을 필터하는 것이기 때문에 operator없이 적용
     *  where__id -> ['where', 'id'] 이 값 그대로 utility적용이(more_than같은) 필요 없음
     * 4) order의 경우 3-2와 같이 적용 한다.
     *
     */

    // FindOptionsWhere은 FindManyOptions의 where 키만 가져왔을 때 해당되는 옵션
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      // 아래와 같은형태로 옴
      // key -> where__id__less_than
      // value -> 1

      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> {
    const options: FindOptionsWhere<T> = {};

    /**
     * 예를 들어, where__id__more_than
     * __를 기준으로 나눴을 때
     *
     * ['where', 'id', 'more_than']으로 나눌 수 있다.
     */
    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 split했을 때 길이가 2 또는 3이어야 한다. - 문제되는 키값: ${key}`,
      );
    }

    /**
     * 길이가 2인 경우는 이런식임 -> where__id = 3
     * FindOptionsWhere로 풀어보면 아래와 같다.
     *
     * {
     *  where: {
     *       id: 3
     *    }
     * }
     */
    if (split.length === 2) {
      // [where, id] 이렇게 구성 됨
      const [_, field] = split;

      /**
       * field -> 'id'
       */
      options[field] = value;
    } else {
      /**
       * 길이가 3인 경우에는 Typeorm 유틸리치 적용이 필요한 경우다.
       *
       * where__id__more_than의 경우
       * where는 버려도 되고 두번째 값은 필터할 키값이 된다.
       * 세번째 값은 typeorm 유틸리티가 된다.
       *
       * FILTER_MAPPER에 미리 정의해둔 값들로
       * field값에 FILTER_MAPPER에서 해당되는 utility를 가져온 후 값에 적용 해 준다.
       */

      // ['where', 'id', 'more_than']
      const [_, field, operator] = split;

      // where__id__between = 3, 4
      // 만약에 split 대상 문자가 존재하지 않으면 길이가 무조건 1이다.
      // const values = value.toString().split(',')

      // field -> id임
      // operator -> more_than임
      // FILTER_MAPPER[operator] -> MORE_THAN함수가 나옴
      // Between일때는 2개의 값이 들어가야 하므로
      // if(operator === 'between'){
      //   options[field] = FILTER_MAPPER[operator](values[0], values[1])
      // }else{
      //   options[field] = FILTER_MAPPER[operator](value);
      // }

      if (operator === 'i_like') {
        console.log('i_like');
        // 아래 코드 설명: % % 사이에 앞뒤로 value가 포함된 어떤글자든 매치해달라는 의미
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        // 우리는 단일값만 넣을것이므로 아래 코드면 충분
        options[field] = FILTER_MAPPER[operator](value);
      }
    }
    return options;
  }
}
