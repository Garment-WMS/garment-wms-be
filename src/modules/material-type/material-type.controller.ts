import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomUUIDPipe } from 'src/common/pipe/custom-uuid.pipe';
import { CreateMaterialTypeDto } from './dto/create-material-type.dto';
import { MaterialTypeService } from './material-type.service';

@Controller('material-type')
@ApiTags('Material Type')
export class MaterialTypeController {
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({
    status: 201,
    description: 'Material Type created successfully',
  })
  @ApiResponse({ status: 400, description: 'Material Type not created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 409,
    description: 'Material code duplicate',
    example: {
      statusCode: 409,
      data: null,
      message: 'A unique constraint was violated on a record',
      errors: [
        {
          property: ['code'],
          contexts: {},
          children: [],
        },
      ],
    },
  })
  async create(@Body() createMaterialTypeDto: CreateMaterialTypeDto) {
    return await this.materialTypeService.create(createMaterialTypeDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of Material Type' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    return await this.materialTypeService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Material Type found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id', new CustomUUIDPipe()) id: string) {
    return this.materialTypeService.findOne(id);
  }
}
