import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { ReviewsService } from './services/reviews.service';
import { ValidationService } from './services/validation.service';
import { AuthenticateTokenMiddleware } from './middlewares/authenticateToken.middleware';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, HttpModule, OrdersModule],
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService, UsersService, TokenService, SearchService, ProductsService, ShadowCopyService, OrdersService, WishlistService, ReviewsService, ValidationService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateTokenMiddleware)
      .exclude(
        { path: 'v1/products/new', method: RequestMethod.GET },
        { path: 'v1/products/type', method: RequestMethod.GET },
        { path: 'v1/products/:id', method: RequestMethod.GET },
        { path: 'v1/users/search', method: RequestMethod.GET },
        { path: 'v1/users/search/:keyword', method: RequestMethod.GET },
        { path: 'v1/users/login', method: RequestMethod.POST },
        { path: 'v1/users/signup', method: RequestMethod.POST },
        { path: 'v1/users/search', method: RequestMethod.GET },
        { path: 'v1/products/:id/reviews', method: RequestMethod.GET }
      )
      .forRoutes('/')

  }
}
