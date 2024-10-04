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
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { SearchImportQueryDto } from './dto/import-request/search-import-query.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';
import { ImportRequestService } from './import-request.service';

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
      new DirectFilterPipe<
        SearchImportQueryDto,
        Prisma.ImportRequestWhereInput
      >(
        [
          'id',
          'createdAt',
          'type',
          'warehouseManagerId',
          'purchasingStaffId',
          'warehouseStaffId',
          'poDeliveryId',
          'status',
        ],
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterDto: SearchImportQueryDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.search(filterDto.findOptions),
      'Get import requests successfully',
    );
  }

  @Get('/enum')
  async getEnum() {
    return apiSuccess(
      HttpStatus.OK,
      this.importRequestService.getEnum(),
      'Get import request status successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', new CustomUUIDPipe()) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.findOne(id),
      'Get import request successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', new CustomUUIDPipe()) id: string,
    @Body() updateImportRequestDto: UpdateImportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.update(id, updateImportRequestDto),
      'Import request updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id', new CustomUUIDPipe()) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.remove(id),
      'Import request deleted successfully',
    );
  }
}
