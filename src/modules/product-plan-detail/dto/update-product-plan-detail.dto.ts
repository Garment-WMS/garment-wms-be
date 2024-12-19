import { PartialType } from '@nestjs/swagger';
import { CreateProductPlanDetailDto } from './create-product-plan-detail.dto';

export class UpdateProductPlanDetailDto extends PartialType(CreateProductPlanDetailDto) {}
