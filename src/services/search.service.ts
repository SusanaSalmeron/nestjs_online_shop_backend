import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";


@Injectable()
export class SearchService {
    constructor(private readonly httpService: HttpService) { }

    async findAllBrandsAndNames(): Promise<string[]> {
        const response = await this.httpService.axiosRef.get('https://makeup-api.herokuapp.com/api/v1/products.json');
        const list = response.data.flatMap(res => {
            return [res.brand, res.name]
        })
        const brandsAndNamesSet: Set<string> = new Set(list)
        const brandsAndNamesList: string[] = Array.from<string>(brandsAndNamesSet.values()).filter(el => {
            return el !== null
        })
        return brandsAndNamesList
    }
}

