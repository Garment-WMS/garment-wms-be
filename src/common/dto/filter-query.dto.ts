import {
  FilterOperationType,
  FilterOrder,
  GeneratedFindOptions,
  IFilter,
  IGeneratedFilter,
  ISingleFilter,
  ISingleOrder,
} from '@chax-at/prisma-filter';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// The fields are also validated in filter.parser.ts to make sure that only correct fields are used to filter
export class SingleFilter<T> implements ISingleFilter<T> {
  @IsString()
  field!: keyof T & string;

  @IsEnum(FilterOperationType)
  type!: FilterOperationType;

  @IsDefined()
  value: any;
}

export class SingleFilterOrder<T> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;

  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}

export class CompoundFilter {
  @IsArray()
  field!: any;

  @IsString()
  value!: any;
}

export class Filter<T = any> implements IFilter<T> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilter)
  @IsOptional()
  filter?: Array<SingleFilter<T>>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilterOrder)
  @IsOptional()
  order?: Array<SingleFilterOrder<T>>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompoundFilter)
  @IsOptional()
  compoundFilter?: Array<CompoundFilter>;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit = 100;
}

export class FilterDto<TWhereInput>
  extends Filter
  implements IGeneratedFilter<TWhereInput>
{
  // This will be set by filter pipe
  findOptions!: GeneratedFindOptions<TWhereInput>;
}
