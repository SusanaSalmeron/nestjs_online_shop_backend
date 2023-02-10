import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { OrdersService } from "./orders.service"
import { ProductsService } from "./products.service";
import { ShadowCopyService } from "./shadowCopy.service";
import {
    newProducts, mockFindProdyctsById, mockFindOneAddress, productToShow, mockFindOneUser, mockFindOrders, mockFindOrdersPosition, mockFindOneOrder, mockNewOrder, mockBuildOrderOverview
} from "./mockDataForOrdersServiceTest";
import { OrderProductsOverview } from "../classes/orderProductsOverview";
import { OrderOverview } from "../classes/orderOverview";


describe('OrdersService', () => {
    let ordersService: OrdersService;
    let productService: ProductsService;

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
            find: jest.fn().mockImplementation(mockFindOrders),
            findOne: jest.fn().mockImplementation(mockFindOneOrder),
            insert: jest.fn().mockReturnValue(mockNewOrder)
        }

        orderPositionMockDBCollection = {
            find: jest.fn().mockImplementation(mockFindOrdersPosition),
            insert: jest.fn()
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
        productService = module.get<ProductsService>(ProductsService)
    })

    it('should build an order overview', async () => {
        const orderOverview = await ordersService.buildOrderOverview(mockBuildOrderOverview)
        expect(orderOverview).toEqual({
            orderId: 1,
            name: 'Peter',
            surname: 'Smith',
            address: 'Gran Via 39',
            postalZip: '28013',
            city: 'Madrid',
            country: 'Spain',
            orderDate: '17/05/2021',
            status: 'Shipped',
            products: [
                {
                    productName: 'Biba Palette',
                    product_brand: 'Natasha Denona',
                    product_colour: 'Biba Palette',
                    price: 129,
                    units: 1,
                    product_total: 129
                }
            ],
            totalOrder: 129
        })
        expect(orderPositionMockDBCollection.find).toHaveBeenCalledWith({ "orderId": 1 })
        expect(productService.findProductById).toHaveBeenCalledWith("1")
    })

    it('should return null when user does not exist', async () => {
        const orders = await ordersService.findOrdersBy(2000)
        expect(orders).toBeNull()
    })

    it('should return all orders from a valid user', async () => {
        const orders = await ordersService.findOrdersBy(1000)
        expect(orders).toHaveLength(2)
        expect(usersMockBCollection.findOne).toHaveBeenCalledWith({ id: 1000 })
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ userId: 1000 })
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
                'Gran Via 39',
                "28013",
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
    })

    it('should return an empty array from a valid user without orders', async () => {
        const orders = await ordersService.findOrdersBy(971)
        expect(orders).toHaveLength(0)
        expect(usersMockBCollection.findOne).toHaveBeenCalledWith({ id: 971 })
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ userId: 971 })
    })
    //TODO - problem with reduce
    /* it('should return and order by id', async () => {
        const order = await ordersService.findOrderBy(971, 2)
        console.log(order)
    }) */

    it('should return all orders by status from a user', async () => {
        const orders = await ordersService.findAllOrdersBy('Shipped', 1000)
        expect(orders).toHaveLength(1)
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ userId: 1000 })
    })
    it('should return null when user does not exist', async () => {
        const orders = await ordersService.findAllOrdersBy('Shipped', 2000)
        expect(orders).toBeNull()
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ userId: 2000 })
    })

    it('should return null when user exists but does not have orders', async () => {
        const orders = await ordersService.findAllOrdersBy('Shipped', 971)
        expect(orders).toBeNull()
        expect(ordersMockDBCollection.find).toHaveBeenCalledWith({ userId: 971 })
    })

    it('should add a new order when userId exists', async () => {
        const newOrder = await ordersService.addNewOrder(1000, mockNewOrder)
        expect(newOrder).toBe(7)
        expect(ordersMockDBCollection.insert).toHaveBeenCalledTimes(1)
        expect(ordersMockDBCollection.insert).toHaveBeenCalledWith({
            "id": 7,
            "userId": 1000,
            "name": "Peter",
            "surname": "Smith",
            "deliveryAddress": "Gran Via 39",
            "postalZip": "28013",
            "city": "Madrid",
            "country": "Spain",
            "orderDate": "2/2/2023",
            "status": "In process"
        })
        expect(orderPositionMockDBCollection.insert).toHaveBeenCalledTimes(2)
        expect(orderPositionMockDBCollection.insert).toHaveBeenNthCalledWith(1,
            {
                id: 13,
                orderId: 7,
                productId: 1066,
                name: "Pastel Palette",
                product_colors: "Pastel Palette",
                units: 1,
                total: 59
            })
        expect(orderPositionMockDBCollection.insert).toHaveBeenNthCalledWith(2,
            {
                id: 14,
                orderId: 7,
                productId: 1001,
                name: "Mini Star Palette",
                product_colors: "Mini Star Palette",
                units: 1,
                total: 26
            })
    })
})