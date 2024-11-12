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
          { reorderLevel: 'asc' },
          { updatedAt: 'asc' },
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialVariantScalarWhereInput>,
  ) {
    return this.materialVariantService.search(filterOptions.findOptions);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialVariantService.create(createMaterialDto);
  }

  @Get('chart')
  getChart(@Body() chartDto: ChartDto) {
    return this.materialVariantService.getChart(chartDto);
  }

  @Get('all')
  getAllMaterial() {
    return this.materialVariantService.findAll();
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

  @Get(':id/receiptV1')
  getMaterialReceiptById(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.materialVariantService.findMaterialReceiptByIdWithResponse(id);
  }

  @Get(':id/receipt')
  getMaterialReceiptById2(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.materialVariantService.findMaterialReceiptByIdWithResponse2(id);
  }

  // @Get(':id/receipt/chart')
  // getMaterialReceiptChartById(
  //   @Param('id', new CustomUUIDPipe()) id: string,
  //   @Query('months') months: months[],
  // ) {
  //   return this.materialVariantService.findMaterialReceiptChart(id, months);
  // }

<<<<<<< Tabnine <<<<<<<
  /**//+
   * Updates an existing material variant by its ID.//+
   *//+
   * @param id - The unique identifier of the material variant to be updated.//+
   * @param updateMaterialDto - The data to be used for updating the material variant.//+
   *//+
   * @returns The updated material variant.//+
   *///+
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateMaterial(
    @Param('id', new CustomUUIDPipe()) id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialVariantService.update(id, updateMaterialDto);
  }
>>>>>>> Tabnine >>>>>>>// {"conversationId":"fe9480af-7261-464f-819f-5731695d0241","source":"instruct"}
}
