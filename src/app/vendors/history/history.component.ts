import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  private _snackBar = inject(MatSnackBar);

  userId:any;
  orders: any[] = [];
  selectedStatus: string = '';
  selectedOrder: any | null = null;
  isPanelOpen = false;

  displayedColumns: string[] = ['id', 'customer', 'total', 'orderDate', 'orderTime', 'status'];

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private orderService: OrderService, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.fetchOrders();
    setInterval(() => this.fetchOrders(), 5000); // Polling every 5 sec
  }

  fetchOrders(): void {
    this.orderService.getOrdersByRestaurantId(this.userId).subscribe({
      next: (response) => {
        if(response.body===null){
          this._snackBar.open('Orders not found', 'Dismiss', {duration: 3000})
        }
        else{
          const allowedStatuses = [ 'OUT_FOR_DELIVERY', 'DELIVERED'];
          this.orders = response.body.data.filter((order: any) => allowedStatuses.includes(order.orderStatus));
        }
      },
      error: (error: any) => {
        this._snackBar.open(error.error.message, 'Dismiss', {duration: 3000})
      }
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
