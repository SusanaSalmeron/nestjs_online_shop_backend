import { Injectable, Inject, Logger } from "@nestjs/common";
import * as loki from 'lokijs';
import { Review } from "../classes/review";

@Injectable()
export class ReviewsService {
    private readonly logger = new Logger(ReviewsService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki) { }

    async existsReviewFromUser(productId: string, userId: number): Promise<boolean> {
        const reviewsTable = this.db.getCollection('reviews')
        const foundReviews: Review[] = reviewsTable.find({ userId: userId })
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
}

