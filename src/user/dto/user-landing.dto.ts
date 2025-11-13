// src/user/dto/user-landing.dto.ts
export class UserLandingDto {
  message: string;
  actions: { title: string; route: string }[];
  menu: any[];
  recentOrders: any[];
}
