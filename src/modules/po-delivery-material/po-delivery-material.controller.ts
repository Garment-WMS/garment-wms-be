import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePoDeliveryMaterialDto } from './dto/create-po-delivery-material.dto';
import { UpdatePoDeliveryMaterialDto } from './dto/update-po-delivery-material.dto';
import { PoDeliveryMaterialService } from './po-delivery-material.service';

@Controller('po-delivery-material')
export class PoDeliveryMaterialController {
  constructor(
    private readonly poDeliveryMaterialService: PoDeliveryMaterialService,
  ) {}

  @Post()
  create(@Body() createPoDeliveryMaterialDto: CreatePoDeliveryMaterialDto) {
    return this.poDeliveryMaterialService.create(createPoDeliveryMaterialDto);
  }

  @Get()
  findAll() {
    return this.poDeliveryMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poDeliveryMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePoDeliveryMaterialDto: UpdatePoDeliveryMaterialDto,
  ) {
    return this.poDeliveryMaterialService.update(
      +id,
      updatePoDeliveryMaterialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poDeliveryMaterialService.remove(+id);
  }
}
