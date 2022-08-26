export class Wishlist {
    userId: string;
    productId: string;

    constructor(userId, productId) {
        this.userId = userId;
        this.productId = productId;
    }
}