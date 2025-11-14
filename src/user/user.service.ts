import { Injectable } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';
import { OrdersService } from '../orders/orders.service';
import { Menu } from '../menu/schemas/menu.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly menuService: MenuService,
    private readonly ordersService: OrdersService
  ) {}

  async getLandingData(userId: string) {
    if (!userId || userId.trim() === '') {
      return {
        message: 'Invalid user ID',
        actions: [],
        menu: [],
        recentOrders: [],
      };
    }

    let availableMenu: Menu[] = [];
    let recentOrders: Order[] = [];

    try {
      availableMenu = await this.menuService.getAvailableMenu();
    } catch (err) {
      console.error('Error fetching menu:', err);
      availableMenu = [];
    }

    try {
      recentOrders = await this.ordersService.getOrdersByUser(userId);
    } catch (err) {
      console.error('Error fetching orders:', err);
      recentOrders = [];
    }

    return {
      message: 'Welcome to i360 Cafe!',
      actions: [
        { title: 'View Menu', route: '/menu/available' },
        { title: 'Place Order', route: '/orders' },
        { title: 'Order History', route: `/orders/user/${userId}` },
      ],
      menu: availableMenu,
      recentOrders,
    };
  }
}
