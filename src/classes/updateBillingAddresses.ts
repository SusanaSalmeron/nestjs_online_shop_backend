
export class UpdateBillingAddress {
    id: number;
    userName: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    password: string;
    identification: string;


    constructor(id, userName, surname, address, postalZip, city, country, identification, dateOfBirth, email, phone, password) {
        this.id = id
        this.userName = userName;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.identification = identification;
    }

}