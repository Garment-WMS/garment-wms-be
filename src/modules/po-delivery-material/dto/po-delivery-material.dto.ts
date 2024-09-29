import { PoDeliveryDetail } from '@prisma/client';

export class PoDeliveryMaterialDto implements PoDeliveryDetail {
  id: string;
  poDeliveryId: string;
  materialId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  expireDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
