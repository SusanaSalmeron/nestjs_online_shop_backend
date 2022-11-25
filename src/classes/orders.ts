export class Orders {
    id: number;
    userId: number;
    name: string;
    surname: string;
    deliveryAddress: string;
    postalZip: string;
    city: string;
    country: string;
    orderDate: string;
    status: string;


    constructor(id, userId, name, surname, deliveryAddress, postalZip, city, country, orderDate, status) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.deliveryAddress = deliveryAddress;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.orderDate = orderDate;
        this.status = status;
    }
}