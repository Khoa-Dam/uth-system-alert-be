import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({ status: 200, description: 'Returns health status of the application' })
    @ApiResponse({ status: 503, description: 'Service unavailable' })
    async check() {
        const health = await this.healthService.checkHealth();
        return health;
    }

    @Get('live')
    @ApiOperation({ summary: 'Liveness probe - checks if the application is running' })
    @ApiResponse({ status: 200, description: 'Application is alive' })
    async liveness() {
        return this.healthService.checkLiveness();
    }

    @Get('ready')
    @ApiOperation({ summary: 'Readiness probe - checks if the application is ready to serve traffic' })
    @ApiResponse({ status: 200, description: 'Application is ready' })
    @ApiResponse({ status: 503, description: 'Application is not ready' })
    async readiness() {
        const readiness = await this.healthService.checkReadiness();
        if (readiness.status === 'error') {
            throw new Error('Service not ready');
        }
        return readiness;
    }
}

