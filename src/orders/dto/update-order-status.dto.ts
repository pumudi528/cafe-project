import { IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(['Placed', 'Preparing', 'Ready', 'PickedUp', 'Cancelled', 'Abandoned'])
  status: 'Placed' | 'Preparing' | 'Ready' | 'PickedUp' | 'Cancelled' | 'Abandoned';
}


