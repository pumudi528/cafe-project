import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John', description: 'Customer first name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Customer last name' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '0712345678', description: 'Customer contact number' })
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty({ example: 'password123', description: 'Customer password (will be hashed)' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Customer address details', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
