import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
    constructor(private configService: ConfigService) {
        console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);
        console.log('All environment variables:', Object.keys(process.env));
    }

    get secret(): string {
        const secret = this.configService.get<string>('JWT_SECRET');

        console.log('Final JWT Secret:', secret ? '***' : 'NOT FOUND');


        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        return secret;
    }

    get expiresIn(): string {
        return this.configService.get<string>('JWT_EXPIRES_IN') ||
            this.configService.get<string>('jwt.expiresIn') ||
            '24h';
    }
}