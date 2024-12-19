import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CreateMaterialReceiptDto } from './dto/create-material-receipt.dto';
import { MaterialReceiptService } from './material-receipt.service';

@Controller('material-receipt')
export class MaterialReceiptController {
  constructor(
    private readonly materialReceiptService: MaterialReceiptService,
  ) {}

  @Post()
  create(@Body() createMaterialReceiptDto: CreateMaterialReceiptDto) {
    return this.materialReceiptService.create(createMaterialReceiptDto);
  }

  // @Get()
  // findAll() {
  //   return this.materialReceiptService.findAll();
  // }

  @Get()
  findAllMaterialVariant(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialReceiptWhereInput>([
        'materialPackage.materialVariantId',
        'importReceipt.inspectionReport.inspectionRequest.importRequest.poDelivery.purchaseOrder.code',
      ]),
    )
    filterDto: FilterDto<Prisma.MaterialReceiptWhereInput>,
  ) {
    return this.materialReceiptService.findAll();
  }

  @Get('/lite')
  findAllMaterialVariantLite() {
    return this.materialReceiptService.findAllLite();
  }

  @Get('/by-material-variant')
  findByMaterialVariant(
    @Query('materialVariantId', ParseUUIDPipe) materialVariantId: string,
  ) {
    return this.materialReceiptService.getAllMaterialReceiptOfMaterialVariantSimplified(
      materialVariantId,
    );
  }

  @Get('/by-code')
  findByCode(@Query('code') code: string) {
    return this.materialReceiptService.findByCode(code);
  }

  @Patch('/re-count')
  recountMaterialReceipt() {
    return this.materialReceiptService.recountMaterialInventoryStock();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialReceiptService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMaterialReceiptDto: UpdateMaterialReceiptDto,
  // ) {
  //   return this.materialReceiptService.update(+id, updateMaterialReceiptDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialReceiptService.remove(+id);
  }
}
