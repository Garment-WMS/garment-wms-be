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
import { CreateImportRequestDto } from './dto/create-import-request.dto';
import { UpdateImportRequestDto } from './dto/update-import-request.dto';
import { ImportRequestService } from './import-request.service';

@Controller('import-request')
export class ImportRequestController {
  constructor(private readonly importRequestService: ImportRequestService) {}

  @Post()
  create(@Body() createImportRequestDto: CreateImportRequestDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      this.importRequestService.create(createImportRequestDto),
      'Import request created successfully',
    );
  }

  @Get()
  findAll() {
    return apiSuccess(
      HttpStatus.OK,
      this.importRequestService.findAll(),
      'Import requests fetched successfully',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      this.importRequestService.findOne(id),
      'Import request fetched successfully',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImportRequestDto: UpdateImportRequestDto,
  ) {
    return apiSuccess(
      HttpStatus.OK,
      this.importRequestService.update(id, updateImportRequestDto),
      'Import request updated successfully',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      this.importRequestService.remove(id),
      'Import request deleted successfully',
    );
  }
}
