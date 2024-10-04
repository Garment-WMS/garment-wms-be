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
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';
import { ImportRequestService } from './import-request.service';

@Controller('import-request')
@ApiTags('import-request')
export class ImportRequestController {
  constructor(private readonly importRequestService: ImportRequestService) {}

  @Post()
  async create(@Body() createImportRequestDto: CreateImportRequestDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.importRequestService.create(createImportRequestDto),
      'Import request created successfully',
    );
  }

  @Get()
  async findAll() {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.findAll(),
      'Import requests fetched successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', new CustomUUIDPipe()) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.findOne(id),
      'Import request fetched successfully',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', new CustomUUIDPipe()) id: string,
    @Body() updateImportRequestDto: UpdateImportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.update(id, updateImportRequestDto),
      'Import request updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id', new CustomUUIDPipe()) id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.importRequestService.remove(id),
      'Import request deleted successfully',
    );
  }
}
