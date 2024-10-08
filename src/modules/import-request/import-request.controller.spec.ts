import { Test, TestingModule } from '@nestjs/testing';
import { ImportRequestController } from './import-request.controller';
import { ImportRequestService } from './import-request.service';

describe('ImportRequestController', () => {
  let controller: ImportRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportRequestController],
      providers: [ImportRequestService],
    }).compile();

    controller = module.get<ImportRequestController>(ImportRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
