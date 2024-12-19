import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, Min } from 'class-validator';
import { IsMaterialExportRequestExist } from 'src/modules/material-export-request/validator/is-material-export-request-exist.validator';
import { IsMaterialReceiptExist } from 'src/modules/material-receipt/validator/is-material-receipt-exist.validator';

export class CreateMaterialExportReceiptDetailDto
  implements Prisma.MaterialExportReceiptDetailUncheckedCreateInput
{
  @ApiProperty()
  @IsMaterialExportRequestExist()
  materialExportReceiptId: string;

  @ApiProperty()
  @IsMaterialReceiptExist()
  materialReceiptId: string;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  quantityByPack: number;
}
