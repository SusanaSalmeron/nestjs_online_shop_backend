export class AccountUserData {
    id: number;
    user_name: string;
    surname: string;
    address: string;
    postalZip: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    date_of_birth: string;
    identification: string;
    password: string

    constructor(id, user_name, surname, address, postalZip, city, country, phone, email, date_of_birth, identification, password) {
        this.id = id;
        this.user_name = user_name;
        this.surname = surname;
        this.address = address;
        this.postalZip = postalZip;
        this.city = city;
        this.country = country;
        this.phone = phone;
        this.email = email;
        this.date_of_birth = date_of_birth;
        this.identification = identification;
        this.password = password
    }
}