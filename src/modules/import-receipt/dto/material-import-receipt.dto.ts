import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MaterialImportReceiptDto {
  @IsNotEmpty()
  @IsUUID()
  inspectionReportDetailId: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toUpperCase())
  SKU: string;
}
