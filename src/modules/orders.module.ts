import { Module } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";
import { UsersController } from '../controllers/users/users.controller'
import { UsersService } from '../services/users.service'
import { TokenService } from "../services/token.service";
import { SearchService } from "../services/search.service";
import { ConfigService } from "@nestjs/config";
import { ShadowCopyService } from "../services/shadowCopy.service";
import { ProductsService } from "../services/products.service";
import { DatabaseModule } from "../database/database.module";
import { HttpModule } from "@nestjs/axios";
import { WishlistService } from "../services/wishlist.service";
import { ReviewsService } from "../services/reviewService";


@Module({
    providers: [OrdersService, UsersService, TokenService, SearchService, ConfigService, ShadowCopyService, ProductsService, WishlistService, ReviewsService],
    controllers: [UsersController],
    imports: [DatabaseModule, HttpModule]
})

export class OrdersModule { }