import { Test, TestingModule } from '@nestjs/testing';
import { MaterialReceiptController } from './material-receipt.controller';
import { MaterialReceiptService } from './material-receipt.service';

describe('MaterialReceiptController', () => {
  let controller: MaterialReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialReceiptController],
      providers: [MaterialReceiptService],
    }).compile();

    controller = module.get<MaterialReceiptController>(MaterialReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
