import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginCustomerDto {
  @ApiProperty({ example: '0712345678', description: 'Customer contact number' })
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty({ example: 'password123', description: 'Customer password' })
  @IsNotEmpty()
  password: string;
}



