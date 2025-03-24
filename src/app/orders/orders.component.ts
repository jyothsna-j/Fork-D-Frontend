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

  liveOrders: any[] = [];
  pastOrders: any[] = []
  displayedColumns = ['orderId', 'restaurantName']

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
}
