import { Module } from "@nestjs/common";
import { UserController } from "src/controllers/users/user.controller";
import { SearchService } from "../services/search.service";



@Module({
    providers: [SearchService],
    controllers: [UserController]
})

export class SearchModule { }