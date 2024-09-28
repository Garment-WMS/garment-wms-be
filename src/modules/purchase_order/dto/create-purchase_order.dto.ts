import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';
import { SupplierDto } from 'src/modules/supplier/dto/supplier.dto';

export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsUUID()
  previousId: UUID;

  @IsNotEmpty()
  @IsString()
  PONumber: String;

  @IsNotEmpty()
  @IsUUID()
  quarterlyProductionPlanId: UUID;

  @IsNotEmpty()
  @IsUUID()
  purchasingStaffId: UUID;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  taxAmount: number;

  @IsNotEmpty()
  @IsDate()
  orderDate: Date;

  @IsNotEmpty()
  @IsDate()
  expectedFinishDate: Date;

  @IsOptional()
  @IsDate()
  finishedDate: Date;

  Supplier: SupplierDto;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  id: UUID;
}
