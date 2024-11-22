import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportReceiptController } from './material-export-receipt.controller';
import { MaterialExportReceiptService } from './material-export-receipt.service';

describe('MaterialExportReceiptController', () => {
  let controller: MaterialExportReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialExportReceiptController],
      providers: [MaterialExportReceiptService],
    }).compile();

    controller = module.get<MaterialExportReceiptController>(MaterialExportReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
