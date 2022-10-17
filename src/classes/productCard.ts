export class ProductCard {
    id: number;
    brand: string;
    name: string;
    price: string;
    description: string;
    productType: string;
    api_featured_image: string;
    product_colors: string[];

    constructor(id, brand, name, price, description, productType, api_featured_image, product_colors) {
        this.id = id;
        this.brand = brand;
        this.name = name;
        this.price = price;
        this.description = description;
        this.productType = productType
        this.api_featured_image = api_featured_image;
        this.product_colors = product_colors
    }
}