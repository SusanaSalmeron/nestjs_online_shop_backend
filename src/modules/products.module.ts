import { Module } from "@nestjs/common";
import { ProductsController } from "../controllers/products/products.controller";
import { ProductsService } from "../services/products.service";

@Module({
    providers: [ProductsService],
    controllers: [ProductsController]
})

export class ProductsModule { }