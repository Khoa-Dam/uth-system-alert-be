import { Test, TestingModule } from '@nestjs/testing';
import { WantedCriminalsService } from '../wanted-criminals.service';

describe('WantedCriminalsService', () => {
  let service: WantedCriminalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WantedCriminalsService],
    }).compile();

    service = module.get<WantedCriminalsService>(WantedCriminalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
