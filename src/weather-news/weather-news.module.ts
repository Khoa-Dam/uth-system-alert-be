import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { WeatherNews } from './entities/weather-news.entity';
import { WeatherNewsService } from './weather-news.service';
import { WeatherNewsController } from './weather-news.controller';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([WeatherNews, User]),
        JwtModule.register({}),
    ],
    providers: [WeatherNewsService],
    controllers: [WeatherNewsController],
    exports: [WeatherNewsService],
})
export class WeatherNewsModule { }

