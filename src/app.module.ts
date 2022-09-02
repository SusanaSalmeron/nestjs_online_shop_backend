import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { UsersService } from './services/users.service';
import { TokenService } from './services/token.service';
import { SearchService } from './services/search.service';
import { ProductsService } from './services/products.service';
import { ShadowCopyService } from './services/shadowCopy.service';
import { UsersController } from './controllers/users/users.controller';
import { AppController } from './app.controller';
import { ProductsController } from './controllers/products/products.controller';
import { OrdersModule } from './modules/orders.module';
import { OrdersService } from './services/orders.service';
import { WishlistService } from './services/wishlist.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, HttpModule, OrdersModule],
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService, UsersService, TokenService, SearchService, ProductsService, ShadowCopyService, OrdersService, WishlistService],
})
export class AppModule { }
