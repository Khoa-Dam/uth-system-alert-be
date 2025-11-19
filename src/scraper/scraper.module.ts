import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ScraperCronService } from './scraper-cron.service';
import { AuthModule } from '../auth/auth.module';
import { WantedCriminalsModule } from '../wanted-criminals/wanted-criminals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
    imports: [
        AuthModule,
        WantedCriminalsModule,
        TypeOrmModule.forFeature([User]),
    ],
    providers: [ScraperService, ScraperCronService],
    controllers: [ScraperController],
    exports: [ScraperService],
})
export class ScraperModule { }

