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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PURCHASING_STAFF)
  async create(
    @GetUser() purchasingStaff: AuthenUser,
    @Body() createImportRequestDto: CreateImportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.importRequestService.create(
        purchasingStaff,
        createImportRequestDto,
      ),
      'Import request created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.ImportRequestWhereInput>(
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  async managerProcess(
    @Param('id', IsImportRequestExistPipe)
    id: string,
    @Body() managerProcessDto: ManagerProcessDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.managerProcess(id, managerProcessDto),
      'Manager process import request successfully',
    );
  }

  @Post(':id/purchasing-staff-process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PURCHASING_STAFF)
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
