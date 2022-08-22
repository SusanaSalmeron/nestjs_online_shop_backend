import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { ProductService } from 'src/services/product.service';
import { SearchService } from 'src/services/search.service';
import { ShadowCopyService } from 'src/services/shadowCopy.service';
import { UserController } from '../controllers/users/user.controller';
import { DatabaseModule } from '../database/database.module';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Module({
    providers: [UserService, TokenService, ConfigService, SearchService, ShadowCopyService, ProductService
    ],
    controllers: [UserController],
    imports: [DatabaseModule, HttpModule]
})
export class UsersModule { }
