import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Search } from "src/classes/search";


@Injectable()
export class SearchService {
    private catalog = []
    constructor(private readonly httpService: HttpService) { }

    async findAllBrandsAndNames(): Promise<Search[]> {
        if (!this.catalog.length) {
            const response = await this.httpService.axiosRef.get('https://makeup-api.herokuapp.com/api/v1/products.json');
            const list = response.data.flatMap(res => {
                return [res.brand, res.name]
            })
            const brandsAndNamesSet: Set<string> = new Set(list)
            const brandsAndNamesList: Search[] = Array.from<string>(brandsAndNamesSet.values()).filter(el => {
                return el !== null
            }).map(el => {
                return new Search(
                    el,
                    el
                )
            })
            this.catalog = brandsAndNamesList
        }
        return this.catalog
    }
}

