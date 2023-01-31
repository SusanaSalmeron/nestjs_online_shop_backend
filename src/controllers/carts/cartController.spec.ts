import { Test, TestingModule } from "@nestjs/testing"
import { ProductsService } from "../../services/products.service"
import { newResponse } from "../products/mockDataForProductControllerTests"
import { CartController } from "./cart.controller"
import { existentProductIdsWithoutStock, existentProductIdsWithStock, mockCheckProductAvailability, mockExists, nonExistentProductIds } from "./mockDataForCartController"


describe('CartController Unit Tests', () => {
    let cartController: CartController
    let spyProductsService: ProductsService

    beforeEach(async () => {
        const productsServiceProvider = {
            provide: ProductsService,
            useFactory: () => ({
                exists: jest.fn(mockExists),
                checkProductAvailability: jest.fn(mockCheckProductAvailability)
            })
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CartController],
            providers: [ProductsService, productsServiceProvider]
        }).compile()

        cartController = module.get<CartController>(CartController)
        spyProductsService = module.get<ProductsService>(ProductsService)
    })

    it('should return status code 200 when product have stock', async () => {
        const mockResponse = newResponse()
        await cartController.checkStock(existentProductIdsWithStock, mockResponse)
        expect(spyProductsService.exists).toHaveBeenCalledTimes(3)
        expect(spyProductsService.exists).toReturnWith(true)
        expect(spyProductsService.checkProductAvailability).toHaveBeenCalledTimes(3)
        expect(spyProductsService.checkProductAvailability).toReturnWith(true)
        expect(mockResponse.send).toHaveBeenCalled()
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
    })

    it('should return status code 404 when product does not have stock', async () => {
        const mockResponse = newResponse()
        await cartController.checkStock(existentProductIdsWithoutStock, mockResponse)
        expect(spyProductsService.exists).toHaveBeenCalledTimes(3)
        expect(spyProductsService.exists).toReturnWith(true)
        expect(spyProductsService.checkProductAvailability).toHaveBeenCalledTimes(3)
        expect(spyProductsService.checkProductAvailability).toReturnWith(false)
        expect(mockResponse.send).not.toHaveBeenCalled()
        expect(mockResponse.json).toHaveBeenCalledWith(["1063", "1064", "1065"])
        expect(mockResponse.status).toHaveBeenCalledWith(404)
    })

    it('should return status code 404 when product does not exists', async () => {
        const mockResponse = newResponse()
        await cartController.checkStock(nonExistentProductIds, mockResponse)
        expect(spyProductsService.exists).toHaveBeenCalledTimes(3)
        expect(spyProductsService.exists).toReturnWith(false)
        expect(spyProductsService.checkProductAvailability).not.toHaveBeenCalled()
        expect(mockResponse.send).not.toHaveBeenCalled()
        expect(mockResponse.json).toHaveBeenCalledWith(["1", "2", "3"])
        expect(mockResponse.status).toHaveBeenCalledWith(404)
    })

    it('should return status code 500 whenan unexpected error happens ', async () => {
        jest.spyOn(spyProductsService, 'exists').mockRejectedValueOnce(new Error('Internal Error'))
        const mockResponse = newResponse()
        await cartController.checkStock(nonExistentProductIds, mockResponse)
        expect(spyProductsService.exists).toHaveBeenCalledTimes(1)
        expect(spyProductsService.checkProductAvailability).not.toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith({ "error": "Unexpected error happens, try again" })
        expect(mockResponse.json).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(500)
    })

})