import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDocument } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
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
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}


