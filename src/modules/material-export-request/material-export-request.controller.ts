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
import { ApiTags } from '@nestjs/swagger';
import { Prisma, RoleCode } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get_user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { CheckQuantityVariantDto } from './dto/check-quantity-variant.dto';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { ManagerApproveExportRequestDto } from './dto/manager-approve-export-request.dto';
import { ProductionStaffDepartmentProcessDto } from './dto/production-department-approve.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';
import { MaterialExportRequestService } from './material-export-request.service';
import { IsMaterialExportRequestExistPipe } from './validator/is-material-export-request-exist.pipe';

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
        productionDepartment,
      ),
      'Material export request created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportRequestWhereInput>(
        [],
        [{ createdAt: 'desc' }],
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
        [{ createdAt: 'desc' }],
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
    @Param('id', IsMaterialExportRequestExistPipe)
    materialExportRequestId: string,
    @Body() dto: ManagerApproveExportRequestDto,
    @GetUser() warehouseManager: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.managerApprove(
        materialExportRequestId,
        dto,
        warehouseManager,
      ),
      'Manager approve material export request successfully',
    );
  }

  @Post('/production-department-process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.PRODUCTION_DEPARTMENT)
  async productionDepartmentApprove(
    @Body() dto: ProductionStaffDepartmentProcessDto,
    @GetUser() productionDepartment: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.productionDepartmentApprove(
        dto,
        productionDepartment,
      ),
      'Production department approve material export request successfully',
    );
  }

  @Get('check-quantity/:id')
  async checkQuantity(@Param('id', ParseUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.checkQuantityEnoughForExportRequest(
        id,
      ),
      'Check quantity successfully',
    );
  }

  @Post('check-quantity-variant')
  async checkQuantityVariant(
    @Body() checkQuantityVariantDto: CheckQuantityVariantDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.checkQuantityEnoughForVariant(
        checkQuantityVariantDto.materialVariantId,
        checkQuantityVariantDto.quantityByUom,
      ),
      'Check quantity successfully',
    );
  }
}
