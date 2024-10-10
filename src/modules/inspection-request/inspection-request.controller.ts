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
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';
import { InspectionRequestService } from './inspection-request.service';

@Controller('inspection-request')
export class InspectionRequestController {
  constructor(
    private readonly inspectionRequestService: InspectionRequestService,
  ) {}

  @Get()
  async search(
    @Query(
      new DirectFilterPipe<
        UpdateInspectionRequestDto,
        Prisma.InspectionRequestWhereInput
      >(
        ['id', 'inspectionDepartmentId'],
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterOptions: FilterDto<Prisma.InspectionRequestWhereInput>,
  ) {
    return this.inspectionRequestService.search(filterOptions.findOptions);
  }

  @Get(':id')
  async findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.inspectionRequestService.findUnique(id);
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
