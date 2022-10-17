export class AccountUserAddresses {
    id: number;
    userName: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    defaultAddress: boolean;
    userId: number

    constructor(id, userName, surname, address, postalZip, city, country, defaultAddress, userId) {
        this.id = id;
        this.userName = userName;
        this.surname = surname
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.defaultAddress = defaultAddress;
        this.userId = userId;
    }
}