import { Module } from "@nestjs/common";
import { ProductController } from "src/controllers/products/product.controller";
import { ProductService } from "src/services/product.service";

@Module({
    providers: [ProductService],
    controllers: [ProductController]
})

export class ProductModule { }