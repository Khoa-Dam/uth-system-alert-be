import { Module } from '@nestjs/common';
import { WantedCriminalsService } from './wanted-criminals.service';
import { WantedCriminalsController } from './wanted-criminals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WantedCriminal } from './entities/wanted-criminal.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WantedCriminal, User])],
  providers: [WantedCriminalsService],
  controllers: [WantedCriminalsController],
  exports: [WantedCriminalsService],
})
export class WantedCriminalsModule { }
