import { DirectFilterPipe } from '@chax-at/prisma-filter';
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
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { ManagerProcessDto } from './dto/import-request/manager-process.dto';
import { PurchasingStaffProcessDto } from './dto/import-request/purchasing-staff-process.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';
import { ImportRequestService } from './import-request.service';
import { IsImportRequestExistPipe } from './pipe/is-import-request-exist.pipe';

@Controller('import-request')
@ApiTags('import-request')
export class ImportRequestController {
  constructor(private readonly importRequestService: ImportRequestService) {}

  @Post()
  async create(@Body() createImportRequestDto: CreateImportRequestDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.importRequestService.create(createImportRequestDto),
      'Import request created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new DirectFilterPipe<any, Prisma.ImportRequestWhereInput>(
        [
          'id',
          'warehouseStaffId',
          'poDeliveryId',
          'purchasingStaffId',
          'warehouseManagerId',
          'productionDepartmentId',
          'productionBatchId',
          'status',
          'code',
          'type',
          'startedAt',
          'finishedAt',
          'cancelledAt',
          'cancelReason',
          'description',
          'rejectAt',
          'rejectReason',
          'updatedAt',
          'deletedAt',
        ],
        ['inspectionRequest.code', 'inspectionRequest.inspectionReport.code'],
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { warehouseStaffId: 'asc' },
          { poDeliveryId: 'asc' },
          { warehouseManagerId: 'asc' },
          { purchasingStaffId: 'asc' },
          { productionDepartmentId: 'asc' },
          { productionBatchId: 'asc' },
          { status: 'asc' },
          { type: 'asc' },
          { startedAt: 'asc' },
          { finishedAt: 'asc' },
          { cancelledAt: 'asc' },
          { cancelReason: 'asc' },
          { description: 'asc' },
          { rejectAt: 'asc' },
          { rejectReason: 'asc' },
          { updatedAt: 'asc' },
          { deletedAt: 'asc' },
        ],
      ),
    )
    filterDto: FilterDto<Prisma.ImportRequestWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.search(filterDto.findOptions),
      'Get import requests successfully',
    );
  }

  @Get('/statistic')
  async getStatistic() {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.getStatistic(),
      'Get import request statistic successfully',
    );
  }

  @Get('/enum')
  async getEnum() {
    return apiSuccess(
      HttpStatus.OK,
      this.importRequestService.getEnum(),
      'Get import request enums successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', CustomUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.findUnique(id),
      'Get import request successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateImportRequestDto: UpdateImportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.update(id, updateImportRequestDto),
      'Import request updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id', CustomUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.remove(id),
      'Import request deleted successfully',
    );
  }

  @Post(':id/manager-process')
  async managerProcess(
    @Param('id', IsImportRequestExistPipe)
    id: string,
    @Body() managerProcessDto: ManagerProcessDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.managerProcess(id, managerProcessDto),
      'Import request manager process successfully',
    );
  }

  @Post(':id/purchasing-staff-process')
  async purchasingStaffProcess(
    @Param('id', IsImportRequestExistPipe)
    id: string,
    @Body() purchasingStaffProcessDto: PurchasingStaffProcessDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.purchasingStaffCancelImportReq(
        id,
        purchasingStaffProcessDto,
      ),
      'Import request purchasing staff process successfully',
    );
  }
}
