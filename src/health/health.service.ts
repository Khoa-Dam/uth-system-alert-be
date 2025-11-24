import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

export interface HealthCheckResult {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    database: {
        status: 'connected' | 'disconnected';
        responseTime?: number;
    };
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
}

@Injectable()
export class HealthService {
    constructor(
        @InjectConnection()
        private connection: Connection,
    ) { }

    async checkHealth(): Promise<HealthCheckResult> {
        const startTime = Date.now();
        const uptime = process.uptime();

        // Check database connection
        let dbStatus: 'connected' | 'disconnected' = 'disconnected';
        let dbResponseTime: number | undefined;

        try {
            const dbStartTime = Date.now();
            await this.connection.query('SELECT 1');
            dbResponseTime = Date.now() - dbStartTime;
            dbStatus = 'connected';
        } catch (error) {
            dbStatus = 'disconnected';
        }

        // Memory usage
        const memoryUsage = process.memoryUsage();
        const used = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB
        const total = Math.round(memoryUsage.heapTotal / 1024 / 1024); // MB
        const percentage = Math.round((used / total) * 100);

        const overallStatus = dbStatus === 'connected' ? 'ok' : 'error';

        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            uptime: Math.round(uptime),
            database: {
                status: dbStatus,
                responseTime: dbResponseTime,
            },
            memory: {
                used,
                total,
                percentage,
            },
        };
    }

    async checkLiveness(): Promise<{ status: 'ok'; timestamp: string }> {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    async checkReadiness(): Promise<{ status: 'ok' | 'error'; database: 'connected' | 'disconnected' }> {
        try {
            await this.connection.query('SELECT 1');
            return {
                status: 'ok',
                database: 'connected',
            };
        } catch (error) {
            return {
                status: 'error',
                database: 'disconnected',
            };
        }
    }
}

