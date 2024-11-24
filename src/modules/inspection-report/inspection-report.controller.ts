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
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
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
  async create(@Body() createInspectionReportDto: CreateInspectionReportDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.inspectionReportService.create(createInspectionReportDto),
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
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { code: 'asc' },
          { inspectionRequestId: 'asc' },
          // { inspectionDepartmentId: 'asc' },
        ],
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
   getQualityRate(

  ) {
    return this.inspectionReportService.getQualityRate();
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
}
