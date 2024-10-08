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
import { ApiTags } from '@nestjs/swagger';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { IsProductFormulaExistPipe } from './decorator/is-product-formula-exist.decorator';
import { CreateNestedProductFormulaMaterial } from './dto/create-nested-product-formula-material.dto';
import { CreateProductFormulaDto } from './dto/create-product-formula.dto';
import { UpdateProductFormulaDto } from './dto/update-product-formula.dto';
import { ProductFormulaService } from './product-formula.service';

@Controller('product-formula')
@ApiTags('product-formula')
export class ProductFormulaController {
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProductFormulaDto: CreateProductFormulaDto) {
    return this.productFormulaService.create(createProductFormulaDto);
  }

  constructor(private readonly productFormulaService: ProductFormulaService) {}

  @Post(':id/product-formula-material')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createProductFormulaMaterial(
    @Param('id', CustomUUIDPipe, IsProductFormulaExistPipe) id: string,
    @Body()
    createNestedProductFormulaMaterial: CreateNestedProductFormulaMaterial,
  ) {
    return this.productFormulaService.createProductFormulaMaterial(
      id,
      createNestedProductFormulaMaterial.productFormulaMaterials,
    );
  }

  @Get()
  findAll() {
    return this.productFormulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.productFormulaService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id') id: string,
    @Body() updateProductFormulaDto: UpdateProductFormulaDto,
  ) {
    return this.productFormulaService.update(id, updateProductFormulaDto);
  }

  @Delete(':id')
  remove(@Param('id', CustomUUIDPipe) id: string) {
    return this.productFormulaService.remove(id);
  }
}
