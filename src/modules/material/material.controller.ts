import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialService } from './material.service';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Controller('material')
@ApiTags('Material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  getAllMaterial() {
    return this.materialService.findAll();
  }

  @Get(':id')
  getMaterialById(@Param('id', CustomUUIDPipe) id: string) {
    return this.materialService.findByIdWithResponse(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateMaterial(
    @Param('id', new CustomUUIDPipe()) id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(id, updateMaterialDto);
  }
}
