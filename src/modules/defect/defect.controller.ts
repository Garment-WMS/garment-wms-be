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
import { DefectService } from './defect.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';

@Controller('defect')
export class DefectController {
  constructor(private readonly defectService: DefectService) {}

  @Post()
  async create(@Body() createDefectDto: CreateDefectDto) {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.defectService.create(createDefectDto),
      'Defect created successfully',
    );
  }

  @Get()
  async findAll() {
    return apiSuccess(
      HttpStatus.OK,
      await this.defectService.findAll(),
      'Defects retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return apiSuccess(
      HttpStatus.OK,
      await this.defectService.findOne(id),
      'Defect retrieved successfully',
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDefectDto: UpdateDefectDto) {
    return this.defectService.update(+id, updateDefectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defectService.remove(+id);
  }

  @Post('/gen-defect')
  async genDefect() {
    return apiSuccess(
      HttpStatus.CREATED,
      await this.defectService.genDefect(),
      'Defect created successfully',
    );
  }
}
