import { PartialType } from '@nestjs/swagger';
import { CreateGeneralSearchDto } from './create-general-search.dto';

export class UpdateGeneralSearchDto extends PartialType(CreateGeneralSearchDto) {}
