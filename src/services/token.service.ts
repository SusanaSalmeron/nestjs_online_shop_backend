import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class TokenService {
    constructor(private readonly configService: ConfigService) { }

    async createToken(user): Promise<string> {
        const date = dayjs().add(20, 'minutes').unix()
        const claims = {
            id: user.id,
            expiration: date
        }
        const secretKey = this.configService.get<string>('SECRET_KEY')
        return await jwt.sign(claims, secretKey)
    }
}