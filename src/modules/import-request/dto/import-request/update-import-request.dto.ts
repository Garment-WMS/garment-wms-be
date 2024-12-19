import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpsertImportRequestDetailDto } from '../import-request-detail/upsert-import-request-detail.dto';
import { CreateImportRequestDto } from './create-import-request.dto';

export class UpdateImportRequestDto extends PartialType(
  OmitType(CreateImportRequestDto, ['importRequestDetails']),
) {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  managerNote?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpsertImportRequestDetailDto)
  importRequestDetails: UpsertImportRequestDetailDto[];
}
