import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CartController } from "../controllers/carts/cart.controller";
import { DatabaseModule } from "../database/database.module";
import { OrdersService } from "../services/orders.service";
import { ProductsService } from "../services/products.service";
import { ReviewsService } from "../services/reviews.service";
import { SearchService } from "../services/search.service";
import { ShadowCopyService } from "../services/shadowCopy.service";
import { TokenService } from "../services/token.service";
import { UsersService } from "../services/users.service";
import { ValidationService } from "../services/validation.service";
import { WishlistService } from "../services/wishlist.service";

@Module({
    providers: [OrdersService, UsersService, TokenService, SearchService, ConfigService, ShadowCopyService, ProductsService, WishlistService, ReviewsService, ValidationService],
    controllers: [CartController],
    imports: [DatabaseModule, HttpModule]
})

export class CartsModule { }