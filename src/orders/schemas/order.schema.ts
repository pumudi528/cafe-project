import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document & { createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  items: { menuId: string; quantity: number }[];

  @Prop({ default: 'Placed' })
  status: 'Placed' | 'Preparing' | 'Ready' | 'PickedUp' | 'Cancelled' | 'Abandoned';

  @Prop({ default: false })
  priority: boolean;

  @Prop()
  readyAt?: Date;

  @Prop()
  abandonedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

