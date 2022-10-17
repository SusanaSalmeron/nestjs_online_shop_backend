export class AccountUserData {
    id: number;
    userName: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    identification: string;
    password: string

    constructor(id, userName, surname, address, postalZip, city, country, phone, email, dateOfBirth, identification, password) {
        this.id = id;
        this.userName = userName;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.phone = phone;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.identification = identification;
        this.password = password
    }
}