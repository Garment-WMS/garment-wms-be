import { Injectable } from '@nestjs/common';
import { CreateQuarterlyProductPlanDto } from './dto/create-quarterly-product-plan.dto';
import { UpdateQuarterlyProductPlanDto } from './dto/update-quarterly-product-plan.dto';

@Injectable()
export class QuarterlyProductPlanService {
  create(createQuarterlyProductPlanDto: CreateQuarterlyProductPlanDto) {
    return 'This action adds a new quarterlyProductPlan';
  }

  findAll() {
    return `This action returns all quarterlyProductPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quarterlyProductPlan`;
  }

  update(id: number, updateQuarterlyProductPlanDto: UpdateQuarterlyProductPlanDto) {
    return `This action updates a #${id} quarterlyProductPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} quarterlyProductPlan`;
  }
}
