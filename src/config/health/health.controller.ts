import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm/browser';

@Controller('health')
export class HealthController {
    constructor(
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    @Get()
    async check() {
        try {
            await this.connection.query('SELECT 1');
            return {
                status: 'OK',
                database: 'Connected'
            };
        } catch (e) {
            return {
                status: 'error',
                database: 'Disconnected',
                error: e.message
            }
        }
    }
}
