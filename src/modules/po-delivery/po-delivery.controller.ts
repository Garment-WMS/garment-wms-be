import { Body, Controller, Get, Param, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { PoDeliveryService } from './po-delivery.service';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';

@Controller('po-delivery')
export class PoDeliveryController {
  constructor(private readonly poDeliveryService: PoDeliveryService) {}

  @Get(':id')
  getOnePoDelivery(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.poDeliveryService.getOnePoDelivery(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updatePoDelivery(@Param('id', new CustomUUIDPipe()) id: string,@Body() updatePoDeliveryDto: UpdatePoDeliveryDto) {
    return this.poDeliveryService.updatePoDelivery(id,updatePoDeliveryDto);
  }
}
