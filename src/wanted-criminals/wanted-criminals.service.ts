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

    async createOrUpdate(criminalData: Partial<WantedCriminal>): Promise<WantedCriminal> {
        // Check if exists by name and decision number (if available) or just name
        // This is a simple heuristic. Adjust based on available unique fields.
        let existing: WantedCriminal | null = null;

        if (criminalData.decisionNumber) {
            existing = await this.wantedCriminalRepository.findOne({
                where: { decisionNumber: criminalData.decisionNumber },
            });
        }

        if (!existing && criminalData.name) {
            // Fallback to name + birthYear check if decision number is missing
            existing = await this.wantedCriminalRepository.findOne({
                where: {
                    name: criminalData.name,
                    birthYear: criminalData.birthYear,
                },
            });
        }

        if (existing) {
            Object.assign(existing, criminalData);
            return this.wantedCriminalRepository.save(existing);
        }

        const newCriminal = this.wantedCriminalRepository.create(criminalData);
        return this.wantedCriminalRepository.save(newCriminal);
    }

    async findAll(page: number = 1, limit: number = 9, search?: string, name?: string, crime?: string) {
        const skip = (page - 1) * limit;
        
        const queryBuilder = this.wantedCriminalRepository.createQueryBuilder('criminal');

        if (search) {
            queryBuilder.andWhere(
                '(LOWER(criminal.name) LIKE LOWER(:search) OR LOWER(criminal.crime) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }

        if (name) {
            queryBuilder.andWhere('LOWER(criminal.name) LIKE LOWER(:name)', { name: `%${name}%` });
        }

        if (crime) {
            queryBuilder.andWhere('LOWER(criminal.crime) LIKE LOWER(:crime)', { crime: `%${crime}%` });
        }

        queryBuilder
            .orderBy('criminal.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
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
