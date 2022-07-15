import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ProductCard } from "../classes/productCard";

@Injectable()
export class ProductService {
    private baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json'
    constructor(private readonly httpService: HttpService) { }

    async findProductById(id): Promise<ProductCard[]> {
        const response = await this.httpService.axiosRef.get(this.baseUrl)
        const product = response.data.filter(p => p.id.toString() === id).map(p => {
            return new ProductCard(
                p.id,
                p.brand,
                p.name,
                p.price,
                p.description,
                p.tag_list,
                p.api_featured_image,
                p.product_colors
            )
        })
        return product
    }
}