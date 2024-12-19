import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { ImportReceiptService } from './import-receipt.service';

@Processor('import-receipt')
export class ImportReceiptProcessor extends WorkerHost {
  constructor(
    private readonly importReceiptService: ImportReceiptService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    console.log('job.name.toString()', job.name.toString());
    switch (job.name.toString()) {
      case 'check-last-importing-receipt': {
        return await this.isLastImportingReceipt();
      }
    }
  }

  async isLastImportingReceipt() {
    const isLastImportingReceipt =
      await this.importReceiptService.checkIsLastImportingImportReceipt();
    if (isLastImportingReceipt) {
      this.eventEmitter.emit('start-await-inventory-report-plan');
    }
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
