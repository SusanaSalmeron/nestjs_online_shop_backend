import { ProductsService } from "./products.service";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { ShadowCopyService } from "./shadowCopy.service";
import axios from 'axios';
import { data, fakeNewProductsTableData } from "./mockDataForProductsServiceTest";
import { ProductCard } from "../classes/productCard";


jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('ProductsService', () => {
    let productsService: ProductsService
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
            providers: [ProductsService, ShadowCopyService, dbProvider, shadowCopyProvider],
            imports: [HttpModule]
        }).compile();

        productsService = module.get<ProductsService>(ProductsService)
        spyShadowCopyService = module.get<ShadowCopyService>(ShadowCopyService)
    })

    it('should show a product when product id is valid', async () => {
        const product = await productsService.findProductById(2)
        expect(product).not.toBeNull()
        expect(product).toEqual(new ProductCard(
            2,
            'rejuva minerals',
            'Bronzer - pressed',
            '13',
            "Our bronzer has been enhanced with Fruits, Botanicals and Clays for their natural color, fragrance and antioxidant benefits! Blended with Certified Organics Fruits and Botanicals Formulated with common skin irritants. Our bronzer will offer a natural 'ultra sheer' semi-matte finish. Made without any gluten containing ingredients VEGAN! Eco Friendly jars!",
            'bronzer',
            '//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/001/031/original/open-uri20180630-4-1axfay6?1530390380',
            [
                { hex_value: '#DDA983', colour_name: 'St Tropez' },
                { hex_value: '#9C7248', colour_name: 'Bahama Mama' }
            ]
        ))
        expect(spyShadowCopyService.getShadowCopy).not.toBeCalled()
    })

    it('should not show a product when id does not exists', async () => {
        const product = await productsService.findProductById(5)
        expect(product).toBeNull()
        expect(spyShadowCopyService.getShadowCopy).not.toBeCalled()
    })

    it('should show all the new products', async () => {
        const newProducts = await productsService.findNewProducts()
        expect(newProducts).toHaveLength(2)
        expect(newProducts).toEqual([new ProductCard(
            3,
            "Rare Beauty",
            "Always An Optimist 4-in-1 Prime & Set Mist",
            24,
            "Layer this all-in-one mist under or over makeup for a refreshed complexion. Infused with a botanical blend of lotus, gardenia, and white waterlily to help soothe and calm skin, this bi-phase formula also features niacinamide and sodium hyaluronate for the appearance of plumper, smoother skin. ",
            "Foundation",
            "https://www.sephora.com/productimages/sku/s2362465-main-zoom.jpg?imwidth=1224",
            [
                {
                    "hex_value": "",
                    "colour_name": "No colour"
                }
            ]
        ),
        new ProductCard(
            4,
            "Natasha Denona",
            "Glam Eyeshadow Palette",
            69,
            " This palette includes shades named after the ideal place to apply them, helping you recreate glam makeup looks. It‘s as if you have special insider makeup tips from Natasha Denona herself when you apply these shades.",
            "Eyeshadow",
            "https://www.sephora.com/productimages/sku/s2378313-main-zoom.jpg?imwidth=1224",
            [
                {
                    "hex_value": "",
                    "colour_name": "Glam Palette"
                }
            ]
        )
        ])
        expect(spyShadowCopyService.getShadowCopy).not.toBeCalled()
    })

    //TODO - return all values without filtering
    it('should show all products by type', async () => {
        const products = await productsService.findProductsBy("bronzer")
/*         console.log(products)
 */    })

    it('should return true when product id exists', async () => {
        const exists = await productsService.exists("1")
        expect(exists).toBeTruthy()
    })

    it('should return false when product id does not exists', async () => {
        const exists = await productsService.exists("8")
        expect(exists).toBeFalsy()
    })


})
