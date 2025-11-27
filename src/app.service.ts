import { Injectable } from '@nestjs/common';
import { WantedCriminalsService } from './wanted-criminals/wanted-criminals.service';

@Injectable()
export class AppService {
  constructor(
    private wantedCriminalsService: WantedCriminalsService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getHomePageData() {
    const [wantedCriminalsResult, wantedStatistics] = await Promise.all([
      this.wantedCriminalsService.findAll(1, 6),
      this.getWantedCriminalsStatistics(),
    ]);

    return {
      recentWantedCriminals: wantedCriminalsResult.data,
      statistics: wantedStatistics,
    };
  }

  private async getWantedCriminalsStatistics() {
    const allWantedResult = await this.wantedCriminalsService.findAll(1, 1);

    return {
      totalWanted: allWantedResult.total,
    };
  }
}
