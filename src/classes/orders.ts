export class Orders {
    id: number;
    userId: number;
    deliveryAddressId: number;
    orderDate: string;
    status: string;


    constructor(id, userId, deliveryAddressId, orderDate, status) {
        this.id = id;
        this.userId = userId;
        this.deliveryAddressId = deliveryAddressId;
        this.orderDate = orderDate;
        this.status = status;
    }
}