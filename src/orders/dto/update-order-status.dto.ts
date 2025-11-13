// src/orders/dto/update-order-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
  PLACED = 'Placed',
  PREPARING = 'Preparing',
  READY = 'Ready',
  PICKED_UP = 'PickedUp',
  CANCELLED = 'Cancelled',
  ABANDONED = 'Abandoned',
}

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'New status of the order', enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}


