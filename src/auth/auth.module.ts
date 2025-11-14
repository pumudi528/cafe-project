import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomerService } from './services/customer.service';
import { LoginCustomerService } from './services/login-customer.service';
import { StaffService } from './services/staff.service';
import { CustomerController } from './controllers/customer.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    JwtModule.register({
      secret: 'your_jwt_secret', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CustomerController, AuthController],
  providers: [CustomerService, LoginCustomerService, StaffService],
})
export class AuthModule {}
