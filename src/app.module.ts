import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { UsersService } from './services/users.service';
import { TokenService } from './services/token.service';
import { SearchService } from './services/search.service';
import { ProductService } from './services/product.service';
import { ShadowCopyService } from './services/shadowCopy.service';
import { UsersController } from './controllers/users/users.controller';
import { AppController } from './app.controller';
import { ProductController } from './controllers/products/product.controller';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, HttpModule],
  controllers: [AppController, UsersController, ProductController],
  providers: [AppService, UsersService, TokenService, SearchService, ProductService, ShadowCopyService],
})
export class AppModule { }
