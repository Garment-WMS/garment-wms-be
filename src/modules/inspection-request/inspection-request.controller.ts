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
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';
import { InspectionRequestService } from './inspection-request.service';

@Controller('inspection-request')
@ApiTags('inspection-request')
export class InspectionRequestController {
  constructor(
    private readonly inspectionRequestService: InspectionRequestService,
  ) {}

  @Get()
  async search(
    @Query(
      new DirectFilterPipe<any, Prisma.InspectionRequestWhereInput>(
        [
          'id',
          'inspectionDepartmentId',
          'purchasingStaffId',
          'importRequestId',
          'status',
          'createdAt',
        ],
        [],
        [
          { createdAt: 'desc' },
          { id: 'asc' },
          { status: 'asc' },
          { inspectionDepartmentId: 'asc' },
          { purchasingStaffId: 'asc' },
          { importRequestId: 'asc' },
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.InspectionRequestWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.search(filterOptions.findOptions),
      'Get import request successfully',
    );
  }

  @Get('enum')
  async getEnum() {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.getEnum(),
      'Get import request enum successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', CustomUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.findUnique(id),
      'Get import request successfully',
    );
  }

  @Post()
  async create(@Body() createInspectionRequestDto: CreateInspectionRequestDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.inspectionRequestService.create(createInspectionRequestDto),
      'Create import request successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body() updateInspectionRequestDto: UpdateInspectionRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.update(
        id,
        updateInspectionRequestDto,
      ),
      'Update import request successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id', CustomUUIDPipe) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.inspectionRequestService.remove(id),
      'Delete import request successfully',
    );
  }
}
