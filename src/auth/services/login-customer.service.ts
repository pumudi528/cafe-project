import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../schemas/customer.schema';
import { LoginCustomerDto } from '../dto/login-customer.dto';

@Injectable()
export class LoginCustomerService {   // <- match import name
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginCustomerDto) {
    const customer = await this.customerModel.findOne({ contactNumber: loginDto.contactNumber });
    if (!customer) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(loginDto.password, customer.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: customer._id, role: 'customer' };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        contactNumber: customer.contactNumber,
      },
    };
  }
}
