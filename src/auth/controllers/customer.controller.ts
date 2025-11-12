import { Controller, Post, Body, Get } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Signup endpoint
  @Post('signup')
  async signup(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  // Optional: List all customers (for testing)
  @Get()
  async findAll() {
    return this.customerService.findAll();
  }
}

