import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { UsersController } from '../controllers/users/users.controller';
import { DatabaseModule } from '../database/database.module';
import { TokenService } from '../services/token.service';
import { UsersService } from '../services/users.service';

@Module({
    providers: [UsersService, TokenService, ConfigService],
    controllers: [UsersController],
    imports: [DatabaseModule]
})
export class UsersModule { }
