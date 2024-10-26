import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';
import { PoDeliveryService } from './po-delivery.service';

@ApiTags('po-delivery')
@Controller('po-delivery')
export class PoDeliveryController {
  constructor(private readonly poDeliveryService: PoDeliveryService) {}

  @Get(':id')
  getOnePoDelivery(@Param('id', CustomUUIDPipe) id: string) {
    return this.poDeliveryService.getOnePoDelivery(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updatePoDelivery(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updatePoDeliveryDto: UpdatePoDeliveryDto,
  ) {
    return this.poDeliveryService.updatePoDelivery(id, updatePoDeliveryDto);
  }

  @Get('/po/:Poid')
  getPoDeliveryByPoId(@Param('Poid', CustomUUIDPipe) Poid: string) {
    return this.poDeliveryService.getPoDeliveryByPoId(Poid);
  }

}
