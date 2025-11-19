import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ScraperService } from './scraper.service';
import { WantedCriminalsService } from '../wanted-criminals/wanted-criminals.service';

/**
 * Standalone script to run scraper and import data to database
 * Usage: ts-node src/scraper/run-scraper.ts [pages]
 */
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const scraperService = app.get(ScraperService);
    const wantedCriminalsService = app.get(WantedCriminalsService);

    // Get number of pages from command line args
    const pages = process.argv[2] ? parseInt(process.argv[2], 10) : 5;

    console.log(`🚀 Starting scraper for ${pages} pages...`);

    try {
        // Scrape data
        const criminals = await scraperService.scrapeWantedCriminals(pages);

        console.log(`✅ Scraped ${criminals.length} criminals`);

        // Import to database
        let imported = 0;
        let duplicates = 0;

        for (const criminal of criminals) {
            try {
                // Check if already exists (by name and crime)
                const existing = await wantedCriminalsService.findAll();
                const isDuplicate = existing.some(
                    c => c.name === criminal.name && c.crime === criminal.crime
                );

                if (!isDuplicate) {
                    await wantedCriminalsService.create(criminal as any);
                    imported++;
                    console.log(`✓ Imported: ${criminal.name}`);
                } else {
                    duplicates++;
                    console.log(`⊘ Skipped duplicate: ${criminal.name}`);
                }
            } catch (error) {
                console.error(`✗ Error importing ${criminal.name}:`, error.message);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`  Total scraped: ${criminals.length}`);
        console.log(`  Imported: ${imported}`);
        console.log(`  Duplicates: ${duplicates}`);
        console.log(`  Errors: ${criminals.length - imported - duplicates}`);

    } catch (error) {
        console.error('❌ Scraper error:', error.message);
        process.exit(1);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();


