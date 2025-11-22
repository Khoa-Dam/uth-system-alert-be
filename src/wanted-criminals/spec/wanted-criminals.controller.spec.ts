import { Test, TestingModule } from '@nestjs/testing';
import { WantedCriminalsController } from '../wanted-criminals.controller';

describe('WantedCriminalsController', () => {
  let controller: WantedCriminalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WantedCriminalsController],
    }).compile();

    controller = module.get<WantedCriminalsController>(WantedCriminalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
