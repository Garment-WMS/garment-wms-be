import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialService } from './material.service';

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
}
