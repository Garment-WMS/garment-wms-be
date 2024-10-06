import { PartialType } from '@nestjs/swagger';
import { CreatePoPoDeliveryBridgeDto } from './create-po-po-delivery-bridge.dto';

export class UpdatePoPoDeliveryBridgeDto extends PartialType(CreatePoPoDeliveryBridgeDto) {}
