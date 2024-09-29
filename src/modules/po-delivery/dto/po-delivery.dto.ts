import { $Enums, PoDelivery } from '@prisma/client';
import { PoDeliveryMaterialDto } from 'src/modules/po-delivery-material/dto/po-delivery-material.dto';

export class PoDeliveryDto implements PoDelivery {
  id: string;
  purchaseOrderId: string;
  totalAmount: number;
  taxAmount: number;
  orderDate: Date;
  expectedDeliverDate: Date;
  deliverDate: Date;
  status: $Enums.PoDeliveryStatus;
  isExtra: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  PoDeliveryMaterial: Partial<PoDeliveryMaterialDto>[];
}
