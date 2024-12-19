import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMaterialExportReceiptDetailDto } from './dto/create-material-export-receipt-detail.dto';
import { UpdateMaterialExportReceiptDetailDto } from './dto/update-material-export-receipt-detail.dto';
import { MaterialExportReceiptDetailService } from './material-export-receipt-detail.service';

@Controller('material-export-receipt-detail')
export class MaterialExportReceiptDetailController {
  constructor(
    private readonly materialExportReceiptDetailService: MaterialExportReceiptDetailService,
  ) {}

  @Post()
  create(
    @Body()
    createMaterialExportReceiptDetailDto: CreateMaterialExportReceiptDetailDto,
  ) {
    return this.materialExportReceiptDetailService.create(
      createMaterialExportReceiptDetailDto,
    );
  }

  @Get()
  findAll() {
    return this.materialExportReceiptDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialExportReceiptDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateMaterialExportReceiptDetailDto: UpdateMaterialExportReceiptDetailDto,
  ) {
    return this.materialExportReceiptDetailService.update(
      +id,
      updateMaterialExportReceiptDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportReceiptDetailService.remove(+id);
  }
}
