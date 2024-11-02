import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportPlanController } from './inventory-report-plan.controller';
import { InventoryReportPlanService } from './inventory-report-plan.service';

describe('InventoryReportPlanController', () => {
  let controller: InventoryReportPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportPlanController],
      providers: [InventoryReportPlanService],
    }).compile();

    controller = module.get<InventoryReportPlanController>(InventoryReportPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
