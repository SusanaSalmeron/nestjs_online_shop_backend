export class OrderProductsOverview {
    product_name: string;
    product_brand: string;
    product_colour: string
    price: number
    units: number;
    product_total: number;

    constructor(product_name, product_brand, product_colour, price, units, product_total) {
        this.product_name = product_name;
        this.product_brand = product_brand;
        this.product_colour = product_colour;
        this.price = price;
        this.units = units;
        this.product_total = product_total
    }

}