import { PoDeliveryDetail } from '@prisma/client';

export class PoDeliveryMaterialDto implements PoDeliveryDetail {
  id: string;
  poDeliveryId: string;
  materialVariantId: string;
  productId: string;
  totalAmount: number;
  expireDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  packUnit: string;
  quantityByPack: number;
  uom: string;
  uomPerPack: number;
}
