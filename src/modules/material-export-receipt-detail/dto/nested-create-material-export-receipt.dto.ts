import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { IsMaterialReceiptExist } from 'src/modules/material-receipt/validator/is-material-receipt-exist.validator';

export class NestCreateMaterialExportReceipt {
  @ApiProperty()
  @IsMaterialReceiptExist()
  materialReceiptId: string;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  quantityByPack: number;
}
