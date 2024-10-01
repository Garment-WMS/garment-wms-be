import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateUomDto } from './dto/create-uom.dto';
import { UomService } from './uom.service';

@Controller('uom')
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUomDto: CreateUomDto) {
    return this.uomService.create(createUomDto);
  }

  @Get()
  findAll() {
    return this.uomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new CustomUUIDPipe()) id: string) {
    return 'Find one';
  }
}
