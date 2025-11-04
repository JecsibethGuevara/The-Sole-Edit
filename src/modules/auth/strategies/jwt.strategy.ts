import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '../entities/User.entity'
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "../interfaces/jwt.interface";
import { retry } from "rxjs";
import { JwtConfigService } from "./jwt.config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private jwtConfigService: JwtConfigService,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConfigService.secret,
        });
    }

    async validate(payload: JwtPayload) {
        const { userId } = payload
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }
}