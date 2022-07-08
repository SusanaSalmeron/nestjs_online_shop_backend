import { Module } from "@nestjs/common";
import { UsersController } from "src/controllers/users/users.controller";
import { SearchService } from "../services/search.service";



@Module({
    providers: [SearchService],
    controllers: [UsersController]
})

export class SearchModule { }