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
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductService } from './product.service';
import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    console.log(createProductTypeDto);
    return this.productService.create(createProductTypeDto);
  }

  @Get()
  findAll(
    @Query(new AllFilterPipeUnsafe<any, Prisma.ProductWhereInput>([]))
    filterOptions: FilterDto<Prisma.ProductWhereInput>,
  ) {
    return this.productService.findAll(filterOptions.findOptions);
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.productService.findByIdWithResponse(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    return this.productService.update(+id, updateProductTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
