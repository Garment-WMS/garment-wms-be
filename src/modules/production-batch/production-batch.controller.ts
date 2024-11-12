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
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ProductionBatchService } from './production-batch.service';

@ApiTags('production-batch')
@Controller('production-batch')
export class ProductionBatchController {
  constructor(
    private readonly productionBatchService: ProductionBatchService,
  ) {}

  @Post()
  async create(@Body() createProductionBatchDto: CreateProductionBatchDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.productionBatchService.create(createProductionBatchDto),
      'Production batch created successfully',
    );
  }

  @Get()
  async search(
    @Query(
      new AllFilterPipeUnsafe(
        ['productionPlanDetail.id', 'productionPlanDetail.code'],
        [{ createAt: 'desc' }],
      ),
    )
    filterDto: FilterDto<Prisma.ProductionBatchWhereInput>,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.search(filterDto.findOptions),
      'Production batch searched successfully',
    );
  }

  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.findUnique(id),
      'Production batch fetched successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductionBatchDto: UpdateProductionBatchDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.update(id, updateProductionBatchDto),
      'Production batch updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.productionBatchService.remove(id),
      'Production batch deleted successfully',
    );
  }
}
