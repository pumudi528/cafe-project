import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddressDto {
  @ApiProperty({ example: '123', description: 'House number' })
  @IsNotEmpty()
  houseNumber: string;

  @ApiProperty({ example: 'Main Street', description: 'Lane 1' })
  @IsNotEmpty()
  lane1: string;

  @ApiProperty({ example: 'Second Lane', description: 'Lane 2', required: false })
  @IsOptional()
  lane2?: string;

  @ApiProperty({ example: 'Colombo', description: 'City' })
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: '10000', description: 'Postal code' })
  @IsNotEmpty()
  postalCode: string;
}
