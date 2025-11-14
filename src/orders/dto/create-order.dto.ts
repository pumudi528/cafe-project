import { IsNotEmpty, IsArray, ValidateNested, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ description: 'ID of the menu item' })
  @IsNotEmpty()
  menuId: string;

  @ApiProperty({ description: 'Quantity of this menu item', minimum: 1 })
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the customer placing the order' })
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ 
    description: 'List of order items', 
    type: [OrderItemDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Whether this order is high priority', type: Boolean })
  @IsBoolean()
  priority: boolean;
}
