import { AllFilterPipeUnsafe } from '@chax-at/prisma-filter';
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
import { CreateMaterialPackageDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';
import { MaterialPackageService } from './material-package.service';

@Controller('material-package')
@ApiTags('Material Package')
export class MaterialPackageController {
  constructor(
    private readonly materialPackageService: MaterialPackageService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createMaterialVariantDto: CreateMaterialPackageDto) {
    return this.materialPackageService.create(createMaterialVariantDto);
  }

  @Get()
  getAllMaterialVariant(
    @Query(
      new AllFilterPipeUnsafe<any, Prisma.MaterialPackageWhereInput>([
        'material.name',
        'material.code',
        'material.materialType.name',
        'material.materialType.code',
        'material.materialType.id',
      ]),
    )
    filterOptions: FilterDto<Prisma.MaterialPackageWhereInput>,
  ) {
    return this.materialPackageService.findAll(filterOptions.findOptions);
  }

  @Get(':id')
  getMaterialVariantById(@Param('id', CustomUUIDPipe) id: string) {
    return this.materialPackageService.findByIdWithResponse(id);
  }

  @Get(':id/code')
  getMaterialReceiptChart(@Param('id') id: string) {
    return this.materialPackageService.findByMaterialCode(id);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', CustomUUIDPipe) id: string,
    @Body()
    updateMaterialVariantDto: UpdateMaterialVariantDto,
  ) {
    return this.materialPackageService.update(id, updateMaterialVariantDto);
  }
}
