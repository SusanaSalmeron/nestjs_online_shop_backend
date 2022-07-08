import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { SearchService } from 'src/services/search.service';
import { UsersController } from '../controllers/users/users.controller';
import { DatabaseModule } from '../database/database.module';
import { TokenService } from '../services/token.service';
import { UsersService } from '../services/users.service';

@Module({
    providers: [UsersService, TokenService, ConfigService, SearchService,
    ],
    controllers: [UsersController],
    imports: [DatabaseModule, HttpModule]
})
export class UsersModule { }
