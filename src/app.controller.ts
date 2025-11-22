import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('home')
  @ApiOperation({ summary: 'Get home page data' })
  @ApiResponse({ status: 200, description: 'Returns home page statistics' })
  async getHomePage() {
    return this.appService.getHomePageData();
  }
}
