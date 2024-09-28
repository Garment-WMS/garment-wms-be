import { po_receipt_detail } from '@prisma/client';

export class PoDeliveryMaterialDto implements po_receipt_detail {
  id: string;
  po_receipt_id: string;
  material_id: string;
  product_id: string;
  quantity: number;
  total_ammount: number;
  expire_date: Date;
  create_at: Date;
  update_at: Date;
  deleted_at: Date;
}
