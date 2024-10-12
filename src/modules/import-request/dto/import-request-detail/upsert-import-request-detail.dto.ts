import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateImportRequestDetailDto } from './create-import-request-detail.dto';

export class UpsertImportRequestDetailDto extends CreateImportRequestDetailDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;
}
