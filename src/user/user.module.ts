import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MenuModule } from '../menu/menu.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MenuModule,      
    OrdersModule,    
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
