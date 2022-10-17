export class OrderProductsOverview {
    productName: string;
    product_brand: string;
    product_colour: string
    price: number
    units: number;
    product_total: number;

    constructor(productName, product_brand, product_colour, price, units, product_total) {
        this.productName = productName;
        this.product_brand = product_brand;
        this.product_colour = product_colour;
        this.price = price;
        this.units = units;
        this.product_total = product_total
    }

}