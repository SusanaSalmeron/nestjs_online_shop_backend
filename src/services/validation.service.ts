import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidationService {
    private readonly emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


    async validateEmail(email) {
        return this.emailRegex.test(email.toLowerCase())
    }


}





