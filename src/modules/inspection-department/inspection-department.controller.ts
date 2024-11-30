import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { InspectionDepartmentService } from './inspection-department.service';

@Controller('inspection-department')
export class InspectionDepartmentController {
  constructor(
    private readonly inspectionDepartmentService: InspectionDepartmentService,
  ) {}

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.InspectionDepartmentWhereInput>(
        ['inspectionRequest.id', 'inspectionReport.id'],
        [{ createdAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.InspectionDepartmentWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionDepartmentService.search(filterDto.findOptions),
      'Get inspection department successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionDepartmentService.findUnique(id),
      'Get inspection department successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionDepartmentService.remove(id),
      'Delete inspection department successfully',
    );
  }
}
