import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Menu, MenuDocument } from '../menu/schemas/menu.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
  ) {}

  // Place a new order
  async create(createOrderDto: CreateOrderDto) {
    const { customerId, items } = createOrderDto;

    // 1. Check active orders for customer
    const activeOrdersCount = await this.orderModel.countDocuments({
      customerId,
      status: { $in: ['Placed', 'Preparing', 'Ready'] },
    });
    if (activeOrdersCount >= 2) {
      throw new BadRequestException('Customer has maximum 2 active orders');
    }

    // 2. Check stock availability
    for (const item of items) {
      const menuItem = await this.menuModel.findById(item.menuId);
      if (!menuItem) throw new BadRequestException(`Menu item not found: ${item.menuId}`);
      if (item.quantity > menuItem.stock) {
        throw new BadRequestException(`Insufficient stock for ${menuItem.name}`);
      }
    }

    // 3. Reduce stock for ordered items
    for (const item of items) {
      await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: -item.quantity } });
    }

    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

  // List active orders
  async findActive() {
    return this.orderModel
      .find({ status: { $in: ['Placed', 'Preparing', 'Ready'] } })
      .sort({ priority: -1, createdAt: -1 });
  }

  // Update order status
  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const validTransitions = {
      Placed: ['Preparing', 'Cancelled'],
      Preparing: ['Ready', 'Cancelled'],
      Ready: ['PickedUp', 'Abandoned'],
    };

    if (
      order.status in validTransitions &&
      !validTransitions[order.status].includes(updateStatusDto.status as any)
    ) {
      throw new BadRequestException(`Cannot change status from ${order.status} to ${updateStatusDto.status}`);
    }

    // If cancelling or abandoning, restore stock
    if (['Cancelled', 'Abandoned'].includes(updateStatusDto.status)) {
      for (const item of order.items) {
        await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: item.quantity } });
      }
      if (updateStatusDto.status === 'Abandoned') order.abandonedAt = new Date();
    }

    if (updateStatusDto.status === 'Ready') order.readyAt = new Date();

    // Type casting to fix TS error
    order.status = updateStatusDto.status as Order['status'];
    return order.save();
  }

  // Delete order and restore stock
  async delete(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    // Restore stock for all items
    for (const item of order.items) {
      await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: item.quantity } });
    }

    await this.orderModel.findByIdAndDelete(id);
    return { message: 'Order deleted and stock restored successfully' };
  }

  // Auto-abandon Ready orders after 30 minutes
  async autoAbandon() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const readyOrders = await this.orderModel.find({
      status: 'Ready',
      readyAt: { $lte: thirtyMinutesAgo },
    });

    for (const order of readyOrders) {
      order.status = 'Abandoned';
      order.abandonedAt = new Date();
      await order.save();

      // Restore stock
      for (const item of order.items) {
        await this.menuModel.findByIdAndUpdate(item.menuId, { $inc: { stock: item.quantity } });
      }
    }
  }
}
