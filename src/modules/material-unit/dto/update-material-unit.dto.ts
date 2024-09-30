import { PartialType } from '@nestjs/swagger';
import { CreateMaterialUnitDto } from './create-material-unit.dto';

export class UpdateMaterialUnitDto extends PartialType(CreateMaterialUnitDto) {}
