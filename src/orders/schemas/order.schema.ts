import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus } from '../dto/update-order-status.dto'; 

export type OrderDocument = Order & Document & { createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  items: { menuId: string; quantity: number }[];

  @Prop({ default: OrderStatus.PLACED, enum: Object.values(OrderStatus) })
  status: OrderStatus;

  @Prop({ default: false })
  priority: boolean;

  @Prop()
  readyAt?: Date;

  @Prop()
  abandonedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
