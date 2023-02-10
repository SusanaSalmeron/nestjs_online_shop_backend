import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Product } from "../classes/product";
import { ProductCard } from "../classes/productCard";
import { ShadowCopyService } from "./shadowCopy.service";
import * as loki from 'lokijs';


@Injectable()
export class ProductsService {
    private baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json'
    private readonly logger = new Logger(ProductsService.name)
    constructor(private readonly httpService: HttpService, @Inject('DATABASE_CONNECTION') private db: loki, private readonly shadowCopyService: ShadowCopyService) { }
    private shadowCopy;

    async loadAndGetShadowCopy() {
        if (!this.shadowCopy) {
            this.shadowCopy = await this.shadowCopyService.getShadowCopy()
        }
        return this.shadowCopy
    }

    async findProductById(id: string): Promise<ProductCard> {
        let response
        try {
            response = (await this.httpService.axiosRef.get(this.baseUrl, { timeout: 500 })).data
            this.logger.log('api found')
        } catch (err) {
            response = await this.loadAndGetShadowCopy();
            this.logger.warn('Api not available', err)
        }
        const apiProductsDataFiltered = response.filter(p => p.id === parseInt(id))
        let productResult: ProductCard = null
        if (apiProductsDataFiltered.length === 0) {
            const newProducts = await this.findNewProducts()
            const productFiltered: ProductCard[] = newProducts.filter(p => p.id === parseInt(id))
            this.logger.log('new products have been filtered by productId')
            if (productFiltered.length > 0) {
                productResult = productFiltered[0]
                this.logger.log(`showing new product ${productFiltered[0].id}`)
            }
        } else {
            productResult = new ProductCard(
                apiProductsDataFiltered[0].id,
                apiProductsDataFiltered[0].brand,
                apiProductsDataFiltered[0].name,
                apiProductsDataFiltered[0].price,
                apiProductsDataFiltered[0].description,
                apiProductsDataFiltered[0].productType,
                apiProductsDataFiltered[0].api_featured_image,
                apiProductsDataFiltered[0].product_colors
            )
            this.logger.log(`showing product ${productResult.id} from api`)
        }
        return productResult
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
                p.productType,
                p.api_featured_image,
                p.product_colors
            )
        })
        this.logger.log('New Products founded successfully')
        return newProducts
    }

    async findProductsBy(type: string): Promise<Product[]> {
        let response
        try {
            response = (await this.httpService.axiosRef.get(`${this.baseUrl}/?product_type=${type}`)).data
            this.logger.log('response from api')
/*             console.log(response)
 */        } catch (err) {
            this.logger.warn('Api not available', err)
            const responseFromCopy = await this.loadAndGetShadowCopy()
            response = responseFromCopy.filter(p =>
                p.product_type && p.product_type.toLowerCase() === type.toLowerCase())
            this.logger.log('response from copy')
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
        const newProductsFiltered = newProducts.filter(p => p.productType && p.productType.toLowerCase() === type.toLowerCase())
        this.logger.log(`new products filtered by ${type}`)
        const allProducts: Product[] = [...products, ...newProductsFiltered]
        this.logger.log(`All products(api + new)filtered by ${type}`)
        return allProducts
    }

    async exists(productId: string): Promise<boolean> {
        const productFound: ProductCard = await this.findProductById(productId)
        if (productFound) {
            this.logger.log(`The product ${productId} exists`)
            return true
        } else {
            this.logger.error(`The product ${productId} does not exists`)
            return false
        }
    }

    async checkProductAvailability(productId: string): Promise<boolean> {
        const productFound: ProductCard = await this.findProductById(productId)
        if (productFound.price && productFound.price !== "0.0") {
            this.logger.log('This product has stock')
            return true
        } else {
            this.logger.error('This product has not stock')
            return false
        }
    }
}
