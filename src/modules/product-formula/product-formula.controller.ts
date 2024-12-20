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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { IsProductFormulaExistPipe } from './decorator/is-product-formula-exist.decorator';
import { CreateNestedProductFormulaMaterial } from './dto/create-nested-product-formula-material.dto';
import { CreateProductFormulaDto } from './dto/create-product-formula.dto';
import { UpdateProductFormulaDto } from './dto/update-product-formula.dto';
import { ProductFormulaService } from './product-formula.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product-formula')
@ApiTags('product-formula')
export class ProductFormulaController {
  constructor(private readonly productFormulaService: ProductFormulaService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProductFormulaDto: CreateProductFormulaDto) {
    return this.productFormulaService.create(createProductFormulaDto);
  }

  @Post('excel')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('file'))
  createByExcel(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productFormulaService.createByExcel(file);
  }

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
  search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductFormulaWhereInput>(
        [
          'productSize.productVariantId',
          'productSize.productVariant.productId',
        ],
        [{ createdAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.ProductFormulaWhereInput>,
  ) {
    return this.productFormulaService.search(filterDto.findOptions);
  }

  @Get('/by-product-batch/:productBatchId')
  async getByProductBatchId(
    @Param('productBatchId', ParseUUIDPipe) productBatchId: string,
  ) {
    return apiSuccess(
      200,
      await this.productFormulaService.getByProductBatchId(productBatchId),
      'Product Formula fetched successfully',
    );
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
