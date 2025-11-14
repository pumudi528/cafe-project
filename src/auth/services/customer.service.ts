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

  
  async create(createCustomerDto: CreateCustomerDto): Promise<any> {
    
    const existingCustomer = await this.customerModel.findOne({
      contactNumber: createCustomerDto.contactNumber,
    });
    if (existingCustomer) {
      throw new ConflictException('Contact number already registered');
    }

   
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);

    
    const createdCustomer = new this.customerModel({
      ...createCustomerDto,
      password: hashedPassword,
    });

    
    const savedCustomer = await createdCustomer.save();

    
    const { password, ...customerObjWithoutPassword } = savedCustomer.toObject();
    return customerObjWithoutPassword;
  }

  
  async findAll(): Promise<any[]> {
    const customers = await this.customerModel.find().lean(); 
    return customers.map(({ password, ...c }) => c);
  }
}

