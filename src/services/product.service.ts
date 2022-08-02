import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Product } from "../classes/product";
import { ProductCard } from "../classes/productCard";
import { ShadowCopyService } from "./shadowCopy.service";
import * as loki from 'lokijs';


@Injectable()
export class ProductService {
    private baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json'
    private readonly logger = new Logger(ProductService.name)
    constructor(private readonly httpService: HttpService, @Inject('DATABASE_CONNECTION') private db: loki, private readonly shadowCopyService: ShadowCopyService) { }


    async findProductById(id: string): Promise<ProductCard[]> {
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

    async findProductsBy(type): Promise<Product[]> {
        let response
        try {
            response = (await this.httpService.axiosRef.get(`${this.baseUrl}/?product_type=${type}`)).data
        } catch (err) {
            this.logger.warn('', err)
            response = (await this.shadowCopyService.getShadowCopy()).filter(p => p.product_type.toLowerCase() === type.toLowerCase())
        }
        const newProducts = await this.findNewProducts()
        const products = response.map(p => {
            return new Product(
                p.id,
                p.name,
                p.brand,
                p.price,
                p.api_featured_image
            )
        })
        const newProductsFiltered = newProducts.filter(p => p.product_type.toLowerCase() === type.toLowerCase())
        const allProducts = [...products, ...newProductsFiltered]
        return allProducts

    }
}
