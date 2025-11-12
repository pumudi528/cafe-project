// src/auth/controllers/auth.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { StaffService } from '../services/staff.service';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { LoginStaffDto } from '../dto/login-staff.dto';
import { LoginCustomerService } from '../services/login-customer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginCustomerService: LoginCustomerService,
    private readonly staffService: StaffService,
  ) {}

  // Customer login
  @Post('customer/login')
  async loginCustomer(@Body() loginDto: LoginCustomerDto) {
    try {
      return await this.loginCustomerService.login(loginDto);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.UNAUTHORIZED);
    }
  }

  // Staff login
  @Post('staff/login')
  async loginStaff(@Body() loginDto: LoginStaffDto) {
    try {
      return await this.staffService.login(loginDto);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.UNAUTHORIZED);
    }
  }
}

