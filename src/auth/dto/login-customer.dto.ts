import { IsNotEmpty } from 'class-validator';

export class LoginCustomerDto {
  @IsNotEmpty()
  contactNumber: string;

  @IsNotEmpty()
  password: string;
}

