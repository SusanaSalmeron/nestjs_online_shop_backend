
export class UpdateBillingAddress {
    user_name: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    identification: string;

    constructor(user_name, surname, address, postalZip, city, country, identification) {
        this.user_name = user_name;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.identification = identification;
    }

}