import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  // Create a new customer (signup)
  async create(createCustomerDto: CreateCustomerDto): Promise<any> {
    // Check if contact number already exists
    const existingCustomer = await this.customerModel.findOne({
      contactNumber: createCustomerDto.contactNumber,
    });
    if (existingCustomer) {
      throw new ConflictException('Contact number already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);

    // Create customer
    const createdCustomer = new this.customerModel({
      ...createCustomerDto,
      password: hashedPassword,
    });

    // Save to database
    const savedCustomer = await createdCustomer.save();

    // Return a new object without the password
    const { password, ...customerObjWithoutPassword } = savedCustomer.toObject();
    return customerObjWithoutPassword;
  }

  // Optional: Get all customers (for testing)
  async findAll(): Promise<any[]> {
    const customers = await this.customerModel.find().lean(); // plain JS objects
    // Return new objects without passwords
    return customers.map(({ password, ...c }) => c);
  }
}

