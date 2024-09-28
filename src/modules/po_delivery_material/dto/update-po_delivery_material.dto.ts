import { PartialType } from '@nestjs/swagger';
import { CreatePoDeliveryMaterialDto } from './create-po_delivery_material.dto';

export class UpdatePoDeliveryMaterialDto extends PartialType(CreatePoDeliveryMaterialDto) {}
