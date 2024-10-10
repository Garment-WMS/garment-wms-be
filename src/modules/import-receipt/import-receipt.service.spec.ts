import { Test, TestingModule } from '@nestjs/testing';
import { ImportReceiptService } from './import-receipt.service';

describe('ImportReceiptService', () => {
  let service: ImportReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportReceiptService],
    }).compile();

    service = module.get<ImportReceiptService>(ImportReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
