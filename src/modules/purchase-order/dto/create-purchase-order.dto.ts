import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';
import { PoDeliveryDto } from 'src/modules/po-delivery/dto/po-delivery.dto';
import { SupplierDto } from 'src/modules/supplier/dto/supplier.dto';

export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsUUID()
  previousId: UUID;

  @IsNotEmpty()
  @IsString()
  PONumber: string;

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
  @IsInt()
  totalAmount: number;

  @IsNotEmpty()
  @IsInt()
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

  @IsOptional()
  @IsInt()
  shippingAmount: number;

  @IsOptional()
  @IsInt()
  otherAmount: number;

  @IsOptional()
  @IsInt()
  subTotal: number;

  Supplier: SupplierDto;

  poDelivery: Partial<PoDeliveryDto>[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  id: UUID;
}
