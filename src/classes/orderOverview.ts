import { OrderProductsOverview } from "./orderProductsOverview";

export class OrderOverview {
    orderId: number;
    name: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    orderDate: string;
    status: string;
    products: OrderProductsOverview[];
    totalOrder: number;

    constructor(orderId, name, surname, address, postalZip, city, country, orderDate, status, products, totalOrder) {
        this.orderId = orderId;
        this.name = name;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.orderDate = orderDate;
        this.status = status;
        this.products = products;
        this.totalOrder = totalOrder;
    }


}