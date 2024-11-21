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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { HttpCacheInterceptor } from 'src/common/interceptor/cache.interceptor';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductVariantService } from './product-variant.service';
import { ChartDto } from './dto/chart-dto.dto';

@ApiTags('Product')
@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productVariantService.create(createProductDto);
  }

  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductVariantScalarWhereInput>(
        [],
        [],
      ),
    )
    filterOptions: FilterDto<Prisma.ProductVariantScalarWhereInput>,
  ) {
    return this.productVariantService.findAll(filterOptions.findOptions);
  }

  @Post('chart')
  getChart(@Body() chartDto: ChartDto) {
    return this.productVariantService.getChart(chartDto);
  }

  @Get(':id')
  findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.productVariantService.findByIdWithResponse(id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.productVariantService.addImage(file, id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productVariantService.update(id, updateProductDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.productVariantService.addImage(file, id);
  }

  @Get(':id/import-receipt')
  getMaterialImportReceipt(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ProductReceiptScalarWhereInput>(
        [],
        [{ code: 'asc' }, { createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.ProductReceiptScalarWhereInput>,

    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.productVariantService.findProductImportReceipt(
      id,
      filterOptions.findOptions,
    );
  }

  @Delete(':id')
  remove(@Param('id', CustomUUIDPipe) id: string) {
    return this.productVariantService.remove(id);
  }
}
