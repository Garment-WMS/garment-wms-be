import { $Enums, po_receipt } from '@prisma/client';
import { PoDeliveryMaterialDto } from 'src/modules/po-delivery-material/dto/po-delivery-material.dto';

export class PoDeliveryDto implements po_receipt {
  id: string;
  purchase_order_id: string;
  total_ammount: number;
  tax_amount: number;
  order_date: Date;
  expected_deliver_date: Date;
  deliver_date: Date;
  status: $Enums.po_receipt_status;
  create_at: Date;
  update_at: Date;
  deleted_at: Date;

  is_extra: boolean;

  PoDeliveryMaterial: Partial<PoDeliveryMaterialDto>[];
}
