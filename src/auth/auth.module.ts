import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema, Customer } from './schemas/customer.schema';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    JwtModule.register({
      secret: 'your_jwt_secret', // put in .env in real project
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class AuthModule {}
