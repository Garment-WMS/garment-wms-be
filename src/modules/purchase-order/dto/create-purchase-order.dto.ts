import {
  IsDate,
  IsNotEmpty,
  IsNumber,
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

  @IsOptional()
  @IsNumber()
  shippingAmount: number;

  @IsOptional()
  @IsNumber()
  otherAmount: number;
  
  @IsOptional()
  @IsNumber()
  subTotal: number;

  Supplier: SupplierDto;

  poDelivery: Partial<PoDeliveryDto>[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  id: UUID;
}
