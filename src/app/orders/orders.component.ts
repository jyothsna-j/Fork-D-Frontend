import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import _ from 'lodash';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  safeUrl!: SafeResourceUrl;

  orders: any[] = [];
  selectedStatus: string = '';
  selectedOrder: any | null = null;
  isPanelOpen = false;

  liveOrders: any[] = [];
  pastOrders: any[] = []
  displayedColumns = ['orderId', 'restaurantName', 'amount', 'orderDate', 'status', 'dstatus', 'trackOrder']

  constructor(private userService: UserService, private orderService: OrderService, private sanitizer: DomSanitizer) {}

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
      const [live, past] = _.partition(orders, (order) =>
        order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'INVALID_PAYMENT'
      );
      

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
    this.orderService.getRiderDetails(order.orderId).subscribe({
      next: (data) => {
        order.riderDetails = data;
        const url = this.selectedOrder?.riderDetails?.tracking_url;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (error) => {

      }
    });
    this.selectedOrder = order;
    this.isPanelOpen = true;
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.selectedOrder = null;
  }
}
