import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import {
  GetRecommendMaterialExportReceiptTestDto as GetRecommendMaterialExportReceiptByFormulaDto,
  GetRecommendMaterialExportReceiptDto,
} from './dto/get-recommend-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';
import { MaterialExportReceiptService } from './material-export-receipt.service';

@Controller('material-export-receipt')
export class MaterialExportReceiptController {
  constructor(
    private readonly materialExportReceiptService: MaterialExportReceiptService,
  ) {}

  @Post()
  async create(
    @Body() createMaterialExportReceiptDto: CreateMaterialExportReceiptDto,
  ) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.materialExportReceiptService.create(
        createMaterialExportReceiptDto,
      ),
      'Material export receipt created successfully',
    );
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportReceiptWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterDto: FilterDto<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    return this.materialExportReceiptService.search(filterDto.findOptions);
  }
  @Get()
  findAllCustomResponse(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportReceiptWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterDto: FilterDto<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    return this.materialExportReceiptService.search(filterDto.findOptions);
  }

  @Post('/recommend')
  async getExportAlgorithm(
    @Body()
    getRecommendMaterialExportReceiptDto: GetRecommendMaterialExportReceiptDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.getRecommendedMaterialExportReceipt(
        getRecommendMaterialExportReceiptDto.materialExportRequestId,
        getRecommendMaterialExportReceiptDto.algorithm,
      ),
      'Recommend material export receipt successfully',
    );
  }

  @Post('/recommend-by-formula')
  async handleAlgorithmTest(
    @Param('id') id: string,
    @Body()
    dto: GetRecommendMaterialExportReceiptByFormulaDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.getRecommendedMaterialExportReceiptByFormula(
        dto.productFormulaId,
        dto.quantityToProduce,
        dto.algorithm,
      ),
      'Recommend material export receipt by formula successfully',
    );
  }

  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.findUnique(id),
      'Get material export receipt successfully',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return this.materialExportReceiptService.update(
      id,
      updateMaterialExportReceiptDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportReceiptService.remove(id);
  }
}
