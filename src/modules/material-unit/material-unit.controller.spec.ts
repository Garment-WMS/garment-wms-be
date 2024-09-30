import { Test, TestingModule } from '@nestjs/testing';
import { MaterialUnitController } from './material-unit.controller';
import { MaterialUnitService } from './material-unit.service';

describe('MaterialUnitController', () => {
  let controller: MaterialUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialUnitController],
      providers: [MaterialUnitService],
    }).compile();

    controller = module.get<MaterialUnitController>(MaterialUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
