import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScraperService } from './scraper.service';
import { WantedCriminalsService } from '../wanted-criminals/wanted-criminals.service';

@Injectable()
export class ScraperCronService {
    private readonly logger = new Logger(ScraperCronService.name);
    private isRunning = false;

    constructor(
        private readonly scraperService: ScraperService,
        private readonly wantedCriminalsService: WantedCriminalsService,
    ) { }

    /**
     * Chạy scraping mỗi ngày lúc 2:00 AM
     * Cron format: At 02:00 AM every day
     */
    @Cron('0 2 * * *', {
        name: 'daily-wanted-criminals-scraper',
        timeZone: 'Asia/Ho_Chi_Minh',
    })
    async handleDailyScraping() {
        if (this.isRunning) {
            this.logger.warn('Previous scraping job is still running, skipping...');
            return;
        }

        this.isRunning = true;
        this.logger.log('🕐 Starting daily wanted criminals scraping job...');

        try {
            const maxPages = parseInt(process.env.SCRAPER_DAILY_PAGES || '10', 10);
            const criminals = await this.scraperService.scrapeWantedCriminals(maxPages);

            this.logger.log(`✅ Scraped ${criminals.length} criminals`);

            // Import to database
            let imported = 0;
            let duplicates = 0;

            for (const criminal of criminals) {
                try {
                    // Check if already exists
                    const existing = await this.wantedCriminalsService.findAll();
                    const isDuplicate = existing.some(
                        c => c.name === criminal.name && c.crime === criminal.crime
                    );

                    if (!isDuplicate) {
                        await this.wantedCriminalsService.create(criminal as any);
                        imported++;
                        this.logger.log(`✓ Imported: ${criminal.name}`);
                    } else {
                        duplicates++;
                        this.logger.log(`⊘ Skipped duplicate: ${criminal.name}`);
                    }
                } catch (error) {
                    this.logger.error(`✗ Error importing ${criminal.name}:`, error.message);
                }
            }

            this.logger.log('\n📊 Daily Scraping Summary:');
            this.logger.log(`  Total scraped: ${criminals.length}`);
            this.logger.log(`  Imported: ${imported}`);
            this.logger.log(`  Duplicates: ${duplicates}`);
            this.logger.log(`  Errors: ${criminals.length - imported - duplicates}`);

        } catch (error) {
            this.logger.error('❌ Daily scraping job error:', error.message);
        } finally {
            this.isRunning = false;
            this.logger.log('✅ Daily scraping job completed');
        }
    }

    /**
     * Chạy scraping mỗi tuần lúc 3:00 AM ngày Chủ Nhật (để scrape nhiều trang hơn)
     * Cron format: At 03:00 AM on Sunday
     */
    @Cron('0 3 * * 0', {
        name: 'weekly-full-scraper',
        timeZone: 'Asia/Ho_Chi_Minh',
    })
    async handleWeeklyFullScraping() {
        if (this.isRunning) {
            this.logger.warn('Previous scraping job is still running, skipping weekly job...');
            return;
        }

        this.isRunning = true;
        this.logger.log('🕐 Starting weekly full wanted criminals scraping job...');

        try {
            const maxPages = parseInt(process.env.SCRAPER_WEEKLY_PAGES || '50', 10);
            const criminals = await this.scraperService.scrapeWantedCriminals(maxPages);

            this.logger.log(`✅ Scraped ${criminals.length} criminals`);

            // Import to database
            let imported = 0;
            let duplicates = 0;

            for (const criminal of criminals) {
                try {
                    const existing = await this.wantedCriminalsService.findAll();
                    const isDuplicate = existing.some(
                        c => c.name === criminal.name && c.crime === criminal.crime
                    );

                    if (!isDuplicate) {
                        await this.wantedCriminalsService.create(criminal as any);
                        imported++;
                    } else {
                        duplicates++;
                    }
                } catch (error) {
                    this.logger.error(`✗ Error importing ${criminal.name}:`, error.message);
                }
            }

            this.logger.log('\n📊 Weekly Full Scraping Summary:');
            this.logger.log(`  Total scraped: ${criminals.length}`);
            this.logger.log(`  Imported: ${imported}`);
            this.logger.log(`  Duplicates: ${duplicates}`);

        } catch (error) {
            this.logger.error('❌ Weekly full scraping job error:', error.message);
        } finally {
            this.isRunning = false;
            this.logger.log('✅ Weekly full scraping job completed');
        }
    }

    /**
     * Get current scraping status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            dailySchedule: '2:00 AM (Asia/Ho_Chi_Minh)',
            weeklySchedule: '3:00 AM Sunday (Asia/Ho_Chi_Minh)',
        };
    }
}



