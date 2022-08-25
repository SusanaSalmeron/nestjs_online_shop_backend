import { Module } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";
import { UsersController } from '../controllers/users/users.controller'
import { UsersService } from "src/services/users.service";
import { TokenService } from "src/services/token.service";
import { SearchService } from "src/services/search.service";
import { ConfigService } from "@nestjs/config";
import { ShadowCopyService } from "src/services/shadowCopy.service";
import { ProductsService } from "src/services/products.service";
import { DatabaseModule } from "src/database/database.module";
import { HttpModule } from "@nestjs/axios";


@Module({
    providers: [OrdersService, UsersService, TokenService, SearchService, ConfigService, ShadowCopyService, ProductsService],
    controllers: [UsersController],
    imports: [DatabaseModule, HttpModule]
})

export class OrdersModule { }