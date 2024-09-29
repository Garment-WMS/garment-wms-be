import { Test, TestingModule } from '@nestjs/testing';
import { ImportRequestDetailController } from './import-request-detail.controller';
import { ImportRequestDetailService } from './import-request-detail.service';

describe('ImportRequestDetailController', () => {
  let controller: ImportRequestDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportRequestDetailController],
      providers: [ImportRequestDetailService],
    }).compile();

    controller = module.get<ImportRequestDetailController>(ImportRequestDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
