export class Product {
    id: string
    name: string;
    brand: string;
    price: number;
    api_featured_image: string;

    constructor(id, name, brand, price, api_featured_image) {
        this.id = id
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.api_featured_image = api_featured_image;
    }

}