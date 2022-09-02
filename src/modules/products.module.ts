import { Module } from "@nestjs/common";
import { UsersService } from "src/services/users.service";
import { ProductsController } from "../controllers/products/products.controller";
import { ProductsService } from "../services/products.service";

@Module({
    providers: [ProductsService, UsersService],
    controllers: [ProductsController]
})

export class ProductsModule { }