export class ProductCard {
    id: string;
    brand: string;
    name: string;
    price: string;
    description: string;
    tag_list: string[]
    api_featured_image: string;
    product_colors: string[];

    constructor(id, brand, name, price, description, tag_list, api_featured_image, product_colors) {
        this.id = id;
        this.brand = brand;
        this.name = name;
        this.price = price;
        this.description = description;
        this.tag_list = tag_list;
        this.api_featured_image = api_featured_image;
        this.product_colors = product_colors

    }


}