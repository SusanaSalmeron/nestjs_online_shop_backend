import { Injectable, Logger, Inject } from "@nestjs/common";
import * as loki from 'lokijs'


@Injectable()
export class WishlistService {
    private readonly logger = new Logger(WishlistService.name)
    constructor(@Inject('DATABASE_CONNECTION') private db: loki,) { }

    async findProductOnWishlist(userId: number, productId: number): Promise<boolean> {
        const wishedProductsTable = this.db.getCollection('wishlist')
        const product = wishedProductsTable.findOne({ userId: userId, productId: productId })
        return product
    }
}