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
import { ApiTags } from '@nestjs/swagger';
import { apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';
import { MaterialExportRequestService } from './material-export-request.service';

@ApiTags('material-export-request')
@Controller('material-export-request')
export class MaterialExportRequestController {
  constructor(
    private readonly materialExportRequestService: MaterialExportRequestService,
  ) {}

  @Post()
  async create(
    @Body() createMaterialExportRequestDto: CreateMaterialExportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.materialExportRequestService.create(
        createMaterialExportRequestDto,
      ),
      'Material export request created successfully',
    );
  }

  @Get()
  async search() {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.findAll(),
      'Search material export requests successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.findUnique(id),
      'Get one material export request successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMaterialExportRequestDto: UpdateMaterialExportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.update(
        id,
        updateMaterialExportRequestDto,
      ),
      'Material export request updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.materialExportRequestService.remove(id),
      'Material export request deleted successfully',
    );
  }
}
