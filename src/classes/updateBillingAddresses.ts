
export class UpdateBillingAddress {
    userName: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    identification: string;

    constructor(userName, surname, address, postalZip, city, country, identification) {
        this.userName = userName;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.identification = identification;
    }

}