import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WantedCriminalsService } from './wanted-criminals.service';
import { CreateWantedCriminalDto } from './dtos/create-wanted-criminal.dto';
import { UpdateWantedCriminalDto } from './dtos/update-wanted-criminal.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('wanted-criminals')
@Controller('wanted-criminals')
export class WantedCriminalsController {
    constructor(private readonly wantedCriminalsService: WantedCriminalsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all wanted criminals (paginated with search & filter)' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 9)' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by name or crime' })
    @ApiQuery({ name: 'name', required: false, description: 'Filter by name' })
    @ApiQuery({ name: 'crime', required: false, description: 'Filter by crime' })
    @ApiResponse({ status: 200, description: 'Returns paginated wanted criminals' })
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('name') name?: string,
        @Query('crime') crime?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 9;
        return this.wantedCriminalsService.findAll(pageNumber, limitNumber, search, name, crime);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get wanted criminal by ID' })
    @ApiParam({ name: 'id', description: 'Wanted criminal ID' })
    @ApiResponse({ status: 200, description: 'Returns the wanted criminal' })
    @ApiResponse({ status: 404, description: 'Wanted criminal not found' })
    async findOne(@Param('id') id: string) {
        return this.wantedCriminalsService.findOne(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new wanted criminal (Admin only)' })
    @ApiBody({ type: CreateWantedCriminalDto })
    @ApiResponse({ status: 201, description: 'Wanted criminal successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async create(@Body() createDto: CreateWantedCriminalDto) {
        return this.wantedCriminalsService.create(createDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a wanted criminal (Admin only)' })
    @ApiParam({ name: 'id', description: 'Wanted criminal ID' })
    @ApiBody({ type: UpdateWantedCriminalDto })
    @ApiResponse({ status: 200, description: 'Wanted criminal successfully updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Wanted criminal not found' })
    async update(@Param('id') id: string, @Body() updateDto: UpdateWantedCriminalDto) {
        return this.wantedCriminalsService.update(id, updateDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a wanted criminal (Admin only)' })
    @ApiParam({ name: 'id', description: 'Wanted criminal ID' })
    @ApiResponse({ status: 200, description: 'Wanted criminal successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Wanted criminal not found' })
    async remove(@Param('id') id: string) {
        await this.wantedCriminalsService.remove(id);
        return { message: 'Wanted criminal successfully deleted' };
    }
}
