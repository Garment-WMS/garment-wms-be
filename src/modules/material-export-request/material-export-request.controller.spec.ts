import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportRequestController } from './material-export-request.controller';
import { MaterialExportRequestService } from './material-export-request.service';

describe('MaterialExportRequestController', () => {
  let controller: MaterialExportRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialExportRequestController],
      providers: [MaterialExportRequestService],
    }).compile();

    controller = module.get<MaterialExportRequestController>(MaterialExportRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
