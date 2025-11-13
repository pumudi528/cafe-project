import { IsNotEmpty, IsArray, ValidateNested, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  menuId: string;

  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsBoolean()
  priority: boolean;
}

