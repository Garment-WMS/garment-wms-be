import { PartialType } from '@nestjs/swagger';
import { CreatePoDeliveryMaterialDto } from './create-po-delivery-material.dto';

export class UpdatePoDeliveryMaterialDto extends PartialType(
  CreatePoDeliveryMaterialDto,
) {}
