import { ApiProperty } from '@nestjs/swagger';

export class MenuResponseDto {
  @ApiProperty({ example: 'Cheese Burger' })
  name: string;

  @ApiProperty({ example: 'Delicious cheese burger' })
  description: string;

  @ApiProperty({ example: 12.99 })
  price: number;

  @ApiProperty({ example: 10 })
  stock: number;
}

