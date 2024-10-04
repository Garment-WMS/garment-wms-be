import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  getAllMaterialVariant() {
    return this.materialVariantService.findAll();
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', new CustomUUIDPipe()) id: string,
    @Body()
    updateMaterialVariantDto: UpdateMaterialVariantDto,
  ) {
    return this.materialVariantService.update(id, updateMaterialVariantDto);
  }
}
