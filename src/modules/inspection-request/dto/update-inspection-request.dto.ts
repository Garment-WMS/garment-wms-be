import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateInspectionRequestDto } from './create-inspection-request.dto';

export class UpdateInspectionRequestDto extends PartialType(
  CreateInspectionRequestDto,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;
}
