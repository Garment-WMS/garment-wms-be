import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMaterialExportRequestDetailDto } from './dto/create-material-export-request-detail.dto';
import { UpdateMaterialExportRequestDetailDto } from './dto/update-material-export-request-detail.dto';
import { MaterialExportRequestDetailService } from './material-export-request-detail.service';

@Controller('material-export-request-detail')
export class MaterialExportRequestDetailController {
  constructor(
    private readonly materialExportRequestDetailService: MaterialExportRequestDetailService,
  ) {}

  @Post()
  create(
    @Body()
    createMaterialExportRequestDetailDto: CreateMaterialExportRequestDetailDto,
  ) {
    return this.materialExportRequestDetailService.create(
      createMaterialExportRequestDetailDto,
    );
  }

  @Get()
  findAll() {
    return this.materialExportRequestDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialExportRequestDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateMaterialExportRequestDetailDto: UpdateMaterialExportRequestDetailDto,
  ) {
    return this.materialExportRequestDetailService.update(
      +id,
      updateMaterialExportRequestDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportRequestDetailService.remove(+id);
  }
}
