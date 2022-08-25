import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { ProductsService } from '../services/products.service';
import { SearchService } from '../services/search.service';
import { ShadowCopyService } from '../services/shadowCopy.service';
import { UsersController } from '../controllers/users/users.controller';
import { DatabaseModule } from '../database/database.module';
import { TokenService } from '../services/token.service';
import { UsersService } from '../services/users.service';
import { OrdersService } from 'src/services/orders.service';

@Module({
    providers: [UsersService, TokenService, ConfigService, SearchService, ShadowCopyService, ProductsService, OrdersService
    ],
    controllers: [UsersController],
    imports: [DatabaseModule, HttpModule]
})
export class UsersModule { }
