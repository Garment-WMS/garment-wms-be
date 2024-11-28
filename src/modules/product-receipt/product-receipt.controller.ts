import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
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
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';
import { ProductReceiptService } from './product-receipt.service';

@Controller('product-receipt')
export class ProductReceiptController {
  constructor(private readonly productReceiptService: ProductReceiptService) {}

  @Post()
  create(@Body() createProductReceiptDto: CreateProductReceiptDto) {
    return this.productReceiptService.create(createProductReceiptDto);
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductReceiptScalarWhereInput>(
        [],
        [{ code: 'asc' }, { createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.ProductReceiptScalarWhereInput>,
  ) {
    return this.productReceiptService.findAll(filterOptions.findOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productReceiptService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductReceiptDto: UpdateProductReceiptDto,
  ) {
    return this.productReceiptService.update(+id, updateProductReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productReceiptService.remove(+id);
  }
}
