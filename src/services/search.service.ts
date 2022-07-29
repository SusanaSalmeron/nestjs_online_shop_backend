import { HttpService } from "@nestjs/axios";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { Search } from "../classes/search";
import { Product } from "../classes/product";
import { ShadowCopyService } from "./shadowCopy.service";
import * as loki from 'lokijs';



@Injectable()
export class SearchService {
    private catalog = []
    private readonly logger = new Logger(SearchService.name)
    private baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json'
    constructor(private readonly httpService: HttpService, @Inject('DATABASE_CONNECTION') private db: loki, private readonly shadowCopyService: ShadowCopyService) { }

    async findAllBrandsAndNames(): Promise<Search[]> {
        if (!this.catalog.length) {
            let response
            try {
                response = (await this.httpService.axiosRef.get(this.baseUrl)).data;
            } catch (err) {
                this.logger.warn('', err)
                response = await this.shadowCopyService.getShadowCopy()
            }
            const newProductsTable = this.db.getCollection('newProducts')
            const newProducts = newProductsTable.find(true)
            const allBrandsAndNamesFromNewProducts = newProducts.flatMap(p => {
                return [p.brand, p.name]
            })
            const list = response.flatMap(res => {
                return [res.brand, res.name]
            })
            const newList = [...allBrandsAndNamesFromNewProducts, ...list]
            const brandsAndNamesSet: Set<string> = new Set(newList)
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
        console.log(element.brand)
        return element.brand !== null && (element.name.toLowerCase().includes(keyword.toLowerCase()) || element.brand.toLowerCase().includes(keyword.toLowerCase()))

    }
    private toProduct = (element) => {
        return new Product(
            element.id.toString(),
            element.name.trim(),
            element.brand,
            element.price,
            element.api_featured_image
        )
    }


    async searchList(keyword): Promise<Product[]> {
        let response
        try {
            response = (await this.httpService.axiosRef(this.baseUrl)).data
        } catch (err) {
            this.logger.warn('', err)
            response = await this.shadowCopyService.getShadowCopy()
        }
        const newProductsTable = this.db.getCollection('newProducts')
        const newProducts = newProductsTable.find(true).filter(p => this.filterByKeyword(p, keyword)).map(this.toProduct)
        console.log(newProducts)
        const list = response.filter(el => this.filterByKeyword(el, keyword))
            .map(this.toProduct)
        const allProductsList = [...newProducts, ...list]
        return allProductsList
    }
}

