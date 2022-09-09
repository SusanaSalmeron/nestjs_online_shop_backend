import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { OrderOverview } from "../classes/orderOverview";
import { OrderProductsOverview } from "../classes/orderProductsOverview";
import { OrdersService } from "./orders.service"
import { ProductsService } from "./products.service";
import { ShadowCopyService } from "./shadowCopy.service";
import {
    newProducts, mockFindProdyctsById, mockFindOneAddress, productToShow, mockFindOneUser, mockFindOrders, mockFindOrdersPosition
} from "./mockDataForOrdersServiceTest";


describe('OrdersService', () => {
    let ordersService: OrdersService;

    let ordersMockDBCollection
    let addressesMockDBCollection
    let orderPositionMockDBCollection
    let usersMockBCollection

    beforeEach(async () => {
        const productsServiceProvider = {
            provide: ProductsService,
            useFactory: () => ({
                findProductById: jest.fn(mockFindProdyctsById),
                findNewProducts: jest.fn(() => newProducts()),
                findProductsBy: jest.fn(() => productToShow())
            })
        }

        addressesMockDBCollection = {
            findOne: jest.fn().mockImplementation(mockFindOneAddress)
        }

        usersMockBCollection = {
            findOne: jest.fn().mockImplementation(mockFindOneUser)
        }

        ordersMockDBCollection = {
            find: jest.fn().mockImplementation(mockFindOrders)
        }

        orderPositionMockDBCollection = {
            find: jest.fn().mockImplementation(mockFindOrdersPosition)
        }

        const dbProvider = {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                return {
                    getCollection: jest.fn().mockImplementation((tableName) => {
                        const collections = {
                            "addresses": addressesMockDBCollection,
                            "orderPosition": orderPositionMockDBCollection,
                            "orders": ordersMockDBCollection,
                            "users": usersMockBCollection
                        }
                        return collections[tableName]
                    })
                }
            }
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [OrdersService, ProductsService, ShadowCopyService, productsServiceProvider, dbProvider],
            imports: [HttpModule]
        }).compile();

        ordersService = module.get<OrdersService>(OrdersService);
    })
    it('should return an empty array from a non valid user', async () => {
        const orders = await ordersService.findOrdersBy(2000)
        expect(orders).toBeNull()
    })

    it('should return all orders from a valid user', async () => {
        const orders = await ordersService.findOrdersBy(1000)
        expect(orders).toHaveLength(2)
        expect(orders).toEqual([
            new OrderOverview(
                1,
                "Peter",
                'Smith',
                'Gran Via 39',
                "28013",
                "Madrid",
                "Spain",
                "17/05/2021",
                "Shipped",
                [new OrderProductsOverview(
                    "Biba Palette",
                    "Natasha Denona",
                    "Biba Palette",
                    129,
                    1,
                    129
                )],
                129
            ), new OrderOverview(
                2,
                "Peter",
                'Smith',
                'Fuencarral 39',
                "28004",
                "Madrid",
                "Spain",
                "03/06/2022",
                "In process",
                [new OrderProductsOverview(
                    "Mini Bronze Palette",
                    "Natasha Denona",
                    "Mini Bronze Palette",
                    27,
                    1,
                    27
                )],
                27
            )
        ])
        expect(usersMockBCollection.findOne).toHaveBeenCalledWith({ id: 1000 })
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ user_id: 1000 })
    })

    it('should return an empty array from a valid user without orders', async () => {
        const orders = await ordersService.findOrdersBy(971)
        expect(orders).toHaveLength(0)
        expect(usersMockBCollection.findOne).toHaveBeenCalledWith({ id: 971 })
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ user_id: 971 })
    })
})




