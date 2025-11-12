import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginStaffDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}


