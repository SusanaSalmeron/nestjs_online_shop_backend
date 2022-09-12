import { Test, TestingModule } from "@nestjs/testing"
import { mockFindOneProductOnWishlist } from "./mockDataForWishlistServiceTest"
import { WishlistService } from "./wishlist.service"



describe('WishlistService', () => {
    let wishlistService: WishlistService

    let wishlistMockDBCollection

    beforeEach(async () => {
        wishlistMockDBCollection = {
            findOne: jest.fn(mockFindOneProductOnWishlist)
        }

        const dbProvider = {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                return {
                    getCollection: jest.fn().mockImplementation(() => {
                        return wishlistMockDBCollection
                    })
                }
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [WishlistService, dbProvider]
        }).compile()

        wishlistService = module.get<WishlistService>(WishlistService)
    })

    it('should return true when product is on wishlist', async () => {
        const productFinded = await wishlistService.findProductOnWishlist(1, 1)
        expect(productFinded).toBeTruthy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 1, productId: 1 })
    })

    it('should return false when product is not on wishlist', async () => {
        const productFinded = await wishlistService.findProductOnWishlist(1, 6)
        expect(productFinded).toBeFalsy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 1, productId: 6 })
    })

    it('should return false when user does not exists', async () => {
        const productFinded = await wishlistService.findProductOnWishlist(8, 1)
        expect(productFinded).toBeFalsy()
        expect(wishlistMockDBCollection.findOne).toHaveBeenCalledWith({ userId: 8, productId: 1 })
    })
})