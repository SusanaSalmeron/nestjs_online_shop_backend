import { ProductWithoutReview } from "./productWithoutReview";
import { Review } from "./review";


export class Reviews {
    pending: ProductWithoutReview[];
    created: Review[];

    constructor(pending, created) {
        this.pending = pending;
        this.created = created;
    }
}