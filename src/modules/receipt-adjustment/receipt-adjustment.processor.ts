import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CreateReceiptAdjustmentDto } from './dto/create-receipt-adjustment.dto';
import { ReceiptAdjustmentService } from './receipt-adjustment.service';

@Processor('receipt-adjustment')
export class ReceiptAdjustmentProcessor extends WorkerHost {
  constructor(
    private readonly receiptAdjustmentService: ReceiptAdjustmentService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {

    switch (job.name.toString()) {
      case 'create-receipt-adjustment': {
        console.log('create-receipt-adjustment');
        return await this.createReceiptAdjustment(job);
      }
    }
  }


  async createReceiptAdjustment(job: Job<CreateReceiptAdjustmentDto>) {
    const createReceiptAdjustmentDto = job.data;
    const result = await this.receiptAdjustmentService.create(
      createReceiptAdjustmentDto,
    );
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
