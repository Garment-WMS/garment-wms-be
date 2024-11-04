import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportPlanDetailController } from './inventory-report-plan-detail.controller';
import { InventoryReportPlanDetailService } from './inventory-report-plan-detail.service';

describe('InventoryReportPlanDetailController', () => {
  let controller: InventoryReportPlanDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportPlanDetailController],
      providers: [InventoryReportPlanDetailService],
    }).compile();

    controller = module.get<InventoryReportPlanDetailController>(InventoryReportPlanDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
