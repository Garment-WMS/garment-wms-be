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
import { Prisma } from '@prisma/client';
import { apiSuccess } from 'src/common/dto/api-response';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';
import { MaterialExportReceiptService } from './material-export-receipt.service';

@Controller('material-export-receipt')
export class MaterialExportReceiptController {
  constructor(
    private readonly materialExportReceiptService: MaterialExportReceiptService,
  ) {}

  @Post()
  async create(
    @Body() createMaterialExportReceiptDto: CreateMaterialExportReceiptDto,
  ) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.materialExportReceiptService.create(
        createMaterialExportReceiptDto,
      ),
      'Material export receipt created successfully',
    );
  }

  @Get()
  findAll(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialExportReceiptWhereInput>(
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    filterDto: FilterDto<Prisma.MaterialExportReceiptWhereInput>,
  ) {
    return this.materialExportReceiptService.search(filterDto.findOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialExportReceiptService.findUnique(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return this.materialExportReceiptService.update(
      id,
      updateMaterialExportReceiptDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportReceiptService.remove(id);
  }
}
