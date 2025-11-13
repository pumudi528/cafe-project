import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/cafe'), // MongoDB connection
    AuthModule,
    MenuModule,
    OrdersModule,
    UserModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
