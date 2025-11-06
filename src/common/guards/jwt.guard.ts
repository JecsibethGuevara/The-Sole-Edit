import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from 'src/modules/auth/blacklist.service';
;


//remember: IMPLEMENTAR OWNERSHIP SI DA CHANCE

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private blacklistService: BlacklistService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization format');
        }

        if (this.blacklistService.isBlacklisted(token)) {
            throw new UnauthorizedException('Token has been invalidated');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}

