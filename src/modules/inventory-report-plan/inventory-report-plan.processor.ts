import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InventoryReportPlanService } from './inventory-report-plan.service';

@Processor('inventory-report-plan')
export class InventoryReportPlanProcessor extends WorkerHost {
  constructor(
    private readonly inventoryReportPlanService: InventoryReportPlanService,
    
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name.toString()) {
      case 'start-await-inventory-report-plan': {
        return await this.startAwaitInventoryReportPlan();
      }
    }
  }

  async startAwaitInventoryReportPlan() {
    await this.inventoryReportPlanService.startAwaitInventoryReportPlan();
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
