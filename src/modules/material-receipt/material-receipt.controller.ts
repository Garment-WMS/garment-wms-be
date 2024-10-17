import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CreateMaterialReceiptDto } from './dto/create-material-receipt.dto';
import { UpdateMaterialReceiptDto } from './dto/update-material-receipt.dto';
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
    @Query(new DirectFilterPipe<any, Prisma.MaterialWhereInput>([]))
    filterDto: FilterDto<Prisma.MaterialWhereInput>,
  ) {
    return this.materialReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialReceiptService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialReceiptDto: UpdateMaterialReceiptDto,
  ) {
    return this.materialReceiptService.update(+id, updateMaterialReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialReceiptService.remove(+id);
  }
}
