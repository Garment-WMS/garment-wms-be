import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportRequestDetailController } from './material-export-request-detail.controller';
import { MaterialExportRequestDetailService } from './material-export-request-detail.service';

describe('MaterialExportRequestDetailController', () => {
  let controller: MaterialExportRequestDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialExportRequestDetailController],
      providers: [MaterialExportRequestDetailService],
    }).compile();

    controller = module.get<MaterialExportRequestDetailController>(MaterialExportRequestDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
