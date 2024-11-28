import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetAssignDto {
  @ApiProperty()
  @IsDateString()
  // @MinDate(new Date())
  @IsNotEmpty()
  expectedStartAt: Date;

  @ApiProperty()
  @IsDateString()
  // @MinDate(new Date())
  @IsNotEmpty()
  expectedEndAt: Date;
}
