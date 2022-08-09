export class AccountUserAddresses {
    id: number;
    user_name: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    defaultAddress: boolean;
    userId: number

    constructor(id, user_name, surname, address, postalZip, city, country, defaultAddress, userId) {
        this.id = id;
        this.user_name = user_name;
        this.surname = surname
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.defaultAddress = defaultAddress;
        this.userId = userId;
    }
}