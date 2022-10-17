export class OrderPosition {
    id: number;
    orderId: number;
    productId: number;
    productName: string;
    colour_name: string;
    units: number;
    total: number;


    constructor(id, orderId, productId, productName, colour_name, units, total) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId
        this.productName = productName
        this.colour_name = colour_name;
        this.units = units;
        this.total = total
    }
}