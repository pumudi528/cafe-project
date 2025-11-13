// src/orders/orders.controller.ts
import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDocument } from './schemas/order.schema';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active orders' })
  @ApiResponse({ status: 200, description: 'List of active orders' })
  async findActive() {
    const orders = await this.ordersService.findActive();

    // Map orders to include formatted timestamps
    return orders.map((order: OrderDocument) => {
      const obj = order.toObject();
      return {
        ...obj,
        createdAt: obj.createdAt
          ? obj.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
          : null,
        updatedAt: obj.updatedAt
          ? obj.updatedAt.toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
          : null,
        readyAt: obj.readyAt
          ? obj.readyAt.toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
          : null,
        abandonedAt: obj.abandonedAt
          ? obj.abandonedAt.toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
          : null,
      };
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}



