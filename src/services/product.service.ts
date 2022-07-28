import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ProductCard } from "../classes/productCard";
import * as loki from 'lokijs';
import { ShadowCopyService } from "./shadowCopy.service";




@Injectable()
export class ProductService {
    private baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json'
    private readonly logger = new Logger(ProductService.name)
    constructor(private readonly httpService: HttpService, @Inject('DATABASE_CONNECTION') private db: loki, private readonly shadowCopyService: ShadowCopyService) { }


    async findProductById(id): Promise<ProductCard[]> {
        let response
        try {
            response = (await this.httpService.axiosRef.get(this.baseUrl)).data
        } catch (err) {
            this.logger.warn('', err)
            response = await this.shadowCopyService.getShadowCopy()
        }
        const newProducts = await this.findNewProducts()
        const products = response.map(p => {
            return new ProductCard(
                p.id,
                p.brand,
                p.name,
                p.price,
                p.description,
                p.product_type,
                p.api_featured_image,
                p.product_colors
            )
        })
        const allProducts = [...products, ...newProducts].filter(p => p.id.toString() === id)
        return allProducts
    }

    async findNewProducts(): Promise<ProductCard[]> {
        const newProductsTable = this.db.getCollection('newProducts')
        const newProducts = newProductsTable.find(true).map(p => {
            return new ProductCard(
                p.id,
                p.brand,
                p.name,
                p.price,
                p.description,
                p.product_type,
                p.api_featured_image,
                p.product_colors
            )
        })
        return newProducts
    }
}