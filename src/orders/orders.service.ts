import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto';
import { Menu, MenuDocument } from '../menu/schemas/menu.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerId, items } = createOrderDto;

  
    const activeOrdersCount = await this.orderModel.countDocuments({
      customerId,
      status: { $in: [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY] },
    });
    if (activeOrdersCount >= 2) {
      throw new BadRequestException('Customer has maximum 2 active orders');
    }

    for (const item of items) {
      const menuItem = await this.menuModel.findById(item.menuId);
      if (!menuItem) throw new BadRequestException(`Menu item not found: ${item.menuId}`);
      if (item.quantity > menuItem.stock) {
        throw new BadRequestException(`Insufficient stock for ${menuItem.name}`);
      }
    }

   
    for (const item of items) {
      await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: -item.quantity } });
    }

    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

 
  async findActive() {
    return this.orderModel
      .find({ status: { $in: [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY] } })
      .sort({ priority: -1, createdAt: -1 });
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const validTransitions = {
      [OrderStatus.PLACED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.PICKED_UP, OrderStatus.ABANDONED],
    };

    if (
      order.status in validTransitions &&
      !validTransitions[order.status].includes(updateStatusDto.status)
    ) {
      throw new BadRequestException(`Cannot change status from ${order.status} to ${updateStatusDto.status}`);
    }

    if ([OrderStatus.CANCELLED, OrderStatus.ABANDONED].includes(updateStatusDto.status)) {
      for (const item of order.items) {
        await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: item.quantity } });
      }
      if (updateStatusDto.status === OrderStatus.ABANDONED) order.abandonedAt = new Date();
    }

    if (updateStatusDto.status === OrderStatus.READY) order.readyAt = new Date();

    order.status = updateStatusDto.status;
    return order.save();
  }

  async delete(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    for (const item of order.items) {
      await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: item.quantity } });
    }

    await this.orderModel.findByIdAndDelete(id);
    return { message: 'Order deleted and stock restored successfully' };
  }

  async autoAbandon() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const readyOrders = await this.orderModel.find({
      status: OrderStatus.READY,
      readyAt: { $lte: thirtyMinutesAgo },
    });

    for (const order of readyOrders) {
      order.status = OrderStatus.ABANDONED;
      order.abandonedAt = new Date();
      await order.save();

     
      for (const item of order.items) {
        await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: item.quantity } });
      }
    }
  }

 
  async getOrdersByUser(userId: string) {
    return this.orderModel
      .find({ customerId: userId })
      .populate('items')
      .sort({ createdAt: -1 })
      .exec();
  }
}
