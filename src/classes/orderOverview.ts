import { OrderProductsOverview } from "./orderProductsOverview";

export class OrderOverview {
    order_id: number;
    name: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    order_date: string;
    status: string;
    products: OrderProductsOverview[];
    total_order: number;

    constructor(order_id, name, surname, address, postalZip, city, country, order_date, status, products, total_order) {
        this.order_id = order_id;
        this.name = name;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.order_date = order_date;
        this.status = status;
        this.products = products;
        this.total_order = total_order;
    }


}