export class Wishlist {
    id: number;
    userId: number;
    productId: number;

    constructor(id, userId, productId) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
    }
}