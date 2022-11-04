import { Review } from "./review";
export class ReviewToShow extends Review {
    userName: string;
    surname: string;

    constructor(id, productId, productName, userName, surname, rating, comment) {
        super(id, productId, productName, rating, comment)
        this.userName = userName;
        this.surname = surname;
    }
}