import { Injectable, Inject, Logger } from "@nestjs/common";
import * as loki from 'lokijs';
import { ReviewToShow } from "../classes/reviewToShow";
import { Review } from "../classes/review";

@Injectable()
export class ReviewsService {
    private readonly logger = new Logger(ReviewsService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki) { }

    async existsReviewFromUser(productId: string, userId: number): Promise<boolean> {
        const reviewsTable = this.db.getCollection('reviews')
        const foundReviews: Review[] = reviewsTable.find({ userId: userId })
        this.logger.log(`Reviews from user ${userId}found successfully`)
        const productHasReview = foundReviews.filter(r =>
            r.productId === parseInt(productId))
        if (productHasReview.length === 0) {
            this.logger.log('The review does not exist')
            return false
        } else {
            this.logger.log('The review exists')
            return true
        }
    }

    async getReviewsFromProduct(id: number): Promise<Review[]> {
        const reviewsTable = this.db.getCollection('reviews')
        const usersTable = this.db.getCollection('users')
        let reviews: Review[]
        const foundReviews = reviewsTable.find({ productId: id })
        if (foundReviews) {
            this.logger.log(`Reviews from product ${id} found successfully`)
            reviews = foundReviews.map(r => {
                return new ReviewToShow(
                    r.id,
                    r.productId,
                    r.productName,
                    usersTable.findOne({ id: r.userId }).userName,
                    usersTable.findOne({ id: r.userId }).surname,
                    r.rating,
                    r.comment
                )
            })
        } else {
            this.logger.warn(`Product ${id} has not rewiews`)
            return null
        }
        this.logger.log(`Showing reviews from product ${id}`)
        return reviews
    }
}


