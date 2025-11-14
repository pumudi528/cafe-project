import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('landing/:userId')
  async getLanding(@Param('userId') userId: string) {
    console.log('Received userId:', userId); 
    return this.userService.getLandingData(userId);
  }
}
