import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  contactNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: {
      houseNumber: String,
      lane1: String,
      lane2: String,
      city: String,
      postalCode: String,
    },
    required: true,
  })
  address: {
    houseNumber: string;
    lane1: string;
    lane2?: string;
    city: string;
    postalCode: string;
  };
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
