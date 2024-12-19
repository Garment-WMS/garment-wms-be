import { $Enums, PurchaseOrder } from '@prisma/client';

export class PurchaseOrderDto implements PurchaseOrder {
  productionPlanId: string;
  code: string;
  note: string;
  cancelledBy: string;
  cancelledAt: Date;
  cancelledReason: string;
  subTotalAmount: number;
  shippingAmount: number;
  otherAmount: number;
  id: string;
  poNumber: string;
  quarterlyProductionPlanId: string;
  purchasingStaffId: string;
  supplierId: string;
  shippingAddress: string;
  currency: string;
  totalAmount: number;
  taxAmount: number;
  orderDate: Date;
  expectedFinishDate: Date;
  finishDate: Date;
  status: $Enums.PurchaseOrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
