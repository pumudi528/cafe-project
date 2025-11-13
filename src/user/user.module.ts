// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MenuModule } from '../menu/menu.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MenuModule,      // import module that provides MenuService
    OrdersModule,    // import module that provides OrdersService
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
