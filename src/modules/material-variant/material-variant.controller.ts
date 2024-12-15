import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
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
// import { months } from 'src/common/constant/constant';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { HttpCacheInterceptor } from 'src/common/interceptor/cache.interceptor';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { BodyInterceptor } from 'src/common/pipe/parse-form-data-json-pipe.pipe';
import { ChartDto } from './dto/chart.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialVariantService } from './material-variant.service';

@Controller('material-variant')
@UseInterceptors(HttpCacheInterceptor)
@ApiTags('Material Variant')
export class MaterialVariantController {
  constructor(
    private readonly materialVariantService: MaterialVariantService,
  ) {}

  @Get()
  search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialVariantScalarWhereInput>(
        ['material.name', 'material.code', 'material.materialUom.name'],
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { name: 'asc' },
          { materialId: 'asc' },
          { code: 'asc' },
          { reorderLevel: 'asc' },
          { updatedAt: 'asc' },
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    return this.materialVariantService.search(filterOptions.findOptions);
  }

  @Get('disposed')
  searchDisposed(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialVariantScalarWhereInput>(
        ['material.name', 'material.code', 'material.materialUom.name'],
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { name: 'asc' },
          { materialId: 'asc' },
          { code: 'asc' },
          { reorderLevel: 'asc' },
          { updatedAt: 'asc' },
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    return this.materialVariantService.searchDisposed(
      filterOptions.findOptions,
    );
  }

  @Get('disposed/:id')
  getOneDisposed(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.materialVariantService.getOneDisposed(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({}))
  create(@Body('createMaterialDto') createMaterialDto: any) {
    return this.materialVariantService.create(createMaterialDto);
  }

  @Post('/form-data')
  @UseInterceptors(FileInterceptor('file'), BodyInterceptor)
  @UsePipes(new ValidationPipe({}))
  createFormData(
    @UploadedFile() file: Express.Multer.File,
    @Body('createMaterialDto')
    createMaterialDto: CreateMaterialDto,
  ) {
    return this.materialVariantService.create(createMaterialDto, file);
  }

  @Post('chart')
  getChart(@Body() chartDto: ChartDto) {
    return this.materialVariantService.getChart(chartDto);
  }

  @Get('/all-reorder-level')
  getAllReorderLevel() {
    return this.materialVariantService.findAllOpenReOrderAlert();
  }

  @Get('all')
  getAllMaterial() {
    return this.materialVariantService.findAll();
  }

  @Get('has-receipt')
  getMaterialHasReceipt(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialVariantScalarWhereInput>(
        ['material.name', 'material.code', 'material.materialUom.name', ''],
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { name: 'asc' },
          { materialId: 'asc' },
          { code: 'asc' },
          { reorderLevel: 'asc' },
          { updatedAt: 'asc' },
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    return this.materialVariantService.findMaterialHasReceipt(
      filterOptions.findOptions,
    );
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.materialVariantService.addImage(file, id);
  }

  @Get(':id')
  getMaterialById(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.materialVariantService.findByIdWithResponse(id);
  }

  @Get(':id/history')
  getMaterialHistoryById(
    @Query('sortBy') sortBy: string,
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialVariantScalarWhereInput>(
        ['material.name', 'material.code', 'material.materialUom.name'],
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { name: 'asc' },
          { materialId: 'asc' },
          { code: 'asc' },
          { reorderLevel: 'asc' },
          { updatedAt: 'asc' },
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialVariantScalarWhereInput>,
    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.materialVariantService.findHistoryByIdWithResponse(
      id,
      sortBy,
      filterOptions.findOptions,
    );
  }

  @Get(':id/receiptV1')
  getMaterialReceiptById(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.materialVariantService.findMaterialReceiptByIdWithResponse(id);
  }

  @Get(':id/export-receipt')
  getMaterialExportReceipt(
    @Query(
      new AllFilterPipeUnsafe<
        any,
        Prisma.MaterialExportReceiptDetailScalarWhereInput
      >(['material.name', 'material.code', 'material.materialUom.name'], []),
    )
    filterOptions: FilterDto<Prisma.MaterialExportReceiptDetailScalarWhereInput>,

    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.materialVariantService.findMaterialExportReceipt(
      id,
      filterOptions.findOptions,
    );
  }

  @Get(':id/import-receipt')
  getMaterialImportReceipt(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialReceiptScalarWhereInput>(
        [
          'material.name',
          'material.code',
          'material.materialUom.name',
          'materialPackage.code',
          'materialPackage.name',
        ],
        [{ createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialReceiptScalarWhereInput>,

    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.materialVariantService.findMaterialImportReceipt(
      id,
      filterOptions.findOptions,
    );
  }
  @Get(':id/material-receipt')
  getMaterialReceipt(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialReceiptScalarWhereInput>(
        [
          'material.name',
          'material.code',
          'material.materialUom.name',
          'materialPackage.code',
          'materialPackage.name',
        ],
        [{ createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialReceiptScalarWhereInput>,

    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.materialVariantService.findMaterialImportReceipt(
      id,
      filterOptions.findOptions,
    );
  }

  @Get(':id/material-receipt/disposed')
  getDisposedMaterialReceipt(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialReceiptScalarWhereInput>(
        [
          'material.name',
          'material.code',
          'material.materialUom.name',
          'materialPackage.code',
          'materialPackage.name',
        ],
        [{ createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialReceiptScalarWhereInput>,

    @Param('id', new CustomUUIDPipe()) id: string,
  ) {
    return this.materialVariantService.findDisposedMaterialImportReceipt(
      id,
      filterOptions.findOptions,
    );
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateMaterial(
    @Param('id', new CustomUUIDPipe()) id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialVariantService.update(id, updateMaterialDto);
  }
}
