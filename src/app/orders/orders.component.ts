import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import _ from 'lodash';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  orders: any[] = [];
  selectedStatus: string = '';
  selectedOrder: any | null = null;
  isPanelOpen = false;

  liveOrders: any[] = [];
  pastOrders: any[] = []
  displayedColumns = ['orderId', 'restaurantName', 'amount', 'status', 'trackOrder']

  constructor(private userService: UserService, private orderService: OrderService) {}

  ngOnInit(){
    const userId = this.userService.getUserId();
    this.refreshOrders(userId);
    setTimeout(() => {
      this.refreshOrders(userId);
    }, 5000); 
  }

  refreshOrders(id: any){
    let orders: any[] = [];
    this.orderService.getOrdersByCustomerId(id).subscribe((data) => {
      orders = data;
      const [live, past] = _.partition(orders, (order) => order.orderStatus !== 'DELIVERED');

      this.liveOrders = live;
      this.pastOrders = past;

      console.log('Live Orders:', this.liveOrders);
      console.log('Past Orders:', this.pastOrders);
    });

  }

  getStatusColor(status: string): string {
    return {
      'PENDING': 'warn',
      'PREPARING': 'primary',
      'PREPARED': 'accent',
      'IN TRANSIT': 'accent',
      'DELIVERED': 'primary',
    }[status] || 'default';
  }

  openPanel(order: any): void {
    this.selectedOrder = order;
    this.isPanelOpen = true;
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.selectedOrder = null;
  }
}
