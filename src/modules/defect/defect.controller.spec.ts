import { Test, TestingModule } from '@nestjs/testing';
import { DefectController } from './defect.controller';
import { DefectService } from './defect.service';

describe('DefectController', () => {
  let controller: DefectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefectController],
      providers: [DefectService],
    }).compile();

    controller = module.get<DefectController>(DefectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
