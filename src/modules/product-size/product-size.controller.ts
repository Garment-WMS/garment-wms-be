import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductSizeService } from './product-size.service';
import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';

@Controller('product-size')
export class ProductSizeController {
  constructor(private readonly productSizeService: ProductSizeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productSizeService.create(createProductVariantDto);
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductSizeScalarWhereInput>(
        [],
        [],
      ),
    )
    filterOptions: FilterDto<Prisma.ProductSizeScalarWhereInput>,
  ) {
    return this.productSizeService.findAll(filterOptions.findOptions);
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.productSizeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productSizeService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  remove(@Param('id', CustomUUIDPipe) id: string) {
    return this.productSizeService.remove(id);
  }
}
