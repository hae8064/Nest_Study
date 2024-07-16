import { equal } from 'assert';
import {
  Any,
  ArrayContainedBy,
  ArrayContains,
  ArrayOverlap,
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

// typeorm utility함수 사용 시 아래에서는 대문자가 생기는 구간은 '_'로 나타낼거임

/**
 * where__id__not
 *
 * {
 *  where: {
 *      id: Not(value)
 *  }
 * }
 */
export const FILTER_MAPPER = {
  not: Not,
  less_than: LessThan,
  less_than_or_equal: LessThanOrEqual,
  more_than: MoreThan,
  more_than_or_equal: MoreThanOrEqual,
  equal: Equal,
  like: Like,
  i_like: ILike,
  between: Between,
  in: In,
  any: Any,
  is_null: IsNull,
  array_contains: ArrayContains,
  array_contained_by: ArrayContainedBy,
  array_overlap: ArrayOverlap,
};
