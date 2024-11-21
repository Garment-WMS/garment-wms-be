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
}
