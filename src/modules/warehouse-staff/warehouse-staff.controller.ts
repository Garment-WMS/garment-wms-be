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
import { WarehouseStaffService } from './warehouse-staff.service';

@Controller('warehouse-staff')
export class WarehouseStaffController {
  constructor(private readonly warehouseStaffService: WarehouseStaffService) {}

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.WarehouseStaffWhereInput>(
        ['importRequest.id', 'importReceipt.id'],
        [{ id: 'asc', createdAt: 'desc', updatedAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.WarehouseStaffWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.warehouseStaffService.search(filterDto.findOptions),
      'Warehouse Staffs fetched successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.warehouseStaffService.findUnique(id),
      'Warehouse Staff fetched successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.warehouseStaffService.remove(id),
      'Warehouse Staff removed successfully',
    );
  }
}
