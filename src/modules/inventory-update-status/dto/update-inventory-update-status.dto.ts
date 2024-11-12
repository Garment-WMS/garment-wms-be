import { PartialType } from '@nestjs/swagger';
import { CreateInventoryUpdateStatusDto } from './create-inventory-update-status.dto';

export class UpdateInventoryUpdateStatusDto extends PartialType(CreateInventoryUpdateStatusDto) {}
