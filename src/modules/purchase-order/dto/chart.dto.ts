import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { IsYearFormat } from 'src/common/decorator/year-check.decorator';

export class ChartDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productPlanId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsYearFormat()
  year: number;
}
