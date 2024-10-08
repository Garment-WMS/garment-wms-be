import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { UpdateImportRequestDetailDto } from '../import-request-detail/update-import-request-detail.dto';
import { CreateImportRequestDto } from './create-import-request.dto';

export class UpdateImportRequestDto extends PartialType(
  OmitType(CreateImportRequestDto, ['importRequestDetails']),
) {
  @ApiProperty({
    required: false,
    type: UpdateImportRequestDetailDto,
    isArray: true,
  })
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateImportRequestDetailDto)
  importRequestDetails: UpdateImportRequestDetailDto[];
}
