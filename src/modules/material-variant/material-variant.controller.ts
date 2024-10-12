import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/common/dto/filter-query.dto';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateMaterialVariantDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';
import { MaterialVariantService } from './material-variant.service';

@Controller('material-variant')
@ApiTags('Material Variant')
export class MaterialVariantController {
  constructor(
    private readonly materialVariantService: MaterialVariantService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createMaterialVariantDto: CreateMaterialVariantDto) {
    return this.materialVariantService.create(createMaterialVariantDto);
  }

  @Get()
  getAllMaterialVariant(
    @Query(
      new DirectFilterPipe<any, Prisma.MaterialVariantWhereInput>(
        ['id', 'materialId', 'createdAt', 'updatedAt', 'name', 'code'],
        [
          'material.name',
          'material.code',
          'material.materialType.name',
          'material.materialType.code',
          'material.materialType.id',
        ],
      ),
    )
    filterOptions: FilterDto<Prisma.MaterialVariantWhereInput>,
  ) {
    return this.materialVariantService.findAll(filterOptions.findOptions);
  }

  @Get(':id')
  getMaterialVariantById(@Param('id', CustomUUIDPipe) id: string) {
    return this.materialVariantService.findByIdWithResponse(id);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body()
    updateMaterialVariantDto: UpdateMaterialVariantDto,
  ) {
    return this.materialVariantService.update(id, updateMaterialVariantDto);
  }
}
