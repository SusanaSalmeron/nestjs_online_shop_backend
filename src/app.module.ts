import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './services/users.service';
import { TokenService } from './services/token.service';
import { UsersController } from './controllers/users/users.controller';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SearchService } from './services/search.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, HttpModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, TokenService,
    SearchService],
})
export class AppModule { }
