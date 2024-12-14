import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductReceiptDisposeDto {
  @ApiProperty()
  @IsUUID()
  productReceiptId: string;

  @ApiProperty()
  @Min(1)
  @IsInt()
  quantityByUom: number;
}

export class ProductReceiptDisposeArrayDto {
  @ApiProperty({ type: [ProductReceiptDisposeDto] })
  @ValidateNested({ each: true })
  @Type(() => ProductReceiptDisposeDto)
  @ArrayUnique((o: ProductReceiptDisposeDto) => o.productReceiptId, {
    message: 'Product receipt id can not duplicate',
  })
  @IsArray({
    message: 'Product receipts must be an array',
  })
  productReceipts: [ProductReceiptDisposeDto];
}
