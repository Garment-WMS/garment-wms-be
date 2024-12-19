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
import { CreateInspectionReportDto } from './dto/inspection-report/create-inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/inspection-report/update-inspection-report.dto';
import { InspectionReportService } from './inspection-report.service';

@ApiTags('inspection-report')
@Controller('inspection-report')
export class InspectionReportController {
  constructor(
    private readonly inspectionReportService: InspectionReportService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.INSPECTION_DEPARTMENT)
  async create(
    @Body() createInspectionReportDto: CreateInspectionReportDto,
    @GetUser() user: AuthenUser,
  ) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.inspectionReportService.create(
        createInspectionReportDto,
        user,
      ),
      'Inspection report created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<
        UpdateInspectionReportDto,
        Prisma.InspectionReportWhereInput
      >(
        ['inspectionRequest.importRequestId', 'inspectionRequest.code'],
        [{ createdAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.InspectionReportWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionReportService.search(filterDto.findOptions),
      'Get all inspection report successfully',
    );
  }

  @Get('/quality-rate')
  getQualityRate(@Param('from') from: Date, @Param('to') to: Date) {
    return this.inspectionReportService.getQualityRate(from, to);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionReportService.findUnique(id),
      'Get inspection report successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInspectionReportDto: UpdateInspectionReportDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionReportService.update(id, updateInspectionReportDto),
      'Inspection report updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionReportService.remove(id),
      'Inspection report deleted successfully',
    );
  }

  @Post('/skip-by-inspection-request-id/:inspectionRequestId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.INSPECTION_DEPARTMENT)
  async skipByInspectionRequestId(
    @GetUser() user: AuthenUser,
    @Param('inspectionRequestId') inspectionRequestId: string,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionReportService.skipByInspectionRequestId(
        inspectionRequestId,
        user,
      ),
      'Inspection report skipped successfully',
    );
  }
}
