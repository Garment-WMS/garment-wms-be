import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinDate,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProductPlanDetailDto } from 'src/modules/product-plan-detail/dto/create-product-plan-detail.dto';

export class CreateProductPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsDateString()
  @MinDate(new Date(), { message: 'expectedStartDate must not be in the past' })
  expectedStartDate: Date;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsDateString()
  @MinDate(new Date(), { message: 'expectedEndDate must not be in the past' })
  expectedEndDate: Date;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductPlanDetailDto)
  @IsOptional()
  productionPlanDetails: CreateProductPlanDetailDto[];

  // Default constructor
  constructor();
  // Parameterized constructor
  constructor(
    name?: string,
    note?: string,
    expectedStartDate?: Date,
    expectedEndDate?: Date,
    productionPlanDetails?: CreateProductPlanDetailDto[],
  );
  // Implementation of the constructor
  constructor(
    name: string = null,
    note: string = null,
    expectedStartDate: Date = null,
    expectedEndDate: Date = null,
    productionPlanDetails: CreateProductPlanDetailDto[] = [],
  ) {
    this.name = name;
    this.note = note;
    this.expectedStartDate = expectedStartDate;
    this.expectedEndDate = expectedEndDate;
    this.productionPlanDetails = productionPlanDetails;
  }
}
