import { PartialType } from '@nestjs/swagger';
import { CreatePoDeliveryDto } from './create-po-delivery.dto';

export class UpdatePoDeliveryDto extends PartialType(CreatePoDeliveryDto) {}
