import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // ✅ import these
import { StaffService } from '../services/staff.service';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { LoginStaffDto } from '../dto/login-staff.dto';
import { LoginCustomerService } from '../services/login-customer.service';

@ApiTags('Auth') // ✅ this makes it appear as a "Auth" section in Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginCustomerService: LoginCustomerService,
    private readonly staffService: StaffService,
  ) {}

  @Post('customer/login')
  @ApiOperation({ summary: 'Login for customers' })
  @ApiResponse({ status: 200, description: 'Customer successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginCustomer(@Body() loginDto: LoginCustomerDto) {
    try {
      return await this.loginCustomerService.login(loginDto);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('staff/login')
  @ApiOperation({ summary: 'Login for staff members' })
  @ApiResponse({ status: 200, description: 'Staff successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginStaff(@Body() loginDto: LoginStaffDto) {
    try {
      return await this.staffService.login(loginDto);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.UNAUTHORIZED);
    }
  }
}
