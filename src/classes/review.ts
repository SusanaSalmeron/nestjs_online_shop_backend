export class Review {
    id: number;
    productId: number;
    productName: string;
    rating: number;
    comments: string;

    constructor(id, productId, productName, rating, comments) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.rating = rating;
        this.comments = comments;
    }



}