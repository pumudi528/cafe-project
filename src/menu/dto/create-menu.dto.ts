import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: 'Cheese Burger', description: 'Name of the menu item' })
  name: string;

  @ApiProperty({ example: 'Delicious cheese burger', description: 'Description of the menu item' })
  description: string;

  @ApiProperty({ example: 12.99, description: 'Price of the menu item' })
  price: number;

  @ApiPropertyOptional({ example: 10, description: 'Stock of the menu item (optional)' })
  stock?: number;
}


