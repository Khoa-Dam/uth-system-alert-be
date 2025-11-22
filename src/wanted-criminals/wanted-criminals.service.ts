import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WantedCriminal } from './entities/wanted-criminal.entity';
import { CreateWantedCriminalDto } from './dtos/create-wanted-criminal.dto';
import { UpdateWantedCriminalDto } from './dtos/update-wanted-criminal.dto';

@Injectable()
export class WantedCriminalsService {
    constructor(
        @InjectRepository(WantedCriminal)
        private wantedCriminalRepository: Repository<WantedCriminal>,
    ) { }

    async create(createDto: CreateWantedCriminalDto): Promise<WantedCriminal> {
        const criminal = this.wantedCriminalRepository.create(createDto);
        return this.wantedCriminalRepository.save(criminal);
    }

    async findAll(): Promise<WantedCriminal[]> {
        return this.wantedCriminalRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<WantedCriminal> {
        const criminal = await this.wantedCriminalRepository.findOne({
            where: { id },
        });

        if (!criminal) {
            throw new NotFoundException('Wanted criminal not found');
        }

        return criminal;
    }

    async update(id: string, updateDto: UpdateWantedCriminalDto): Promise<WantedCriminal> {
        const criminal = await this.findOne(id);
        Object.assign(criminal, updateDto);
        return this.wantedCriminalRepository.save(criminal);
    }

    async remove(id: string): Promise<void> {
        const criminal = await this.findOne(id);
        await this.wantedCriminalRepository.remove(criminal);
    }

}
