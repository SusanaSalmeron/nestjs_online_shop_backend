export class Review {
    id: number;
    productId: number;
    productName: string;
    rating: number;
    comment: string;

    constructor(id, productId, productName, rating, comment) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.rating = rating;
        this.comment = comment;
    }



}