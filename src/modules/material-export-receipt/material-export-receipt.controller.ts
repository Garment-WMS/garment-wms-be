import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';
import { MaterialExportReceiptService } from './material-export-receipt.service';

@Controller('material-export-receipt')
export class MaterialExportReceiptController {
  constructor(
    private readonly materialExportReceiptService: MaterialExportReceiptService,
  ) {}

  @Post()
  create(
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
  findAll() {
    return this.materialExportReceiptService.search();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialExportReceiptService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto,
  ) {
    return this.materialExportReceiptService.update(
      +id,
      updateMaterialExportReceiptDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialExportReceiptService.remove(+id);
  }
}
