import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Cheese Burger', description: 'Name of the menu item' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Delicious cheese burger', description: 'Description of the menu item' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 12.99, description: 'Price of the menu item' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10, description: 'Stock of the menu item' })
  @IsNumber()
  @IsPositive()
  stock: number; 
}


