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
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { ManagerApproveExportRequestDto } from './dto/manager-approve-export-request.dto';
import { ProductionStaffDepartmentDto } from './dto/production-department-approve.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';
import { MaterialExportRequestService } from './material-export-request.service';

@ApiTags('material-export-request')
@Controller('material-export-request')
export class MaterialExportRequestController {
  constructor(
    private readonly materialExportRequestService: MaterialExportRequestService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PRODUCTION_DEPARTMENT)
  async create(
    @Body() createMaterialExportRequestDto: CreateMaterialExportRequestDto,
    @GetUser() productionDepartment: AuthenUser,
  ) {
    createMaterialExportRequestDto.productionDepartmentId =
      productionDepartment.productionDepartmentId;
    return apiSuccess(
      HttpStatus.CREATED,
      await this.materialExportRequestService.create(
        createMaterialExportRequestDto,
      ),
      'Material export request created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportRequestWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterDto: FilterDto<Prisma.MaterialExportRequestWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.search(filterDto.findOptions),
      'Search material export requests successfully',
    );
  }

  @Get('/enum')
  async getEnum() {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.getEnum(),
      'Get material export request enum successfully',
    );
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RoleCode.WAREHOUSE_MANAGER,
    RoleCode.WAREHOUSE_STAFF,
    RoleCode.PRODUCTION_DEPARTMENT,
  )
  async getByUser(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportRequestWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialExportRequestWhereInput>,
    @GetUser() user: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.getByUserToken(
        user,
        filterOptions.findOptions,
      ),
      'Search material export requests successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.findUnique(id),
      'Get one material export request successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMaterialExportRequestDto: UpdateMaterialExportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.update(
        id,
        updateMaterialExportRequestDto,
      ),
      'Material export request updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.remove(id),
      'Material export request deleted successfully',
    );
  }

  @Post(':id/manager-approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.WAREHOUSE_MANAGER)
  async managerApprove(
    @Param('id') id: string,
    @Body() dto: ManagerApproveExportRequestDto,
    @GetUser() warehouseManager: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.managerApprove(
        id,
        dto,
        warehouseManager.warehouseManagerId,
      ),
      'Manager approve material export request successfully',
    );
  }

  @Post(':id/production-department-approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PRODUCTION_DEPARTMENT)
  async productionDepartmentApprove(
    @Param('id') id: string,
    @Body() dto: ProductionStaffDepartmentDto,
    @GetUser() productionDepartment: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.productionDepartmentApprove(
        id,
        dto,
        productionDepartment.productionDepartmentId,
      ),
      'Production department approve material export request successfully',
    );
  }
}
