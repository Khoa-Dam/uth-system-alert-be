import { Controller, Post, Query, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { ScraperCronService } from './scraper-cron.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
    constructor(
        private readonly scraperService: ScraperService,
        private readonly scraperCronService: ScraperCronService,
    ) { }

    /**
     * Trigger scraping wanted criminals from Bộ Công An website
     * Admin only endpoint
     */
    @Post('wanted-criminals')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Trigger scraping wanted criminals from Bộ Công An website (Admin only)' })
    @ApiQuery({ name: 'pages', description: 'Number of pages to scrape', required: false })
    @ApiResponse({ status: 200, description: 'Scraping completed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async scrapeWantedCriminals(@Query('pages') pages?: string) {
        const maxPages = pages ? parseInt(pages, 10) : 5;
        const criminals = await this.scraperService.scrapeWantedCriminals(maxPages);

        return {
            success: true,
            count: criminals.length,
            criminals,
            message: `Đã scrape ${criminals.length} đối tượng từ trang Bộ Công An`,
        };
    }

    /**
     * Get cron job status
     */
    @Get('status')
    @ApiOperation({ summary: 'Get scraper cron job status' })
    @ApiResponse({ status: 200, description: 'Returns cron job status' })
    async getStatus() {
        return this.scraperCronService.getStatus();
    }
}

