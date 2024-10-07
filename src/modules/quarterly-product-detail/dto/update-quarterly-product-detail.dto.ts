import { PartialType } from '@nestjs/swagger';
import { CreateQuarterlyProductDetailDto } from './create-quarterly-product-detail.dto';

export class UpdateQuarterlyProductDetailDto extends PartialType(CreateQuarterlyProductDetailDto) {}
