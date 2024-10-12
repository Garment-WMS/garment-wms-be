import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductTypeService } from './product-type.service';

@Controller('product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ stopAtFirstError: true }))
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    console.log(createProductTypeDto);
    return this.productTypeService.create(createProductTypeDto);
  }

  @Get()
  findAll() {
    return this.productTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.productTypeService.findByIdWithResponse(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    return this.productTypeService.update(+id, updateProductTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypeService.remove(+id);
  }
}
