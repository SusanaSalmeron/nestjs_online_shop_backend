import { SearchService } from "./search.service";
import { ShadowCopyService } from "./shadowCopy.service";
import axios from 'axios';
import { data, fakeNewProductsTableData } from './mockDataForSearchServiceTest';
import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { Product } from "../classes/product";

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('SearchService', () => {
    let searchService: SearchService
    let spyShadowCopyService: ShadowCopyService

    let newProductsMockDBCollection

    beforeEach(async () => {
        mockedAxios.get.mockResolvedValue(data)
        const shadowCopyProvider = {
            provide: ShadowCopyService,
            useFactory: () => ({
                getShadowCopy: jest.fn()
            })
        }

        newProductsMockDBCollection = {
            find: jest.fn().mockImplementation(() => {
                return fakeNewProductsTableData
            })
        }

        const dbProvider = {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                return {
                    getCollection: jest.fn().mockReturnValue(newProductsMockDBCollection)
                }
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [SearchService, ShadowCopyService, dbProvider, shadowCopyProvider],
            imports: [HttpModule]
        }).compile()

        searchService = module.get<SearchService>(SearchService)
        spyShadowCopyService = module.get<ShadowCopyService>(ShadowCopyService)
    })

    it('should show all brands and names from products', async () => {
        const brandsAndNames = await searchService.findAllBrandsAndNames()
        expect(brandsAndNames).toHaveLength(8)
        expect(brandsAndNames).toEqual([
            {
                "name": "Rare Beauty",
                "value": "Rare Beauty"
            },
            {
                "name": "Always An Optimist 4-in-1 Prime & Set Mist",
                "value": "Always An Optimist 4-in-1 Prime & Set Mist"
            },
            {
                "name": "Natasha Denona",
                "value": "Natasha Denona"
            },
            {
                "name": "Glam Eyeshadow Palette",
                "value": "Glam Eyeshadow Palette"
            },
            {
                "name": "zorah biocosmetiques",
                "value": "zorah biocosmetiques"
            },
            {
                "name": "Liquid Liner",
                "value": "Liquid Liner"
            },
            {
                "name": "rejuva minerals",
                "value": "rejuva minerals"
            },
            {
                "name": "Bronzer - pressed",
                "value": "Bronzer - pressed"
            }])
        expect(newProductsMockDBCollection.find).toHaveBeenCalled()
        expect(spyShadowCopyService.getShadowCopy).not.toHaveBeenCalled()
    })

    it('should return all products when keyword exists', async () => {
        const allProductsByKeyword = await searchService.searchList("bronzer")
        expect(allProductsByKeyword).toHaveLength(1)
        expect(newProductsMockDBCollection.find).toHaveBeenCalledWith(true)
        expect(allProductsByKeyword).toEqual([new Product(
            '2',
            'Bronzer - pressed',
            'rejuva minerals',
            '13',
            '//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/001/031/original/open-uri20180630-4-1axfay6?1530390380'
        )])
        expect(spyShadowCopyService.getShadowCopy).not.toHaveBeenCalled()
    })

    it('should return an empty array when the keyword does not exists', async () => {
        const allProductsByKeyword = await searchService.searchList("lipstick")
        expect(allProductsByKeyword).toHaveLength(0)
        expect(newProductsMockDBCollection.find).toHaveBeenCalledWith(true)
        expect(spyShadowCopyService.getShadowCopy).not.toHaveBeenCalled()
    })

})