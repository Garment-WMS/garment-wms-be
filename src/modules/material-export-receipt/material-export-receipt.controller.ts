import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { GetRecommendMaterialExportReceiptDto } from './dto/get-recommend-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';
import { WarehouseStaffExportDto } from './dto/warehouse-staff-export.dto';
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
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportReceiptWhereInput>(
        [],
        [{ createdAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.search(filterDto.findOptions),
      'Get all material export receipt successfully',
    );
  }
  @Get('/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_STAFF)
  async getByUser(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportReceiptWhereInput>(
        [],
        [{ createdAt: 'desc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialExportReceiptWhereInput>,
    @GetUser() user: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.getByUserToken(
        user,
        filterOptions.findOptions,
      ),
      'Get all material export receipt successfully',
    );
  }

  @Get('/custom')
  findAllCustomResponse(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportReceiptWhereInput>(
        [],
        [{ createdAt: 'desc' }],
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
    return await this.materialExportReceiptService.getRecommendedMaterialExportReceipt(
      getRecommendMaterialExportReceiptDto.materialExportRequestId,
      getRecommendMaterialExportReceiptDto.algorithm,
    );
  }

  // @Post('/recommend-by-formula')
  // async handleAlgorithmTest(
  //   @Param('id') id: string,
  //   @Body()
  //   dto: GetRecommendMaterialExportReceiptByFormulaDto,
  // ) {
  //   return apiSuccess(
  //     HttpStatus.OK,
  //     await this.materialExportReceiptService.getRecommendedMaterialExportReceiptByFormula(
  //       dto.productFormulaId,
  //       dto.quantityToProduce,
  //       dto.algorithm,
  //     ),
  //     'Recommend material export receipt by formula successfully',
  //   );
  // }

  @Get('/latest')
  findLatest(@Query('from') from, @Query('to') to) {
    return this.materialExportReceiptService.getLatest(from, to);
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

  @Post('/warehouse-staff-process')
  async warehouseStaffProcess(
    @Body() WarehouseStaffExportDto: WarehouseStaffExportDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.warehouseStaffExport(
        WarehouseStaffExportDto,
      ),
      'Warehouse staff process successfully',
    );
  }

  @Get('/by-material-export-request/:id')
  async getByMaterialExportRequestId(@Param('id', ParseUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportReceiptService.getByMaterialExportRequestId(id),
      'Get material export receipt by material export request id successfully',
    );
  }
}
