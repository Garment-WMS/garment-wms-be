import { PartialType } from '@nestjs/swagger';
import { CreateQuarterlyProductPlanDto } from './create-quarterly-product-plan.dto';

export class UpdateQuarterlyProductPlanDto extends PartialType(CreateQuarterlyProductPlanDto) {}
