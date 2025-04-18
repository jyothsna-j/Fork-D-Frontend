import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-live-orders',
  templateUrl: './live-orders.component.html',
  styleUrls: ['./live-orders.component.css'],
})
export class LiveOrdersComponent implements OnInit {
  userId:any;
  orders: any[] = [];
  selectedStatus: string = '';
  selectedOrder: any | null = null;
  isPanelOpen = false;

  orderStatuses = ['PENDING', 'PREPARING', 'PREPARED', 'OUT_FOR_DELIVERY'];
  displayedColumns: string[] = ['id', 'customer', 'total', 'orderDate', 'orderTime', 'status', 'update'];

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private orderService: OrderService, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.fetchOrders();
    setInterval(() => this.fetchOrders(), 5000); // Polling every 5 sec
  }

  fetchOrders(): void {
    this.orderService.getOrdersByRestaurantId(this.userId).subscribe((data) => {
      const allowedStatuses = [ 'ORDER_APPROVED', 'PENDING', 'PREPARING', 'PREPARED'];
  
      this.orders = data.filter((order: any) => allowedStatuses.includes(order.orderStatus));
    });
  }

  filteredOrders(): any[] {
    return this.selectedStatus
      ? this.orders.filter((order) => order.orderStatus === this.selectedStatus)
      : this.orders;
  }

  updateStatus(order: any): void {
    this.orderService.updateOrderStatus(order.orderId, order.orderStatus);
    this.snackBar.open('Order status updated', 'OK', { duration: 2000 })
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
