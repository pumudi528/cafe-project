import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginStaffDto {
  @ApiProperty({ example: 'staff@example.com', description: 'Staff email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Staff password' })
  @IsNotEmpty()
  password: string;
}



