import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Search } from "src/classes/search";
import { Product } from "src/classes/product";


@Injectable()
export class SearchService {
    private catalog = []
    private baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json'
    constructor(private readonly httpService: HttpService) { }

    async findAllBrandsAndNames(): Promise<Search[]> {
        if (!this.catalog.length) {
            const response = await this.httpService.axiosRef.get(this.baseUrl);
            const list = response.data.flatMap(res => {
                return [res.brand, res.name]
            })
            const brandsAndNamesSet: Set<string> = new Set(list)
            const brandsAndNamesList: Search[] = Array.from<string>(brandsAndNamesSet.values()).filter(el => {
                return el !== null
            }).map(el => {
                return new Search(
                    el.trim(),
                    el
                )
            })
            this.catalog = brandsAndNamesList
        }
        return this.catalog
    }

    private filterByKeyword = (element, keyword) => {
        return element.brand !== null && (element.name.includes(keyword) || element.brand.includes(keyword))
    }
    private toProduct = (element) => {
        return new Product(
            element.name.trim(),
            element.brand,
            element.price,
            element.api_featured_image
        )
    }


    async searchList(keyword): Promise<Product[]> {
        const response = await this.httpService.axiosRef(this.baseUrl)
        const list = response.data.filter(el => this.filterByKeyword(el, keyword))
            .map(this.toProduct)
        return list
    }
}

