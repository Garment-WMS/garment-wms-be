import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateDiscussionDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  importRequestId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  exportRequestId?: string;
}
