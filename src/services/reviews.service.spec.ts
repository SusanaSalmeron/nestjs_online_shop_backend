import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { ReviewToShow } from "../classes/reviewToShow";
import { mockFindOneUser, mockFindReviews, } from "./mockDataForReviewsServiceTest";
import { ReviewsService } from "./reviews.service";


describe('Reviews Service', () => {
    let reviewsService: ReviewsService;

    let reviewsMockDBCollection
    let usersMockDBCollection

    beforeEach(async () => {
        reviewsMockDBCollection = {
            find: jest.fn().mockImplementation(mockFindReviews),
        }

        usersMockDBCollection = {
            findOne: jest.fn().mockImplementation(mockFindOneUser)
        }

        const dbProvider = {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                return {
                    getCollection: jest.fn().mockImplementation((tableName) => {
                        const collections = {
                            "reviews": reviewsMockDBCollection,
                            "users": usersMockDBCollection,
                        }
                        return collections[tableName]
                    })
                }
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [ReviewsService, dbProvider],
            imports: [HttpModule]
        }).compile()

        reviewsService = module.get<ReviewsService>(ReviewsService)
    })

    it('returns true when review from user exists', async () => {
        const existsReview = await reviewsService.existsReviewFromUser("1061", 1000)
        expect(existsReview).toBeTruthy()
        expect(reviewsMockDBCollection.find).toHaveBeenCalledWith({ userId: 1000 })
    })

    it('return false when review from user does not exist', async () => {
        const existsReview = await reviewsService.existsReviewFromUser("1100", 1000)
        expect(existsReview).toBeFalsy()
        expect(reviewsMockDBCollection.find).toHaveBeenCalledWith({ userId: 1000 })
    })

    it('returns reviews from product when has reviews', async () => {
        const reviewsFromProduct = await reviewsService.getReviewsFromProduct(1062)
        expect(reviewsFromProduct).toStrictEqual
            ([new ReviewToShow(
                2,
                1062,
                "Puff Paint Liquid Blush",
                "Joseph",
                "Hinton",
                4,
                "Really beautiful blush, the colour is immaculate, and it’s not insanely pigmented that you feel that you put too much on. Would recommend! Not a lot of product inside though composed to others like Nars Orgasim Liquid Blush."
            ),
            (new ReviewToShow(
                3,
                1062,
                "Puff Paint Liquid Blush",
                "Evan",
                "Pennington",
                5,
                "This is my go to blush for everyday dewy makeup looks. I really like the consistency and the color. And this was my first ever liquid blush purchase and I don’t regret buying it."
            ))
            ])
        expect(reviewsMockDBCollection.find).toHaveBeenCalledWith({ "productId": 1062 })
        expect(usersMockDBCollection.findOne).toHaveBeenCalledWith({ "id": 1000 })

    })

    it('returns null when product does not have reviews', async () => {
        const reviewsFromProduct = await reviewsService.getReviewsFromProduct(1100)
        expect(reviewsFromProduct).toBeNull()
        expect(reviewsMockDBCollection.find).toHaveBeenCalledWith({ "productId": 1100 })
        expect(usersMockDBCollection.findOne).not.toHaveBeenCalled()
    })
})